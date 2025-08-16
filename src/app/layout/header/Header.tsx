'use client'
import { usePathname } from 'next/navigation'
import { Suspense } from "react";
import Account from '~/app/component/SignIn/SignIn'
import Link from 'next/link'
import styles from './Header.module.scss';

export default function Header (
	
) {
	const pathname = usePathname();
	const isMemberPage = pathname?.startsWith('/member');
	const isProjectPage = pathname?.startsWith('/project');



  	return (
		<header className={styles.wrap}>
			<div className={styles.block}>
				<Link className={styles.logo} href='/'>ANALYTICS</Link>
				<nav className={styles.menu}>
					<Link className={`${styles.project} ${isProjectPage ? `${styles.active}` : ''}`} href='/project'>Project</Link>
					<Link className={`${styles.member} ${isMemberPage ? `${styles.active}` : ''}`} href='/member'>Member</Link>
				</nav>
			</div>
			<Suspense><Account /></Suspense>
        </header>
	)
}
