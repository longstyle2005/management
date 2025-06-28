'use client'
import { memo, useCallback } from 'react'
import Link from 'next/link'
import MemberProject from '~/app/admin/member/component/MemberProject/MemberProject'
import MemberStatus from '~/app/admin/member/component/MemberStatus/MemberStatus'
import Image from 'next/image'
import styles from './MemberCard.module.scss'
import { useSession } from "next-auth/react";

const MemberCardMemo = (
	{ 
        memberData, 
        dataTeam, 
        dataPosition, 
        onUpdateOnOffStatus,
        onUpdateProjectCurrent,
        onUpdateProjectStatus,
    } : { 
        memberData : any, 
        dataTeam : any, 
        dataPosition : any, 
        onUpdateOnOffStatus : any
        onUpdateProjectCurrent : any,
        onUpdateProjectStatus : any,
    }
) => {
    const { data: session } = useSession();
    const allowedRolesMember = ['admin', 'manager'];
    const authorCheckOwner = allowedRolesMember.includes(session?.user?.role ?? "") || session?.user?.email === memberData.email;
    const authorCheckAdmin = session?.user?.role === 'admin';

    let iconTeams = '';
    if(dataTeam.length > 0){
        iconTeams = dataTeam.map((item : any) => {
            return (
                <Image 
                    key={item.id}
                    width={25}
                    height={25}
                    src={item.icon}
                    alt="icon"
                />
            )
        })
    }

    const projectCurrentDataOfMember = memberData.rolesWithProjectInfo.find((project : any) => project.isCurrent === true);
    
    const handleProjectCurrent = (idDataUpdate : string) => {
        if(authorCheckOwner && (memberData.rolesWithProjectInfo.length > 0)){
            onUpdateProjectCurrent(idDataUpdate);
        }
    }

    const handleProjectStatus = useCallback((dataUpdate : string) => {
        if(authorCheckOwner && (memberData.rolesWithProjectInfo.length > 0)){
            onUpdateProjectStatus(dataUpdate);
        }
    },[authorCheckOwner, memberData.rolesWithProjectInfo.length, onUpdateProjectStatus])

    const handleUpdateOnOff = (e : any) => {
        if(authorCheckOwner){
            const updatedMember = { 
                ...memberData, 
                off: !memberData.off 
            };
            onUpdateOnOffStatus(updatedMember);
        }
    }

  	return (
		<div className={memberData.off ? `${styles.card} ${styles.off}` : styles.card}>
            {authorCheckAdmin && <Link className={styles.editIcon} href={`/admin/member/${memberData.memberId}`} ></Link>}
            <div className={styles.head}>
                <div className={styles.headTop}>
                    <span className={styles.teamIcon}>
                        {iconTeams}
                    </span>
                </div>
                <figure className={styles.avatar}>
                    <Image 
                        width={0}
                        height={0}
                        src={memberData.avatar}
                        alt="avatar"
                        priority={true}
                    />
                </figure>
                <div className={styles.infoMember}>
                    <p className={styles.name}>{memberData.nickname}</p>
                    <p className={styles.position}>{dataPosition && dataPosition.name}</p>
                    <p className={styles.mail}>{memberData.email}</p>
                </div>
            </div>
            <div className={styles.foot}>
                <div className={styles.content}>
                    <MemberProject 
                        memberId={memberData.memberId}
                        projectDataListOfMember={memberData.rolesWithProjectInfo}
                        projectCurrentDataOfMember={projectCurrentDataOfMember}
                        onMemberProjectCurrent={handleProjectCurrent}
                        authorCheckOwner={authorCheckOwner}
                    />
                    {projectCurrentDataOfMember && <MemberStatus 
                        memberId={memberData.memberId}
                        memberOff={memberData.off}
                        onStatus={handleProjectStatus}
                        projectDataListOfMember={memberData.rolesWithProjectInfo}
                        projectCurrentDataOfMember={projectCurrentDataOfMember}
                        authorCheckOwner={authorCheckOwner}
                    />}
                </div>
                <div className={authorCheckOwner ? styles.btnBox : `${styles.btnBox} ${styles.none}`}>
                    <div 
                        className={ memberData.off ? `${styles.btnOnOff} ${styles.off}` : styles.btnOnOff} 
                        onClick={handleUpdateOnOff}
                    ></div>
                </div>
            </div>
        </div>
	)
};

const MemberCard = memo(MemberCardMemo);

export default MemberCard;