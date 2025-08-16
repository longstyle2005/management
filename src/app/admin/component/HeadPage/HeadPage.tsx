'use client'
import { ReactNode, Suspense } from 'react'
import styles from './HeadPage.module.scss'
import SignOut from '~/app/admin/component/SignOut/SignOut'

export default function HeadPage ( 
	{
		title, 
		children,
		customClass,
	} : 
	{
		title: string,
		children?: ReactNode,
		customClass : string,
	}
) {

  	return (
		<div className={`${styles.wrap} ${styles[customClass]}`}>
            <h2 className={`${styles.headline1} headline1`}><span>{title}</span></h2>
			<div className={styles.headRight}>
				{children}
				<Suspense>
					<SignOut />
				</Suspense>
			</div>
		</div>
	)
}