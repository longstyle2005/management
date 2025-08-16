'use client'

import styles from './SignIn.module.scss'
import { signIn, signOut, useSession } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { LoginForm } from '~/app/utils/interfaces/login_form.interface';

export default function SignIn ( 
	{ } : 
	{ }
) {
	const router = useRouter();
	const pathname = usePathname();

	let isNotAdmin = null;
	if (pathname) {
		isNotAdmin = !pathname.startsWith('/admin');
	}

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm<LoginForm>();

	const onSubmit = async (data: LoginForm) => {
		const res = await signIn("credentials", {
			email: data.email,
			password: data.email,
			redirect: false,
			callbackUrl: "/admin",
		});
		if (res?.error) {
			setError("root", { message: "Invalid email or password" });
		} else {
			router.push("/admin");
		}
	};

  	return (
		<div className={styles.blockLogin}>
			<form className={styles.formBtn} onSubmit={handleSubmit(onSubmit)}>
				<label className={`${styles.inputField} ${styles.email}`} htmlFor="email">
					<input
						id="email" type="email" placeholder="Email"
						// register: gắn input này vào react-hook-form + rule validate
						{...register("email", { required: "Email is required" })}
					/>
				</label>
				{errors.email && <p>{errors.email.message}</p>}

				<label className={`${styles.inputField} ${styles.password}`} htmlFor="password">
					<input
						id="password" placeholder="Password" type="password"
						{...register("password", {
							required: "Password is required",
							minLength: { value: 6, message: "Min 6 characters" },
						})}
					/>
					<span className={styles.eye}></span>
				</label>
				{errors.password && <p>{errors.password.message}</p>}


				{errors.root && <p>{errors.root.message}</p>}
				<button className={styles.btnLogin} type="submit">Sign in</button>
			</form>
		</div>
	)
}

