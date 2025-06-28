'use client'
import { useSession } from "next-auth/react";
import { useState } from 'react'
import Header from '~/app/admin/layout/header/Header'
import styles from './DefaultLayout.module.scss'

export default function DefaultLayout ( 
	{children, } : 
	{children: React.ReactNode, }
) {
	const { data: session, status } = useSession();
	const [isOpenHeader, setIsOpenHeader] = useState(false);
	const toggleHeader = () => {
		setIsOpenHeader(!isOpenHeader);
	}

  	return (
	  
		<div className={styles.container}>
			<div className={isOpenHeader ? `${styles.wrapHeader} ${styles.active}` : styles.wrapHeader}>
				<Header toggleHeader={toggleHeader} isOpenHeader={isOpenHeader} />
			</div>
			<div className={isOpenHeader ? `${styles.contents} ${styles.active}` : styles.contents}>
				{children}
			</div>
			
		</div>
	)
}
