'use client'

import { useEffect, useRef, useState } from "react";
import styles from './SignIn.module.scss'
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import LoadingFullPage from '~/app/component/LoadingFullPage/LoadingFullPage';
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn ( 
	{ } : 
	{ }
) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const errorMessage = searchParams ? searchParams.get("error") : null;
	const popupRef = useRef<HTMLDivElement>(null);
	const [isPopupAccount, setIsPopupAccount] = useState(false);
    const [isLoadingFullPage, setIsLoadingFullPage] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const pathname = usePathname();

	let isNotAdmin = null;
	if (pathname) {
		isNotAdmin = !pathname.startsWith('/admin');
	}

	const handleAdminSignIn = async (e: React.FormEvent) => {
		e.preventDefault();
		const res = await signIn("credentials", {
			email,
			password,
			redirect: true,
			callbackUrl: "/admin",
		});
	
		if (res?.error) {
			alert("Đăng nhập thất bại");
		}
	};
	
	useEffect(() => {
		if (errorMessage) {
			setError(errorMessage);
			router.replace("/", undefined); 
		}
	}, [errorMessage, router]);

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
		<div className={styles.blockLogin}>
			<form className={styles.formBtn} onSubmit={handleAdminSignIn}>
				<label className={`${styles.inputField} ${styles.email}`} htmlFor="email">
					<input id="email" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
				</label>
				<label className={`${styles.inputField} ${styles.password}`} htmlFor="password">
					<input id="password" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
				</label>
				<button className={styles.btnLogin} type="submit">Sign in</button>
			</form>
		</div>
	)
}