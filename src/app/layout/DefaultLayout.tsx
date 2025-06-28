'use client'
import Header from '~/app/layout/header/Header'
import styles from './DefaultLayout.module.scss'

export default function DefaultLayout ( 
	{
		children, 
	} : 
	{
		children : any,
	}
) {

  	return (
		<div className={styles.container}>
			<Header />
			{children}
		</div>
	)
}
