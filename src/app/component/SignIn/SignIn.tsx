import styles from './SignIn.module.scss'
import { signIn } from "next-auth/react";
import { usePathname } from 'next/navigation';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
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
			password: data.password,
			redirect: false,
		});
		if (res?.error) {
			setError("root", { message: "Invalid email or password" });
		} else {
			router.push("/admin");
		}
	};

  	return (
		<div className={styles.blockLogin}>
			<form className='w-full' onSubmit={handleSubmit(onSubmit)}>
				<div className='mb-[15px]'>
					<label className={`${styles.inputField} ${styles.email} ${errors.email && styles.error}`} htmlFor="email">
						<input
							id="email" type="email" placeholder="Email"
							{...register("email", { required: "Email is required" })}
						/>
					</label>
					{errors.email && <p className='txtError show'>{errors.email.message}</p>}
				</div>
				<div className='mb-[15px]'>
					<label className={`${styles.inputField} ${styles.password} ${errors.password && styles.error}`} htmlFor="password">
						<input
							id="password" placeholder="Password" type="password"
							{...register("password", {
								required: "Password is required",
								minLength: { value: 6, message: "Min 6 characters" },
							})}
						/>
						<span className={styles.eye}></span>
					</label>
					{errors.password && <p className='txtError show'>{errors.password.message}</p>}
				</div>
				{errors.root && <p className='txtError show text-center'>{errors.root.message}</p>}
				<button className={styles.btnLogin} type="submit">Sign in</button>
			</form>
		</div>
	)
}

