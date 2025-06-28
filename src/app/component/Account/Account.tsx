'use client'

import { useEffect, useRef, useState } from "react";
import Image from 'next/image'
import styles from './Account.module.scss'
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import LoadingFullPage from '~/app/component/LoadingFullPage/LoadingFullPage';
import Modal from '~/app/component/Modal/Modal';
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function Account ( 
	{ } : 
	{ }
) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const errorMessage = searchParams ? searchParams.get("error") : null;
	const popupRef = useRef<HTMLDivElement>(null);
	const [isPopupAccount, setIsPopupAccount] = useState(false);
    const [isLoadingFullPage, setIsLoadingFullPage] = useState(false);
    const [isModal, setIsModal] = useState(false);
	const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const pathname = usePathname();
	const avatarUrl = session?.user?.email  ? `/api/avatar/${encodeURIComponent(session.user.email)}`  : "/default-avatar.jpg";

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

    const handleGoogleSignIn = async () => {
		setIsModal(false);
		setError(null);
		setIsLoadingFullPage(true);
		try {
			const response = await signIn("google", { callbackUrl: "/admin/member" });
			if (response?.error) {
			  	setError(response.error);
			}
		} catch (err) {
			console.error("SignIn error:", err);
		}
		setIsLoadingFullPage(false);
    };

	const handleSignIn = () => {
		setIsModal(true);
	}

	const handleCloseModal = () => {
		setIsModal(false);
	}
	
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
		<>
			{isModal && 
				<Modal onClose={handleCloseModal}>
					<div className={styles.blockLogin}>
						<div className={styles.col1}>
							<p className={styles.title}>Admin account</p>
							<form className={styles.formBtn} onSubmit={handleAdminSignIn}>
								<input className={styles.inputField} type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
								<input className={styles.inputField} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
								<button className={styles.btnLogin3} type="submit">Sign in</button>
							</form>
						</div>
						{/* <div className={styles.col2}>
							<p className={styles.btnLogin2} onClick={handleGoogleSignIn}>Tài khoản Google công ty</p>
						</div> */}
					</div>
				</Modal>
			}
			<div className={styles.wrap}>
				{isLoadingFullPage && <LoadingFullPage />}
				{session ? (
					<div className={styles.blockAvatar}>
						{isNotAdmin && <Link className='btn1 mr20' href='/admin/member'>Tới trang quản lý</Link>}
						<figure className={styles.avatar} onClick={() => setIsPopupAccount(true)}>
								<Image 
									src={avatarUrl || "/img/common/avatar_demo.svg"} 
									alt="avatar"
									width={40}
									height={40}
								/>
							</figure>
						{isPopupAccount && 
							<div className={styles.info} ref={popupRef}>
								<span className={styles.btnClose} onClick={() => setIsPopupAccount(false)}></span>
								<p className={styles.name}>{session?.user?.nickname}</p>
								<p className={styles.email}>{session?.user?.email}</p>
								<span className={styles.btnLogout} onClick={() => signOut()}>Sign out</span>
							</div> 
						}
					</div>
				) : (
					<>
						<p className={styles.btnLogin} onClick={handleSignIn}>Sign in</p>
						{error && <p>Lỗi: {error}</p>}  
					</>
				)}
			</div>
		</>
	)
}