"use client";
import { useState, useRef, useEffect, Suspense } from 'react';
import Select from "react-select";
import styles from './page.module.scss';
import Image from 'next/image';
import DefaultLayout from '~/app/admin/layout/DefaultLayout';
import HeadPageSecond from '~/app/admin/component/HeadPageSecond/HeadPageSecond';
import SelectTagManager from '~/app/admin/component/SelectTagManager/SelectTagManager';
import Overlay from '~/app/admin/component/Overlay/Overlay';
import Loading from '~/app/admin/component/Loading/Loading';
import PopupError from '~/app/admin/component/PopupError/PopupError';
import PopupSuccess from '~/app/admin/component/PopupSuccess/PopupSuccess';
import { LOGO_DEMO } from '~/app/constant/image/logoDemo';

import validationLogo from '~/app/utils/validation/validationLogo.mjs'
import validationProjectName from '~/app/utils/validation/validationProjectName.mjs'
import convertToBase64 from '~/app/utils/convert/convertToBase64.mjs';
import axios from 'axios';

import platformsDataList from '~/data/platforms.json';
import { Project } from '~/app/utils/interfaces/project.interface';

export default function AddMemberPage () {
	const [isOverlay, setIsOverlay] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isPopupError, setIsPopupError] = useState(false);
	const [isPopupSuccess, setIsPopupSuccess] = useState(false);

	const [isErrorSelectPlatforms, setIsErrorSelectPlatforms] = useState(false);
	const [isErrorSelectMember, setIsErrorSelectMember] = useState(false);

	const imageLogoRef = useRef<HTMLElement>(null);
	const errorImageLogoRef = useRef<HTMLParagraphElement>(null);
	const inputProjectNameRef = useRef<HTMLInputElement>(null);
    const errorProjectNameRef = useRef<HTMLParagraphElement>(null);

	const [memeberDataList, setMemberDataList] = useState([]);
	const [fileLogo, setFileLogo] = useState<any>('');
	const [selectedPlatforms, setSelectedPlatforms] = useState([]); 
	const [selectedMember, setSelectedMember] = useState([]); 
	const [selectedMainController, setSelectedMainController] = useState<string>(''); 
	const [selectedBackendController, setSelectedBackendController] = useState<string>(''); 
	const [selectedFrontendController, setSelectedFrontendController] = useState<string>(''); 
	const [isCheckLogo, setIsCheckLogo] = useState<boolean>(true);
	const [isChangeLogo, setIsChangeLogo] = useState<boolean>(false);
	
	const [project, setProject] = useState({
		logo: '',
		name: '',
		platforms: [],
		situation: 'situation_01',
		status: 'project_status_0',
		report: '',	
		memberListInProject: [],
	});

	useEffect(()=>{
		readMemberData();
    }, []);

	useEffect(()=>{
		return () => {
			fileLogo && URL.revokeObjectURL(fileLogo.preview)
		}
	},[fileLogo]);

	useEffect(() => {
		setProject(prev => ({
			...prev,
			memberListInProject: selectedMember,
		}));
	}, [selectedMember]);

	const readMemberData = () => {
		axios.get('/api/members/readMemberList')
			.then((response : any) => {
				if (Array.isArray(response.data)) {
					const memberRoleList = response.data.map((member: any) => ({
						memberId: member._id.toString(),
						nickname: member.nickname,
						role: 'member',
					}));
					setMemberDataList(memberRoleList);
				} else {
					console.error("response.data is not an array:", response.data);
				}
			})
			.catch((error : any) => {
				console.error('Error read member data:', error);
			});
	}

	const handleChangeLogo = (event : any) => {
		const file = event.target.files[0];
		setIsChangeLogo(true);
		if(file){
			const checkLogo = validationLogo(file, imageLogoRef.current, errorImageLogoRef.current);
			if(checkLogo === false){
				setIsCheckLogo(false);
				errorImageLogoRef.current?.classList.add('show');
			} else {
				setIsCheckLogo(true);
				errorImageLogoRef.current?.classList.remove('show');
				file.preview = URL.createObjectURL(file);
				setFileLogo(file);
			}
		}
	}

	const handleGetProjectName = (event : any) => {
		validationProjectName(event.target.value, inputProjectNameRef.current, errorProjectNameRef.current);
		setProject(prevProject => ({
			...prevProject,
			name: event.target.value
		}));
	}

	const handleValidationProjectName = (event : any) => {
		validationProjectName(event.target.value, inputProjectNameRef.current, errorProjectNameRef.current);
	}

	const handleGetProjectReport = (event : any) => {
		setProject(prevProject => ({
			...prevProject,
			report: event.target.value
		}));
	}

	const handleSelectPlatforms = (platforms : any) => {
		const idList = platforms.map((option : any) => option.id);
		if (platforms.length > 0) {
			setIsErrorSelectPlatforms(false);
			setProject(prevProject => ({
				...prevProject,
				platforms: idList
			}));
		}
		setSelectedPlatforms(platforms || []);
	}

	const handleSelectMemebers = (members : any) => {
		const idList = members.map((option : any) => {
			return option.memberId
		});
		if (members.length > 0) {
			setIsErrorSelectMember(false);
			if(idList.length < selectedMember.length){
				if(!idList.includes(selectedMainController)){
					setSelectedMainController('');
				}

				if(!idList.includes(selectedBackendController)){
					setSelectedBackendController('');
				}

				if(!idList.includes(selectedFrontendController)){
					setSelectedFrontendController('');
				}
			}
		}
		setSelectedMember(members);
	}

	const handleSelectMainController = (controller_id : string) => {
		setSelectedMainController(controller_id);
		if(selectedBackendController === controller_id){
			setSelectedBackendController('');
		}
		if(selectedFrontendController === controller_id){
			setSelectedFrontendController('');
		}
		setSelectedMember((prevMembers : any) =>
			prevMembers.map((member : any) => {
				if (member.memberId === controller_id) {
					return { 
						...member, 
						role: 'mainController' 
					};
				}
				if (member.role === 'mainController') {
					return { 
						...member, 
						role: 'member' 
					};
				}
				return member;
			})
		);
	}

	const handleSelectBackendController = (backend_id : string) => {
		setSelectedBackendController(backend_id);
		if(selectedMainController === backend_id){
			setSelectedMainController('');
		}
		if(selectedFrontendController === backend_id){
			setSelectedFrontendController('');
		}
		setSelectedMember((prevMembers : any) =>
			prevMembers.map((member : any) => {
				if (member.memberId === backend_id) {
					return { 
						...member, 
						role: 'backendController' 
					};
				}
				if (member.role === 'backendController') {
					return { 
						...member, 
						role: 'member' 
					};
				}
				return member;
			})
		);
	}

	const handleSelectFrontendController = (frontend_id : string) => {
		setSelectedFrontendController(frontend_id);
		if(selectedMainController === frontend_id){
			setSelectedMainController('');
		}
		if(selectedBackendController === frontend_id){
			setSelectedBackendController('');
		}
		setSelectedMember((prevMembers : any) =>
			prevMembers.map((member : any) => {
				if (member.memberId === frontend_id) {
					return { 
						...member, 
						role: 'frontendController' 
					};
				}
				if (member.role === 'frontendController') {
					return { 
						...member, 
						role: 'member' 
					};
				}
				return member;
			})
		);

		setProject(prevProject => ({
			...prevProject,
			memberListInProject: selectedMember
		}));
	}
	
	const addProjectData = async () => {
		// console.log(project)
		setIsLoading(true);
		setIsOverlay(true);
		try {
            const response = await axios.post('/api/projects/createProject', project)
            console.log("Project document uploaded successfully!");
            setIsLoading(false);
            setIsPopupSuccess(true);
        } catch (error : any) {
			setIsLoading(false);
            setIsPopupError(true);
			console.log('Failed to create Project');
        }
	}
	
	const handleAddProject = async () => {
		if(isCheckLogo && isChangeLogo){
            project.logo = await convertToBase64(fileLogo);
		}

		const projectNameCheck = validationProjectName(project.name, inputProjectNameRef.current, errorProjectNameRef.current);
		if (!projectNameCheck) {
			console.log('There is an error in the project name field.')
		}

		if (selectedPlatforms.length === 0) {
			setIsErrorSelectPlatforms(true)
		} else {
			setIsErrorSelectPlatforms(false)
		}

		if (selectedMember.length === 0) {
			setIsErrorSelectMember(true)
		} else {
			setIsErrorSelectMember(false)
		}
		
		if(isCheckLogo && projectNameCheck && (selectedMember.length > 0) && (selectedPlatforms.length > 0)){
			addProjectData();
		}
	};

	const handleCloseModal = () => {
		setIsOverlay(false);
		setIsLoading(false);
		setIsPopupError(false);
		setIsPopupSuccess(false);
		setFileLogo('');
		setSelectedPlatforms([]);
		setSelectedMember([]);
		setSelectedMainController('');
		setSelectedBackendController('');
		setSelectedFrontendController('');
		setProject(prevProject => ({
			...prevProject,
			logo: LOGO_DEMO,
			name: '',
			platforms: [],
			memberListInProject: [],
			report: '',	
		}));
	}
	
  	return (
		<Suspense>
			<DefaultLayout>
				<HeadPageSecond title='Add project' >
					<ul className='breadcrumb'>
						<li><a href="/admin/project/">Projects</a></li>
						<li><span>Add project</span></li>
					</ul>
				</HeadPageSecond>
				<div className={`${styles.wrap} wrapPage`}>
					<div className="formCmn2">
						<div className="row boxLogo">
							<label htmlFor="projectLogo" className="fileLogo">
								<span className='iconCamera'></span>
								<figure className="image" ref={imageLogoRef}>
									<Image 
										width={0}
										height={0}
										alt='' 
										src={fileLogo? fileLogo.preview : LOGO_DEMO} 
									/>
								</figure>
								<input 
									id="projectLogo" type="file" name="projectLogo" 
									onChangeCapture={handleChangeLogo}
								/>
							</label>
						</div>
						<p className="txtError3 center" ref={errorImageLogoRef}></p>
						<div className="row">
							<p className="fieldTitle">Project name</p>
							<div className="fieldBox">
								<input 
									className='inputCmn' type="text" placeholder='Alibaba.com...' maxLength={60}
									ref={inputProjectNameRef}
									onChange={handleGetProjectName}
									onBlur={handleValidationProjectName}
									value={project.name}
								/>
							</div>
						</div>
						<p className="txtError2" ref={errorProjectNameRef}></p>
						<div className="row">
							<p className="fieldTitle">Platforms</p>
							<div className="fieldBox">
								<Select
									instanceId="select-add-platforms"
									className={isErrorSelectPlatforms ? 'select-cmn error' : 'select-cmn'}
									classNamePrefix="select-cmn"
									isMulti
									options={platformsDataList}
									getOptionLabel={(option : any) => option.name}
									getOptionValue={(option : any) => option.id.toString()}
									value={selectedPlatforms}
									onChange={handleSelectPlatforms}
									closeMenuOnSelect={false}
									placeholder="..."
								/>
							</div>
						</div>
						{isErrorSelectPlatforms && <p className="txtError2 show">Please select a platforms</p>}
						<div className="row">
							<p className="fieldTitle">Members</p>
							<div className="fieldBox">
								<Select
									instanceId="select-project-add-member"
									className={isErrorSelectMember ? 'select-cmn error' : 'select-cmn'}
									classNamePrefix="select-cmn"
									isMulti
									options={memeberDataList}
									getOptionLabel={(option : any) => option.nickname}
									getOptionValue={(option : any) => option.memberId}
									value={selectedMember}
									onChange={handleSelectMemebers}
									closeMenuOnSelect={false}
									placeholder="..."
								/>
							</div>
						</div>
						{isErrorSelectMember && <p className="txtError2 show">Please select a member</p>}
						<div className="row">
							<p className="fieldTitle">Controller</p>
							<div className="fieldBox">
								<SelectTagManager
									className='selectCmn'
									data={selectedMember}
									keyName='nickname'
									onChange={handleSelectMainController}
									value={selectedMainController}
								/>
							</div>
						</div>
						<div className="row">
							<p className="fieldTitle">PL Backend</p>
							<div className="fieldBox">
								<SelectTagManager
									className='selectCmn'
									data={selectedMember}
									keyName='nickname'
									onChange={handleSelectBackendController}
									value={selectedBackendController}
								/>
							</div>
						</div>
						<div className="row">
							<p className="fieldTitle">PL Frontend</p>
							<div className="fieldBox">
								<SelectTagManager
									className='selectCmn'
									data={selectedMember}
									keyName='nickname'
									onChange={handleSelectFrontendController}
									value={selectedFrontendController}
								/>
							</div>
						</div>
						<div className="row">
							<p className="fieldTitle">Report</p>
							<div className="fieldBox">
								<textarea 
									className='textareaCmn'
									onChange={handleGetProjectReport}
									value={project.report}
								/>
							</div>
						</div>
						<div className="row boxBtn">
							<button className='btnSave' onClick={handleAddProject}><span>Save</span></button>
						</div>
					</div>
				</div>
				{isOverlay && <Overlay closePopup={handleCloseModal}>
					{isLoading && <Loading />}
					{isPopupError && <PopupError 
						closePopup={handleCloseModal}
						text='Failed to create project, please try again!'
					/>}
					{isPopupSuccess && <PopupSuccess 
						closePopup={handleCloseModal}
						text='Project created successfully!'
					/>}
				</Overlay>}
			</DefaultLayout>
		</Suspense>
	)
}
