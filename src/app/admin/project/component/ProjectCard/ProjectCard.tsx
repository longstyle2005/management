'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Overlay from '~/app/admin/component/Overlay/Overlay';
import ProjectManager from '~/app/admin/project/component/ProjectCard/ProjectManager/ProjectManager'
import ProjectMember from '~/app/admin/project/component/ProjectCard/ProjectMember/ProjectMember'
import ProjectSituation from '~/app/admin/project/component/ProjectCard/ProjectSituation/ProjectSituation'
import ProjectStatus from '~/app/admin/project/component/ProjectCard//ProjectStatus/ProjectStatus';
import ProjectMemberStatus from '~/app/admin/project/component/ProjectCard/ProjectMemberStatus/ProjectMemberStatus';
import platformDataList from '~/data/platforms.json';
import situationDataList from '~/data/situation.json';
import projectStatusDataList from '~/data/projectStatus.json';
import styles from './ProjectCard.module.scss'
import { useSession } from "next-auth/react";


export default function ProjectCard ( 
	{ 
		projectData,
		onUpdateStatusProject,
		onUpdateMemberStatus,
	} : 
	{ 	
		projectData : any, 
		onUpdateStatusProject: any,
		onUpdateMemberStatus: any,
	}
) {

    const { data: session } = useSession();
    const allowedRolesMember = ['admin', 'manager'];
    const authorCheckManager = allowedRolesMember.includes(session?.user?.role ?? '');

	const authorCheckMainController = projectData.rolesWithMemberInfo.some((role : any) => 
		(role.role === 'mainController' && session?.user?.email === role.member.email)
	)
	
	const [isOverlay, setIsOverlay] = useState<boolean>(false);
	const [isPoppupMemberStatus, setIsPoppupMemberStatus] = useState<boolean>(false);
	const [situation, setSituation] = useState<string>(projectData.situation);

	const platformData = platformDataList.filter((item : any) => projectData.platforms.includes(item.id));
	const frameworkTitle : any = platformData.map((item : any, index : number) => {
        return ( <span key={index}>{item.name}</span> )
	});
	const frameworkList : any = platformData.map((item : any) => {
        return ( <li key={item.id}>{item.name}</li> )
	})

	const mainController = projectData.rolesWithMemberInfo.find((controller : any) => controller.role === 'mainController') || null;
	const backendController = projectData.rolesWithMemberInfo.find((controller : any) => controller.role === 'backendController') || null;
	const frontendController = projectData.rolesWithMemberInfo.find((controller : any) => controller.role === 'frontendController') || null;

	const handleUpdateProjectSituation = useCallback((id : string) => {
		if(id === 'situation_01' || id === 'situation_05' || id === 'situation_06'){
			const updatedProject = { 
				...projectData,
				situation: id,
				status: 'project_status_0' 
			};
			onUpdateStatusProject(updatedProject);
		} else {
			const updatedProject = { 
				...projectData, 
				situation: id
			};
			onUpdateStatusProject(updatedProject);
		}
		setSituation(id);
    }, [projectData, onUpdateStatusProject]);

	const handleUpdateProjectStatus = useCallback((id : string) => {
        const updatedProject = { 
            ...projectData, 
            status: id
        };
        onUpdateStatusProject(updatedProject);
    }, [projectData, onUpdateStatusProject]);

	const handleOpenPoppupMemberStatus = () => {
		setIsOverlay(true);
		setIsPoppupMemberStatus(true);
	}

	const handleClosePoppupMemberStatus = () => {
		setIsOverlay(false);
		setIsPoppupMemberStatus(false);
	}

  	return (
		<div className={styles.card}>
			{(authorCheckManager || authorCheckMainController) && <Link className={styles.editIcon} href={`/admin/project/${projectData.projectId}`}></Link>}
            <div className={styles.general}>
				<figure className={styles.logo}>
					<Image 
						width={0}
						height={0}
						src={projectData.logo}
						alt={projectData.name}
						priority={true}
					/>
				</figure>
				<div className={styles.head}>
					<p className={styles.projectName}>{projectData.name}</p>
					<div className={styles.framework}>
						<p className={styles.frameworkTitle}>{frameworkTitle}</p>
						{projectData.platforms.length > 2 ? <ul className={styles.frameworkList}>
							{frameworkList}
						</ul> : ''}
					</div>
				</div>
			</div>
			<ProjectManager 
				mainController={mainController}
				backendController={backendController} 
				frontendController={frontendController} 
			/>
			<div className={styles.projectStatus}>
				<ProjectSituation 
					situationDataList={situationDataList}
					onProjectSituation={handleUpdateProjectSituation}
					situationData={projectData.situation}
					classesFull={situation === 'situation_01' || situation === 'situation_05' || situation === 'situation_06' || situation === 'situation_07' ? true : false}
					authorCheckManager={authorCheckManager}
					authorCheckMainController={authorCheckMainController}
				/>
				{!(situation === 'situation_01' || situation === 'situation_05' || situation === 'situation_06' || situation === 'situation_07') ? <ProjectStatus 
					statusData={projectData.status}
					situationData={projectData.situation}
					projectStatusDataList={projectStatusDataList}
					onProjectStatus={handleUpdateProjectStatus}
					authorCheckManager={authorCheckManager}
					authorCheckMainController={authorCheckMainController}
				/> : ''}
			</div>
			<ProjectMember 
				memberDataList={projectData.rolesWithMemberInfo} 
				onOpenPoppupMemberStatus={handleOpenPoppupMemberStatus}
			/>
			{isOverlay && <Overlay closePopup={handleClosePoppupMemberStatus}>
				{isPoppupMemberStatus && <ProjectMemberStatus 
					memberDataList={projectData.rolesWithMemberInfo}
					projectName={projectData.name}
					onClosePopup={handleClosePoppupMemberStatus}
					onUpdateMemberStatus={onUpdateMemberStatus}
				/>}
			</Overlay>}
		</div>
	)
}