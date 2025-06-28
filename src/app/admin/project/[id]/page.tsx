'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect, useCallback } from 'react';
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
import PopupAlert from '~/app/admin/component/PopupAlert/PopupAlert';
import validationLogo from '~/app/utils/validation/validationLogo.mjs'
import validationProjectName from '~/app/utils/validation/validationProjectName.mjs'
import convertToBase64 from '~/app/utils/convert/convertToBase64.mjs';
import axios from 'axios';

import platformsDataList from '~/data/platforms.json';

import { useSession } from "next-auth/react";

export default function EditProjectPage (
	{ params } : { params : any}
) {
	const { data: session } = useSession();
    const allowedRolesMember = ['admin', 'manager'];
    const authorCheckManager = allowedRolesMember.includes(session?.user?.role ?? '');

	const router = useRouter();
	const projectId = params.id;

	const [isOverlay, setIsOverlay] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isPopupError, setIsPopupError] = useState(false);
	const [isPopupEditSuccess, setIsPopupEditSuccess] = useState(false);
	const [isPopupDeleteSuccess, setIsPopupDeleteSuccess] = useState(false);
	const [isPopupAlertDelete, setIsPopupAlertDelete] = useState(false);

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
		projectId: projectId,
		logo: '',
		name: '',
		platforms: [],
		situation: 'situation_01',
		status: 'project_status_0',
		memberListInProject: [],
		report: '',	
	});

	useEffect(() => {
		setProject(prev => ({
			...prev,
			memberListInProject: selectedMember,
		}));
	}, [selectedMember]);

	const readProjectData = useCallback((id : any) => {
		axios.get(`/api/projects/readProjectById/`, {params: { id }})
			.then((response : any) => {
				setProject(project => ({
					projectId: projectId,
					logo: response.data.logo,
					name: response.data.name,
					platforms: response.data.platforms,
					situation: response.data.situation,
					status: response.data.status,
					memberListInProject: response.data.memberListInProjectFinal,
					report: response.data.report,	
				}));
				// console.log(response.data);
				const idPlatformList = response.data.platforms;
				const platformListDefault : any = platformsDataList.filter(platform => idPlatformList.includes(platform.id));
				setSelectedPlatforms(platformListDefault);
				setMemberDataList(response.data.memberListAllConvertedId);
				setSelectedMember(response.data.memberListInProjectFinal);
				setSelectedMainController(response.data.mainControllerId);
				setSelectedBackendController(response.data.backendControllerId);
				setSelectedFrontendController(response.data.frontendControllerId);
			})
			.catch((error : any) => {
				console.error('Error read project data:', error);
				router.push('/404');
			});
	},[router, projectId]);

	useEffect(()=>{
		readProjectData(projectId);
    }, [readProjectData, projectId]);

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

	useEffect(()=>{
		return () => {
			fileLogo && URL.revokeObjectURL(fileLogo.preview)
		}
	},[fileLogo]);

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
		if(authorCheckManager){
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
	}

	const handleSelectBackendController = (backend_id : string) => {
		if(authorCheckManager){
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
	}

	const handleSelectFrontendController = (frontend_id : string) => {
		if(authorCheckManager){
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
	}
	
	const updateProjectData = async () => {
		// console.log(project)
		setIsLoading(true);
		setIsOverlay(true);
        try {
            const response = await axios.put(`/api/projects/${projectId}`, project);
            console.log("Project updated successfully!");
            setIsLoading(false);
            setIsPopupEditSuccess(true);
        } catch (error : any) {
			setIsLoading(false);
            setIsPopupError(true);
			console.log('Failed to updated Project');
        }
	}
	
	const handleUpdateProject = async () => {
		if(isChangeLogo && isCheckLogo){
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

		setProject(prevProject => ({
			...prevProject,
			memberListInProject: selectedMember
		}));

		if(isCheckLogo && projectNameCheck && (selectedMember.length > 0) && (selectedPlatforms.length > 0)){
			updateProjectData();
		}
	};

	const handleOpenAlertDeleteProject = () => {
		setIsOverlay(true);
		setIsLoading(false);
		setIsPopupAlertDelete(true);
	}

	const handleDeleteProject = async () => {
		setIsPopupAlertDelete(false);
		setIsLoading(true);
        try {
            const response = await axios.delete(`/api/projects/deleteProject`, {params: { projectId }});
            console.log('Project document deleted successfully');
            console.log(response.data.message);
			setIsLoading(false);
            setIsPopupDeleteSuccess(true);

        } catch (error : any) {
            setIsLoading(false);
            setIsPopupError(true);
            console.log('Failed to delete Project: ' + error);
        }
	}

	const handleCloseModal = () => {
		setIsOverlay(false);
		setIsLoading(false);
		setIsPopupError(false);
		setIsPopupEditSuccess(false);		
		setIsPopupAlertDelete(false);
		if(isPopupDeleteSuccess){
			router.push('/admin/project/');
		}
	}
	
	const handleClosePopupDeleteSuccess = () => {
		router.push('/admin/project/');
	}
	
  	return (
		<DefaultLayout>
			<HeadPageSecond title='Edit project' >
				<ul className='breadcrumb'>
					<li><a href="/admin/project/">Projects</a></li>
					<li><span>Edit project</span></li>
				</ul>
			</HeadPageSecond>
            <div className={`${styles.wrap} wrapPage`}>
				<div className="formCmn2">
					<div className="row boxLogo">
						<label htmlFor="projectLogo" className="fileLogo">
							<span className='iconCamera'></span>
							<figure className="image" ref={imageLogoRef}>
								{(project.logo || fileLogo?.preview) && 
								<Image width={0} height={0} alt='' src={fileLogo ? fileLogo.preview : project.logo} />}
							</figure>
							<input 
								id="projectLogo" type="file" name="projectLogo" 
								onChangeCapture={handleChangeLogo}
							/>
						</label>
						<p className="txtError center" ref={errorImageLogoRef}></p>
					</div>
					<div className="row">
						<p className="fieldTitle">Project name</p>
						<div className="fieldBox">
							<input 
								className='inputCmn' type="text" placeholder='Kanagawa-arts.or.jp' maxLength={30}
								ref={inputProjectNameRef}
								onChange={handleGetProjectName}
								onBlur={handleValidationProjectName}
								defaultValue={project.name}
							/>
							<p className="txtError" ref={errorProjectNameRef}></p>
						</div>
					</div>
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
							{isErrorSelectPlatforms && <p className="txtError show">Please select a platform</p>}
						</div>
					</div>
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
							{isErrorSelectMember && <p className="txtError show">Please select members</p>}
						</div>
					</div>
					{authorCheckManager && <>
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
							<p className="fieldTitle">PL Backend:</p>
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
							<p className="fieldTitle">PL Frontend:</p>
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
					</>}
					<div className="row boxBtn">
						<button className='btnSave size1' onClick={handleUpdateProject}><span>Update</span></button>
						{authorCheckManager &&
							<button className='btnDelete ml20 size1' onClick={handleOpenAlertDeleteProject}>
								<span>Delete</span>
							</button>
						}
					</div>
				</div>
			</div>
			{isOverlay && <Overlay closePopup={handleCloseModal}>
				{isLoading && <Loading />}
				{isPopupError && <PopupError 
					closePopup={handleCloseModal}
					text='Failed to edit project, please try again!'
				/>}
				{isPopupEditSuccess && <PopupSuccess 
					closePopup={handleCloseModal}
					text='Project updated successfully!'
				/>}
				{isPopupAlertDelete && <PopupAlert 
					closePopup={handleCloseModal}
					title='Are you sure you want to delete this project?'
					content={
						<div className="row boxBtn">
							<button className='btnCancel mr20' onClick={handleCloseModal}><span>Cancel</span></button>
							<button className='btnDelete' onClick={handleDeleteProject}><span>Delete</span></button>
						</div>
					}
				/>}
				{isPopupDeleteSuccess && <PopupSuccess 
					closePopup={handleClosePopupDeleteSuccess}
					text='Project deleted successfully!'
				/>}
			</Overlay>}
        </DefaultLayout>
	)
}
