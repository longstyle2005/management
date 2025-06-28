'use client'
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import LoadingFullPage from '~/app/component/LoadingFullPage/LoadingFullPage';
import DefaultLayout from '~/app/admin/layout/DefaultLayout';
import HeadPage from '~/app/admin/component/HeadPage/HeadPage';
import styles from './page.module.scss';
import ProjectList from '~/app/admin/project/component/ProjectList/ProjectList';
import ProjectFilterKeyword from '~/app/admin/project/component/ProjectFilterKeyword/ProjectFilterKeyword';
import ProjectFilterSituation from '~/app/admin/project/component/ProjectFilterSituation/ProjectFilterSituation';
import projectSituationData from '~/data/situation.json';

import axios from 'axios';
import { useSession } from "next-auth/react";

export default function ProjectPage () {
	const { data: session } = useSession();
	const allowedRolesMember = ['admin', 'manager'];
    const authorCheckManager = allowedRolesMember.includes(session?.user?.role ?? '');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [projectDataList, setProjectDataList] = useState([]);

	const [inputKeywordProjectName, setInputKeywordProjectName] = useState<string>('');
	const [filterProjectName, setFilterProjectName] = useState<string>('');
	const [filterSituation, setFilterSituation] = useState<string>('situation_all');

	const allSituation = { 
        id: "situation_all",
        name: "All Situation",
    };

    const updatedSituationDataList = [allSituation, ...projectSituationData];

	useEffect(()=>{
		readProjectData();
    }, []);

	const readProjectData = () => {
		axios.get('/api/projects/readProjectList')
			.then((response : any) => {
				setProjectDataList(response.data);
				// console.log(response.data)
			})
			.catch((error : any) => {
				console.error('Error read project data:', error);
			});
	}

	const handleUpdateStatusProject = async (dataUpdate : any) => {
		try {
			await axios.put(`/api/projects/updateStatusProject`, dataUpdate);
			setProjectDataList((prevProjects : any) =>
				prevProjects.map((project : any) =>
					project.projectId === dataUpdate.projectId ? dataUpdate : project
				)
			);
		} catch (error) {
		  	console.error("Error updating product situation:", error);
		}
	};

	const handleUpdateMemberStatus = async (dataUpdate : any) => {
		try {
			await axios.put(`/api/project_roles/updateIsStatusProjectRole`, dataUpdate);
			handleProjectFilter();
		} catch (error) {
		  	console.error("Error updating Status Project:", error);
		}
	};

	const handleInputProjectFilterKeyword= (keyword : string) => {
		setInputKeywordProjectName(keyword);
	}

	const handleProjectFilterKeyword = () => {
		setFilterProjectName(inputKeywordProjectName);
	}

	const handleProjectFilterSituation = (situationId : string) => {
		setFilterSituation(situationId);
	}

	const handleProjectFilter = useCallback ( async () => {
		setIsLoading(true);
		try {
			const response = await axios.get('/api/projects/filterProject', { params: {
				name: filterProjectName,
				situationId: filterSituation === 'situation_all' ? '': filterSituation,
			}});
			setProjectDataList(response.data);
			// console.log(response.data);
		} catch (error) {
			console.error('Error fetching members:', error);
		} finally {
			setIsLoading(false);
		}
	},[filterProjectName, filterSituation]);

	const handleResetProjectFilterKeyword = () => {
		setFilterProjectName('');
		setInputKeywordProjectName('');
		handleProjectFilter();
	}

	const handleResetProjectFilterSituation = () => {
		setFilterSituation('situation_all');
		handleProjectFilter();
	}
	
	useEffect(() => {
		handleProjectFilter();
	}, [filterProjectName, filterSituation, handleProjectFilter]);

  	return (
		<DefaultLayout>
			{isLoading && <LoadingFullPage />}
			<HeadPage title='Projects'>
				<div className={styles.wrapFilter}>
					<div className={styles.filter}>
						<ProjectFilterKeyword 
							onInputProjectFilterKeyword={handleInputProjectFilterKeyword}
							onProjectFilterKeyword={handleProjectFilterKeyword}
							onResetProjectFilterKeyword={handleResetProjectFilterKeyword}
						/>
						<ProjectFilterSituation 
							idSituationSelected={filterSituation}
							projectSituationData={updatedSituationDataList}
							onProjectFilterSituation={handleProjectFilterSituation}
							onResetFilterSituation={handleResetProjectFilterSituation}
						/>
					</div>
					{authorCheckManager && <Link href='/admin/project/add' className={`${styles.btnAdd} btnAdd`}>Create Project</Link>}
				</div>
			</HeadPage>
			<div className={`${styles.wrapPage} wrapPage`}>
				{projectDataList && <ProjectList 
					projectList={projectDataList}
					onUpdateStatusProject={handleUpdateStatusProject}
					onUpdateMemberStatus={handleUpdateMemberStatus}
				/>}
			</div>
        </DefaultLayout>
	)
}

