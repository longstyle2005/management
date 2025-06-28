"use client";

import { useState, useEffect } from 'react';
import DefaultLayout from '~/app/admin/layout/DefaultLayout';
import HeadPage from '~/app/admin/component/HeadPage/HeadPage';
import LoadingFullPage from '~/app/admin/component/LoadingFullPage/LoadingFullPage';
import ProjectStatistics from '~/app/admin/component/ProjectStatistics/ProjectStatistics'
import TeamActivity from '~/app/admin/component/TeamActivity/TeamActivity'
import styles from './page.module.scss'
import axios from 'axios';

export default function AdminPage () {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [projectDataList, setProjectDataList] = useState([]);
    const [backendDataList, setBackendDataList] = useState([]);
    const [frontendDataList, setFrontendDataList] = useState([]);
    const [itcDataList, setItcDataList] = useState([]);
    const [testerDataList, setTesterDataList] = useState([]);

	useEffect(()=>{
		readProjectData();
        readMemberBackendData();
        readMemberFrontendData();
        readMemberItcData();
        readMemberTesterData();
    }, []);

	const readProjectData = async () => {
        setIsLoading(true);
		axios.get('/api/projects/readProjectListFullForViewer')
        .then((response : any) => {
            setProjectDataList(response.data);
            // console.log(response.data)
        })
        .catch((error : any) => {
            console.error('Error read project data:', error);
        })
        .finally(() => setIsLoading(false));
	}

    const readMemberBackendData = async () => {
        setIsLoading(true);
		axios.get('/api/members/readMemberBackendForViewer')
        .then((response : any) => {
            setBackendDataList(response.data);
            // console.log(response.data)
        })
        .catch((error : any) => {
            console.error('Error read project data:', error);
        })
        .finally(() => setIsLoading(false));
	}

    const readMemberFrontendData = async () => {
        setIsLoading(true);
		axios.get('/api/members/readMemberFrontendForViewer')
        .then((response : any) => {
            setFrontendDataList(response.data);
            // console.log(response.data)
        })
        .catch((error : any) => {
            console.error('Error read project data:', error);
        })
        .finally(() => setIsLoading(false));
	}

    const readMemberItcData = async () => {
        setIsLoading(true);
		axios.get('/api/members/readMemberITCForViewer')
        .then((response : any) => {
            setItcDataList(response.data);
            // console.log(response.data)
        })
        .catch((error : any) => {
            console.error('Error read project data:', error);
        })
        .finally(() => setIsLoading(false));
	}

    const readMemberTesterData = async () => {
        setIsLoading(true);
		axios.get('/api/members/readMemberTesterForViewer')
        .then((response : any) => {
            setTesterDataList(response.data);
            // console.log(response.data)
        })
        .catch((error : any) => {
            console.error('Error read project data:', error);
        })
        .finally(() => setIsLoading(false));
	}

    return (
        <DefaultLayout>
            {isLoading && <LoadingFullPage />}
			<HeadPage title='Home' customClass='home' />
            <div className={styles.wrapPage}>
                <ProjectStatistics projectDataList={projectDataList}/>
                <div className='inner-2'>
                    <TeamActivity 
                        backendDataList={backendDataList}
                        frontendDataList={frontendDataList}
                        itcDataList={itcDataList}
                        testerDataList={testerDataList}
                    />
                </div>
            </div>
        </DefaultLayout>
    )
}
