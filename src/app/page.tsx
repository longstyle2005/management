"use client";
import styles from './page.module.scss'
import Image from 'next/image';
import SignIn from '~/app/component/SignIn/SignIn';
export default function HomePage({
    
}: {
    
}) {
    return (
        <div className={styles.wrap}>
            <div className={styles.col1}>
                <div className={styles.signInBox}>
                    <p className={styles.ttl}>Sign in</p>
                    <SignIn />
                </div>
            </div>
            <div className={styles.col2}>
                <div className={styles.intro}>
                    <Image 
                        width={0}
                        height={0}
                        src='img/common/logo.svg'
                        alt="icon"
                        priority
                        className={styles.introLogo}
                    />
                    <p className={styles.introTtl}>Welcome to Management</p>
                </div>
            </div>
        </div>
    )
}
