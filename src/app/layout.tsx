"use client";
import '~/app/sass/global.scss'
import { roboto, } from '~/app/fonts'
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  	children,
}: {
  	children: React.ReactNode
}) {
	return (
		<SessionProvider>
			<html lang="en">
				<head>
					<title>Management</title>
					<link rel='icon' href='/img/common/favicon.png' sizes='any' />
					<meta name="theme-color" content="#432e11"/>
				</head>
				<body className={`${roboto.variable}  `}>
					<>{children}</>
				</body>
			</html>
		</SessionProvider>
	)
}
