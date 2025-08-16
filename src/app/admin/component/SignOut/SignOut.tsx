'use client'

import { useEffect, useRef, useState } from "react";
import Image from 'next/image'
import styles from './SignOut.module.scss'
import { signOut, useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";

export default function SignOut ( 
	{ } : 
	{ }
) {
	const popupRef = useRef<HTMLDivElement>(null);
	const [isPopupAccount, setIsPopupAccount] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();

	const pathname = usePathname();
	const avatarUrl = session?.user?.email  ? `/api/avatar/${encodeURIComponent(session.user.email)}`  : "/img/common/avatar_demo.svg";

	let isNotAdmin = null;
	if (pathname) {
		isNotAdmin = !pathname.startsWith('/admin');
	}

    const handleLogout = async () => {
        await signOut({
            redirect: false,
        });
        router.push("/");
    };

	useEffect(() => {
		const handleClickOutsidePopup = (e: MouseEvent) => {
			if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
				setIsPopupAccount(false);
			}
		};
		if (isPopupAccount) {
		  	document.addEventListener('mousedown', handleClickOutsidePopup);
		}
		return () => {
		  	document.removeEventListener('mousedown', handleClickOutsidePopup);
		};
	}, [isPopupAccount]);

  	return (
        <div className={styles.wrap}>
            <div className={styles.blockAvatar}>
                <figure className={styles.avatar} onClick={() => setIsPopupAccount(true)}>
                        <Image 
                            src={avatarUrl} 
                            alt="avatar"
                            width={40}
                            height={40}
                            unoptimized
                        />
                    </figure>
                {isPopupAccount && 
                    <div className={styles.info} ref={popupRef}>
                        <span className={styles.btnClose} onClick={() => setIsPopupAccount(false)}></span>
                        <p className={styles.name}>{session?.user?.nickname}</p>
                        <p className={styles.email}>{session?.user?.email}</p>
                        <span className={styles.btnLogout} onClick={handleLogout}>Sign out</span>
                    </div> 
                }
            </div>
        </div>
	
	)
}