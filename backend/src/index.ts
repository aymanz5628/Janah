import type { Core } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';
import https from 'https';
import crypto from 'crypto';

const articles = [
    {
        title: "لماذا يجب عليك الاهتمام بصحتك النفسية؟",
        description: "الصحة النفسية هي جزء لا يتجزأ من صحتك العامة.",
        content: "<p>الصحة النفسية ضرورية لرفاهية الإنسان وتؤثر على طريقة تفكيرك وشعورك وتصرفاتك.</p>",
        imageUrl: "https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=800",
        category: "صحة", categorySlug: "health", slug: "mental-health-importance"
    },
    {
        title: "مستقبل الذكاء الاصطناعي في التعليم",
        description: "كيف سيغير الذكاء الاصطناعي الطريقة التي نتعلم بها؟",
        content: "<p>الذكاء الاصطناعي يحدث ثورة في التعليم من خلال تخصيص تجربة التعلم.</p>",
        imageUrl: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800",
        category: "تقنية", categorySlug: "technology", slug: "ai-in-education"
    },
    {
        title: "برنامج وقاية للياقة البدنية",
        description: "برنامج شامل لتحسين لياقتك البدنية.",
        content: "<h2>عن البرنامج</h2><p>صمم هذا البرنامج ليناسب جميع المستويات.</p>",
        imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800",
        category: "برامج", categorySlug: "programs", slug: "weqaya-fitness-program"
    },
    {
        title: "أسرار النوم العميق",
        description: "فيلم وثائقي يستكشف علم النوم.",
        content: "<p>نقضي ثلث حياتنا نائمين، ومع ذلك، لا يزال النوم لغزاً يحير العلماء.</p>",
        imageUrl: "https://picsum.photos/seed/sleep/800/600",
        category: "وثائقيات", categorySlug: "documentaries", slug: "deep-sleep-documentary"
    }
];

async function downloadImage(url: string, filepath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close(); fs.unlink(filepath, () => {});
                downloadImage(response.headers.location!, filepath).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                file.close(); fs.unlink(filepath, () => {});
                reject(new Error(`Failed: ${response.statusCode}`)); return;
            }
            response.pipe(file);
            file.on('finish', () => { file.close(() => resolve(filepath)); });
        }).on('error', (err) => { fs.unlink(filepath, () => {}); reject(err); });
    });
}

async function rawDbUpload(strapi: Core.Strapi, url: string, filenameBase: string) {
    try {
        const uploadsDir = path.join(process.cwd(), 'public/uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
        const hash = crypto.randomBytes(16).toString('hex');
        const filename = `${filenameBase}_${hash}.jpg`;
        const filePath = path.join(uploadsDir, filename);
        await downloadImage(url, filePath);
        const stats = fs.statSync(filePath);
        const fileData = {
            name: `${filenameBase}.jpg`, alternative_text: filenameBase, caption: filenameBase,
            width: 600, height: 400, formats: JSON.stringify({}), hash, ext: '.jpg', mime: 'image/jpeg',
            size: stats.size / 1000, url: `/uploads/${filename}`, provider: 'local', folder_path: '/',
            created_at: new Date(), updated_at: new Date(), published_at: new Date()
        };
        const result = await strapi.db.connection('files').insert(fileData).returning('id');
        return Array.isArray(result) ? (typeof result[0] === 'object' ? result[0].id : result[0]) : result;
    } catch (e) { console.error('Upload Failed:', e); return null; }
}

async function setPublicPermissions(strapi: Core.Strapi) {
    try {
        const publicRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
        if (!publicRole) return;
        const actions = [
            'api::article.article.find', 'api::article.article.findOne',
            'api::category.category.find', 'api::category.category.findOne',
            'api::author.author.find', 'api::author.author.findOne',
            'api::documentary.documentary.find', 'api::documentary.documentary.findOne',
            'api::program.program.find', 'api::program.program.findOne'
        ];
        for (const action of actions) {
            await strapi.query('plugin::users-permissions.permission').create({ data: { action, role: publicRole.id } }).catch(() => {});
        }
    } catch (e) {}
}

export default {
    register() {},
    async bootstrap({ strapi }: { strapi: Core.Strapi }) {
        console.log('🚀 Starting Bootstrap...');
        await setPublicPermissions(strapi);

        for (const article of articles) {
            try {
                let category = await strapi.entityService.findMany('api::category.category', { filters: { slug: article.categorySlug }, limit: 1 });
                let categoryId = (category && category.length > 0) ? category[0].id : 
                    (await strapi.entityService.create('api::category.category', { data: { name: article.category, slug: article.categorySlug, publishedAt: new Date() } })).id;

                const existing = await strapi.entityService.findMany('api::article.article', { filters: { slug: article.slug }, limit: 1 });

                if (existing && existing.length > 0) {
                    console.log(`🔄 Updating: ${article.title}`);
                    await strapi.entityService.update('api::article.article', existing[0].id, { data: { content: article.content as any } });
                } else {
                    console.log(`✨ Creating: ${article.title}`);
                    let imageId = article.imageUrl ? await rawDbUpload(strapi, article.imageUrl, article.slug) : null;
                    await strapi.entityService.create('api::article.article', {
                        data: {
                            title: article.title,
                            description: article.description,
                            content: article.content as any,
                            slug: article.slug,
                            image: imageId,
                            category: categoryId,
                            publishedAt: new Date(),
                            seoTitle: article.title,
                            seoDescription: article.description
                        }
                    });
                }
            } catch (err) { console.error(`Error: ${article.title}`, err); }
        }
        console.log('🎉 Bootstrap Complete!');
    },
};
