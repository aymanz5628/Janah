import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <p className={styles.copyright}>© 2026 Janah. All rights reserved.</p>
                <nav className={styles.nav}>
                    <Link href="/about" className={styles.link}>About Us</Link>
                    <Link href="/advertise" className={styles.link}>Advertise</Link>
                    <Link href="/careers" className={styles.link}>Careers</Link>
                    <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
                </nav>
            </div>
        </footer>
    );
}
