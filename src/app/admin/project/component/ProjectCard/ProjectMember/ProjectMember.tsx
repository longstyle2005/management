
import Image from 'next/image'
import styles from './ProjectMember.module.scss'

export default function ProjectMember ( 
	{ 
        memberDataList, 
        onOpenPoppupMemberStatus,
    } : { 
        memberDataList : any, 
        onOpenPoppupMemberStatus : any,
    }
) {

    const handleOpenPoppupMemberStatus = () => {
        onOpenPoppupMemberStatus();
    }

    let listProject : any = '';
    if(memberDataList.length > 5){
        listProject = memberDataList.slice(0,6).map((item : any, index : number) => {
            const indexEle = memberDataList.length - index;
            return (
                <li className={styles.memberItem} key={item._id} style={{ zIndex: indexEle, }}>
                    <figure className={styles.memberAvatar}>
                        <Image 
                            width={0}
                            height={0}
                            src={item.member.avatar}
                            alt={item.member.nickname}
                            priority={true}
                        />
                    </figure>
                    <p className={styles.memberNickname}>{item.member.nickname}</p>
                </li>
                
            )
        })
    } else {
        listProject = memberDataList.map((item : any, index : any) => {
        const indexEle = memberDataList.length - index;
            return (
                <li className={styles.memberItem} key={item._id} style={{ zIndex: indexEle, }}>
                    <figure className={styles.memberAvatar}>
                        <Image 
                            width={0}
                            height={0}
                            src={item.member.avatar}
                            alt={item.member.nickname}
                            priority={true}
                        />
                    </figure>
                    <p className={styles.memberNickname}>{item.member.nickname}</p>
                </li>
            )
        })
    }

  	return (
		<div className={styles.member}>
            <div className={styles.memberHead}>
                <p className={styles.memberTitle}>Thành viên:</p>
                <p className={styles.memberNum}>{memberDataList.length}</p>
            </div>
            <div className={styles.memberContent}>
                <ul className={styles.memberList} onClick={handleOpenPoppupMemberStatus}>
                    {listProject}
                    {memberDataList.length > 6 ? <li className={styles.memberItem}>
                        <figure className={styles.memberAvatar}>
                            <Image 
                                className={styles.memberMore}
                                width={0}
                                height={0}
                                src='/img/common/icon_dots_2.svg'
                                alt='icon'
                                priority={true}
                            />
                        </figure>
                    </li> : ''}
                </ul>
            </div>
        </div>
	)
}