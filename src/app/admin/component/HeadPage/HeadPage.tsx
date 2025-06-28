'use client'
import { ReactNode, Suspense } from 'react'
import Account from '~/app/component/Account/Account'
import styles from './HeadPage.module.scss'

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
					<Account />
				</Suspense>
			</div>
		</div>
	)
}