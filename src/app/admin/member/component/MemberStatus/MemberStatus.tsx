'use client'
import { useState, useRef, useEffect } from 'react'
import styles from './MemberStatus.module.scss'

export default function MemberStatus ( 
	{
		memberId,
		memberOff, 
		onStatus, 
		projectDataListOfMember, 
		projectCurrentDataOfMember,
		authorCheckOwner,
	} : {
		memberId: string,
		memberOff : boolean,
		onStatus : any, 
		projectDataListOfMember : [], 
		projectCurrentDataOfMember : any,
		authorCheckOwner : boolean }, 
) {
	const [isOpenList, setIsOpenList] = useState(false);
	const barRef = useRef<HTMLDivElement>(null);
	const listRef = useRef<HTMLUListElement>(null);

	const projectRoleId = projectCurrentDataOfMember?._id;
	const memberStatusDefault = projectCurrentDataOfMember?.status;

	useEffect(() => {
		if(memberOff){
			onStatus({
				memberId,
				projectRoleId,
				projectRoleStatus : '0',
			});
		}
	}, [memberOff, memberId, projectRoleId, onStatus]);

	useEffect(() => {
		const handleOutsideClick = (e : any) => {
			e.stopPropagation();
			if (
				listRef.current && 
				!listRef.current.contains(e.target) &&
				!barRef.current?.contains(e.target)
			) {
				setIsOpenList(false);
			}
		}
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		}
	}, []);

	const handleClickBar = (e : React.MouseEvent<HTMLElement>) => {
		e.stopPropagation();
		if(isOpenList){
			setIsOpenList(false);
		} else {
			if(authorCheckOwner){
				setIsOpenList(true);
			} else {
				setIsOpenList(false);
			}
		}
	}

	const handleSelectStatus = (e : any) => {
		e.stopPropagation();
		setIsOpenList(false);
		if(authorCheckOwner){
			const memberLevel = e.target.getAttribute('data-status');
			if(memberLevel === memberStatusDefault){
				e.preventDefault();
				return false;
			}
			switch (memberLevel) {
				case '0':
					onStatus({
						memberId,
						projectRoleId,
						projectRoleStatus : '0',
					});
					break;
				case '1':
					onStatus({
						memberId,
						projectRoleId,
						projectRoleStatus : '1',
					});
					break;
				case '2':
					onStatus({
						memberId,
						projectRoleId,
						projectRoleStatus : '2',
					});
					break;
				case '3':
					onStatus({
						memberId,
						projectRoleId,
						projectRoleStatus : '3',
					});
					break;
				case '4':
					onStatus({
						memberId,
						projectRoleId,
						projectRoleStatus : '4',
					});
					break;
				case '5':
					onStatus({
						memberId,
						projectRoleId,
						projectRoleStatus : '5',
					});
					break;
				default:
					break;
			}
		} else {
			e.preventDefault();
			return false;
		}
	}

	let renderStatus : any = '';
	if(projectDataListOfMember.length > 0){
		renderStatus = <div className={isOpenList ? `${styles.status} ${styles.active}` : styles.status}>
		<div className={authorCheckOwner ? styles.bar : `${styles.bar} ${styles.none}`} data-status={memberStatusDefault} onClick={handleClickBar} ref={barRef}></div>
			{isOpenList && 
				<ul className={styles.list} ref={listRef}>
					<li data-status='0' className={memberStatusDefault === '0' ? styles.active : ''} onClick={handleSelectStatus}>0</li>
					<li data-status='1' className={memberStatusDefault === '1' ? styles.active : ''} onClick={handleSelectStatus}>1</li>
					<li data-status='2' className={memberStatusDefault === '2' ? styles.active : ''} onClick={handleSelectStatus}>2</li>
					<li data-status='3' className={memberStatusDefault === '3' ? styles.active : ''} onClick={handleSelectStatus}>3</li>
					<li data-status='4' className={memberStatusDefault === '4' ? styles.active : ''} onClick={handleSelectStatus}>4</li>
					<li data-status='5' className={memberStatusDefault === '5' ? styles.active : ''} onClick={handleSelectStatus}>5</li>
				</ul>
			}
		</div>
	}
  	return (
		<>{renderStatus}</>
	)
}