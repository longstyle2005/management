
'use client'
import { useState, useRef, useEffect } from 'react'
import { AVATAR_DEMO } from '~/app/constant/image/avatarDemo';
import Image from 'next/image'
import styles from './ProjectMemberStatusItem.module.scss'
import { useSession } from "next-auth/react";

export default function ProjectMemberStatusItem ( 
	{ 
		memberData,
		onUpdateMemberStatus,
	} : 
	{ 
		memberData : any, 
		onUpdateMemberStatus : any, 
	}
) {
    const { data: session } = useSession();
    const allowedRolesMember = ['admin', 'manager'];
    const authorCheckOwner = allowedRolesMember.includes(session?.user?.role ?? "") || session?.user?.email === memberData.member.email;

	const statusListRef = useRef<HTMLUListElement>(null);
	const memberTagRef = useRef<HTMLLIElement>(null);
	const [isOpenStatusList, setIsOpenStatusList] = useState(false);
	const [memberStatus, setMemberStatus] = useState<string>(memberData.status);

	const offStatus = memberData.member.off;

	useEffect(() => {
		setMemberStatus(memberData.status);
	},[memberData.status])

	const handleClickMember = (e : any) => {
		e.stopPropagation();
		if(authorCheckOwner){
			setIsOpenStatusList(true);
		}
	}

	const handleUpdateMemberStatus = (memberStatus : string) => {
		if(authorCheckOwner){
			setMemberStatus(memberStatus)
			onUpdateMemberStatus({
				memberId: memberData.memberId,
				projectRoleId: memberData._id,
				projectRoleStatus: memberStatus,
			});
		}
    }

    const handleSelectStatus = (e : any) => {
		e.stopPropagation();
		if(authorCheckOwner){
			setIsOpenStatusList(false);
			const memberLevel = e.target.getAttribute('data-status');
			if(memberLevel === memberStatus){
				e.preventDefault();
				return false;
			}
			switch (memberLevel) {
				case '0':
					handleUpdateMemberStatus('0');
					break;
				case '1':
					handleUpdateMemberStatus('1');
					break;
				case '2':
					handleUpdateMemberStatus('2');
					break;
				case '3':
					handleUpdateMemberStatus('3');
					break;
				case '4':
					handleUpdateMemberStatus('4');
					break;
				case '5':
					handleUpdateMemberStatus('5');
					break;
				default:
					break;
			}
		}
	}

	useEffect(() => {
		const handleOutsideClick = (e : any) => {
			e.stopPropagation();
			if (
				statusListRef.current && 
				!statusListRef.current.contains(e.target) &&
				!memberTagRef.current?.contains(e.target)
			) {
				setIsOpenStatusList(false);
			}
		}
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		}
	}, [statusListRef]);

	return (
        <li 
			className={`
				${offStatus ? `${styles.member} ${styles.off}` : styles.member} 
				${isOpenStatusList ? styles.active : ''}
			`} 
			onClick={(e) => handleClickMember(e)} ref={memberTagRef}
		>
			<div className={styles.memberHead}>
				<figure className={styles.memberAvatar}>
					<Image 
						key={memberData.memberId}
						width={36}
						height={36}
						src={memberData.member.avatar ? memberData.member.avatar : AVATAR_DEMO}
						alt={memberData.member.nickname} 
					/>
				</figure>
				<p className={styles.memberName}>{memberData.member.nickname}</p>
			</div>
			<div className={styles.memberContent}>
				<div className={styles.status} data-status={memberStatus}></div>
				{isOpenStatusList && <ul className={styles.statusList} ref={statusListRef}>
					<li data-status='0' className={memberStatus === '0' ? styles.active : ''} onClick={handleSelectStatus}>0</li>
					<li data-status='1' className={memberStatus === '1' ? styles.active : ''} onClick={handleSelectStatus}>1</li>
					<li data-status='2' className={memberStatus === '2' ? styles.active : ''} onClick={handleSelectStatus}>2</li>
					<li data-status='3' className={memberStatus === '3' ? styles.active : ''} onClick={handleSelectStatus}>3</li>
					<li data-status='4' className={memberStatus === '4' ? styles.active : ''} onClick={handleSelectStatus}>4</li>
					<li data-status='5' className={memberStatus === '5' ? styles.active : ''} onClick={handleSelectStatus}>5</li>
				</ul>}
			</div>
		</li>
	)
}