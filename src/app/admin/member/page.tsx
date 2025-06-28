'use client'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react';
import LoadingFullPage from '~/app/component/LoadingFullPage/LoadingFullPage';
import DefaultLayout from '~/app/admin/layout/DefaultLayout';
import HeadPage from '~/app/admin/component/HeadPage/HeadPage';
import MemberList from '~/app/admin/member/component/MemberList/MemberList';
import MemberFilterKeyword from '~/app/admin/member/component/MemberFilterKeyword/MemberFilterKeyword';
import MemberFilterTeam from '~/app/admin/member/component/MemberFilterTeam/MemberFilterTeam';

import styles from './page.module.scss';
import axios from 'axios';
import teamDataList from '~/data/teams.json';
import positionDataList from '~/data/positions.json';
import { useSession } from "next-auth/react";

export default function MemberPage () {
	const { data: session } = useSession();
	const allowedRolesMember = ['admin', 'manager'];
    const authorCheckManager = allowedRolesMember.includes(session?.user?.role ?? '');
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [memberDataList, setMemberDataList] = useState([]);
	const [inputKeywordNickname, setInputKeywordNickname] = useState<string>('');
	const [filterNickname, setFilterNickname] = useState<string>('');
	const [filterTeam, setFilterTeam] = useState<string>('team_all');

	const allTeam = { 
        id: "team_all",
        name: "All Teams",
        icon: ""
    };
    const updatedTeamDataList = [allTeam, ...teamDataList];

	useEffect(()=>{
		readMemberListData();
    }, []);

	const readMemberListData = async () => {
		await axios.get('/api/members/readMemberListFullRole')
			.then((response : any) => {
				setMemberDataList(response.data);
				// console.log(response.data)
			})
			.catch((error : any) => {
				console.error('Error read member data:', error);
			})
	}

	const handleUpdateOnOffStatus = async (memberDataUpdated : any) => {
		try {
			await axios.put(`/api/members/updateOnOffMember`, memberDataUpdated);
			setMemberDataList((prevMember : any) =>
				prevMember.map((member : any) =>
					member.memberId === memberDataUpdated.memberId ? memberDataUpdated : member
				)
			);
		} catch (error) {
		  	console.error("Error updating product status:", error);
		}
	};

	const handleUpdateProjectCurrent = async (idDataUpdate : any) => {
		try {
			await axios.put(`/api/project_roles/updateIsCurrentProjectRole`, idDataUpdate);
			handleMemberFilter();
		} catch (error) {
		  	console.error("Error updating Current Project:", error);
		}
	}

	const handleInputKeywordNickname= (keyword : string) => {
		setInputKeywordNickname(keyword);
	}

	const handleMemberFilterNickname = () => {
		setFilterNickname(inputKeywordNickname);
	}

	const handleMemberFilterTeam = (teamId : string) => {
		setFilterTeam(teamId);
	}

	const handleMemberFilter = useCallback( async () => {
		setIsLoading(true);
		try {
			const response = await axios.get('/api/members/filterMember', { params: {
				nickname: filterNickname,
				teamId: filterTeam === 'team_all' ? '': filterTeam,
			}});
			setMemberDataList(response.data);
			// console.log(response.data);
		} catch (error) {
			console.error('Error fetching members:', error);
		} finally {
			setIsLoading(false);
		}
	},[filterNickname, filterTeam]);

	const handleResetMemberFilterKeyword = () => {
		setFilterNickname('');
		setInputKeywordNickname('');
		handleMemberFilter();
	}

	const handleResetMemberFilterTeam = () => {
		setFilterTeam('team_all');
		handleMemberFilter();
	}

	const handleUpdateProjectStatus = useCallback(async (dataUpdate : any) => {
		try {
			await axios.put(`/api/project_roles/updateIsStatusProjectRole`, dataUpdate);
			handleMemberFilter();
		} catch (error) {
		  	console.error("Error updating Status Project:", error);
		}
	},[handleMemberFilter])
	
	useEffect(() => {
		handleMemberFilter();
	}, [filterNickname, filterTeam, handleMemberFilter]);

  	return (
		<DefaultLayout>
			{isLoading && <LoadingFullPage />}
			<HeadPage title='Members' customClass=''>
				<div className={styles.wrapFilter}>
					<div className={styles.filter}>
						<MemberFilterKeyword 
							onInputKeywordNickname={handleInputKeywordNickname}
							onMemberFilterNickname={handleMemberFilterNickname}
							onResetMemberFilter={handleResetMemberFilterKeyword}
						/>
						<MemberFilterTeam
							idTeamSelected={filterTeam}
							teamDataList={updatedTeamDataList}
							onMemberFilterTeam={handleMemberFilterTeam}
							onResetMemberFilterTeam={handleResetMemberFilterTeam}
						/>
					</div>
					{authorCheckManager && <Link href='/admin/member/add' className={`${styles.btnAdd} btnAdd`}>Add Member</Link>}
				</div>
			</HeadPage>
			<div className='wrapPage'>
				{memberDataList && teamDataList && positionDataList && <MemberList 
					memberDataList={memberDataList}
					teamDataList={teamDataList}
					positionDataList={positionDataList}
					onUpdateOnOffStatus={handleUpdateOnOffStatus}
					onUpdateProjectCurrent={handleUpdateProjectCurrent}
					onUpdateProjectStatus={handleUpdateProjectStatus}
				/>}
			</div>
        </DefaultLayout>
	)
}
