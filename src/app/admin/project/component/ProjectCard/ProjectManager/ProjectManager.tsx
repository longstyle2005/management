
import Image from 'next/image'
import styles from './ProjectManager.module.scss'

export default function ProjectManager ( 
	{ 
		mainController, 
		backendController, 
		frontendController,
	} : 
	{ 
		mainController : any, 
		backendController : any, 
		frontendController : any,
	}
) {
	return (
		<ul className={styles.manager}>
            <li className={styles.managerItem}>
                <figure className={styles.managerAvatar}>
					<Image 
						width={0}
						height={0}
						src={frontendController ? frontendController.member.avatar : '/img/common/avatar_demo.svg'}
						alt={frontendController ? frontendController.member.nickname : ''}
						priority={true}
					/>
				</figure>
                <p className={styles.managerTitle}>Lead Frontend</p>
                {frontendController && <p className={styles.managerNickname}>{frontendController.member.nickname}</p>}
            </li>
            <li className={styles.managerItem}>
                <figure className={styles.managerAvatar}>
					<Image 
						width={0}
						height={0}
						src={mainController ? mainController.member.avatar : '/img/common/avatar_demo.svg'}
						alt={mainController ? mainController.member.nickname : ''}
						priority={true}
					/>
				</figure>
                <p className={styles.managerTitle}>Controller</p>
				{mainController && <p className={styles.managerNickname}>{mainController.member.nickname}</p>}
            </li>
            <li className={styles.managerItem}>
                <figure className={styles.managerAvatar}>
					<Image 
						width={0}
						height={0}
						src={backendController ? backendController.member.avatar : '/img/common/avatar_demo.svg'}
						alt={backendController ? backendController.member.nickname : ''}
						priority={true}
					/>
				</figure>
                <p className={styles.managerTitle}>Lead Backend</p>
				{backendController && <p className={styles.managerNickname}>{backendController.member.nickname}</p>}
            </li>
        </ul>
	)
}