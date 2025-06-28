'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import styles from './Header.module.scss';

export default function Header (
	{toggleHeader, isOpenHeader} : {toggleHeader: () => void, isOpenHeader: boolean}
) {
	const pathname = usePathname();
	const isMemberPage = pathname?.startsWith('/admin/member');
	const isProjectPage = pathname?.startsWith('/admin/project');

	const handleToggleHeader = () => {
		toggleHeader();
	}

  	return (
		<header className={isOpenHeader ? `${styles.header} ${styles.active}` : styles.header}>
			<div className={styles.wrapTop}>
				<Link className={styles.home} href='/admin'></Link>
				<nav className={styles.menu}>
					<Link className={`${styles.member} ${isMemberPage ? `${styles.active}` : ''}`} href='/admin/member'>
						<span className={styles.icon}></span>
						<span className={styles.ttl}>Members</span>
						<span className={styles.sub}>Members</span>
					</Link>
					<Link className={`${styles.project} ${isProjectPage ? `${styles.active}` : ''}`} href='/admin/project'>
						<span className={styles.icon}></span>
						<span className={styles.ttl}>Projects</span>
						<span className={styles.sub}>Projects</span>
					</Link>
				</nav>
			</div>
			<div className={styles.wrapBot}>
				<div className={styles.wrapToggle}>
					<span className={styles.btnToggle} onClick={handleToggleHeader}></span>
				</div>
			</div>
        </header>
	)
}
