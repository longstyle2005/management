'use client'
import { useState } from 'react'
import Account from '~/app/component/Account/Account'
import styles from './HeadPageSecond.module.scss'

export default function HeadPageSecond ( 
	{title, children} : 
	{title: string, children : any }
) {

  	return (
		<div className={styles.wrap}>
            <div className={styles.headLeft}>
                <h2 className='headline2'>{title}</h2>
                {children}
            </div>
			<div className={styles.headRight}>
				<Account />
			</div>
		</div>
	)
}