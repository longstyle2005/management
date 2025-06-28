
'use client'
import { useState, useRef, useEffect } from 'react'
import styles from './ProjectMemberStatus.module.scss'
import ProjectMemberStatusList from '~/app/admin/project/component/ProjectCard/ProjectMemberStatus/ProjectMemberStatusList/ProjectMemberStatusList'
import positionDataList from '~/data/positions.json';

export default function ProjectMemberStatus ( 
	{ 
		memberDataList, 
		onClosePopup, 
		onUpdateMemberStatus,
		projectName,
	} : 
	{ 
		memberDataList : any, 
		onClosePopup : any, 
		onUpdateMemberStatus : any,
		projectName: string,
	}
) {
	const [isPositionActive, setIsPositionActive] = useState<number | string>('All');
	const [dataMemberFillter, setDataMemberFillter] = useState<[]>(memberDataList);

	const handleClosePopup = () => {
		onClosePopup();
	}

	const handleClickPositionAll = (e : any) => {
		e.stopPropagation();
		setIsPositionActive('All');
		setDataMemberFillter(memberDataList)
	}

	const handleClickPosition = (e : any, index : number, id : string) => {
		e.stopPropagation();
		setIsPositionActive(index);
		const memberFillter = memberDataList.filter((member : any) => member.member.position === id);
		setDataMemberFillter(memberFillter);
	}

	const listPositionRender =  positionDataList.map((item : any, index : number) => {
		const memberFillter = memberDataList.filter((member : any) => member.member.position === item.id);
		return (memberFillter.length > 0 ? <li className={`${styles.item} ${isPositionActive === index ? styles.active : ''}`}  key={index} onClick={e => handleClickPosition(e, index, item.id)}>
			<p className={styles.ttl}>{item.name}</p>
			<p className={styles.num}>{memberFillter.length}</p>
		</li> : '')
	})
   
	return (
       	<div className={styles.wrap} onClick={(e) => e.stopPropagation()}>
			<span className={styles.btnClose} onClick={handleClosePopup}></span>
			<p className={styles.title}>{projectName}</p>
			<div className={styles.content}>
				<div className={styles.col1}>
					<ul className={styles.listPosition}>
						<li className={`${styles.item} ${isPositionActive === 'All' ? styles.active : ''}`} onClick={handleClickPositionAll}>
							<p className={styles.ttl}>All</p>
							<p className={styles.num}>{memberDataList.length}</p>
						</li>
						{listPositionRender}
					</ul>
				</div>
				<div className={styles.col2}>
					<ProjectMemberStatusList 
						dataMemberFillter={dataMemberFillter}
						onUpdateMemberStatus={onUpdateMemberStatus}
					/>
				</div>
			</div>
        </div>
	)
}