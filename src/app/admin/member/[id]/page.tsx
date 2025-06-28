'use client'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect, useCallback } from 'react';
import styles from './page.module.scss';
import Select from "react-select";
import Image from 'next/image';
import DefaultLayout from '~/app/admin/layout/DefaultLayout';
import HeadPageSecond from '~/app/admin/component/HeadPageSecond/HeadPageSecond';
import SelectTag from '~/app/admin/component/SelectTag/SelectTag';
import Overlay from '~/app/admin/component/Overlay/Overlay';
import Loading from '~/app/admin/component/Loading/Loading';
import PopupError from '~/app/admin/component/PopupError/PopupError';
import PopupSuccess from '~/app/admin/component/PopupSuccess/PopupSuccess';
import PopupAlert from '~/app/admin/component/PopupAlert/PopupAlert';

import validationAvatar from '~/app/utils/validation/validationAvatar.mjs'
import validationNickname from '~/app/utils/validation/validationNickname.mjs'
import validationEmail from '~/app/utils/validation/validationEmail.mjs'
import convertToBase64 from '~/app/utils/convert/convertToBase64.mjs';

import axios from 'axios';
import teamDataList from '~/data/teams.json';
import positionDataList from '~/data/positions.json';
import { Member } from '~/app/utils/interfaces/member.interface';

export default function EditMemberPage (
	{ params } : { params : any}
) {
	const router = useRouter();
	const memberId = params.id;

	const [isOverlay, setIsOverlay] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isPopupEditSuccess, setIsPopupEditSuccess] = useState(false);
	const [isPopupDeleteSuccess, setIsPopupDeleteSuccess] = useState(false);
    const [isPopupError, setIsPopupError] = useState(false);
	const [isErrorSelectTeam, setIsErrorSelectTeam] = useState(false);
	const [isPopupAlertDelete, setIsPopupAlertDelete] = useState(false);

    const imageAvatarRef = useRef<HTMLElement>(null);
	const errorAvatarRef = useRef<HTMLParagraphElement>(null);
    const errorNicknameRef = useRef<HTMLParagraphElement>(null);
    const inputNicknameRef = useRef<HTMLInputElement>(null);
    const errorEmailRef = useRef<HTMLParagraphElement>(null);
    const inputEmailRef = useRef<HTMLInputElement>(null);

	const [fileAvatar, setFileAvatar] = useState<any>(null);
	const [selectedTeam, setSelectedTeam] = useState([]); 
	const [selectedPosition, setSelectedPosition] = useState('');
	const [selectedRole, setSelectedRole] = useState<string>('staff');
	const [isChangeAvatar, setIsChangeAvatar] = useState<boolean>(false)

	const [member, setMember] = useState<Member>({
		avatar: '',
		nickname: '',
		email: '',
		team: [],
		position: positionDataList[0].id,
		off: false,
		role: 'staff'
	});

	const readMemberData = useCallback((id : any) => {
		axios.get(`/api/members/readMemberById/`, {params: { id }})
			.then((response : any) => {
				setMember(prevMember => ({
					...prevMember,
					avatar: response.data.avatar,
					nickname: response.data.nickname,
					email: response.data.email,
					team: response.data.team,
					position: response.data.position,
					off: response.data.off,
					role: response.data.role,
				}));
				const idList = response.data.team;
				const teamDefault : any = teamDataList.filter(team => idList.includes(team.id));
				setSelectedTeam(teamDefault);
				setSelectedPosition(response.data.position);
				setSelectedRole(response.data.role);
			})
			.catch((error : any) => {
				console.error('Error read member data:', error);
				router.push('/404');
			});
	},[router]);

	useEffect(()=>{
		readMemberData(memberId);
    }, [readMemberData, memberId]);

	const handleGetNickname = (event : any) => {
		setMember(prevMember => ({
			...prevMember,
			nickname: event.target.value
		}));
    }

	const handleValidationNickname = (event : any) => {
		validationNickname(event.target.value, inputNicknameRef.current, errorNicknameRef.current);
	}
	
	const handleGetEmail = (event : any) => {
		setMember(prevMember => ({
			...prevMember,
			email: event.target.value
		}));
	}

	const handleValidationEmail = (event : any) => {
		validationEmail(event.target.value, inputEmailRef.current, errorEmailRef.current);
	}

	const handleSelectTeam = (teamList : any) => {
		const idList = teamList.map((option : any) => option.id);
		if (teamList.length > 0) {
			setIsErrorSelectTeam(false);
			setMember(prevMember => ({
				...prevMember,
				team: idList
			}));
		}
		setSelectedTeam(teamList || []);
	}

	const handleSelectPosition = (value : string) => {
		setMember(prevMember => ({
			...prevMember,
			position: value
		}));
		setSelectedPosition(value)
	}

	const handleSelectRole = (e : React.ChangeEvent<HTMLInputElement>) => {
		const valueResult = e.target.value; 
		setMember(prevMember => ({
			...prevMember,
			role: valueResult
		}));
		setSelectedRole(valueResult)
	}

	const handleChangeAvatar = (event : any) => {
		const file = event.target.files[0];
		setIsChangeAvatar(true);
		if(file){
			const checkAvatar = validationAvatar(file, errorAvatarRef.current);
			if(checkAvatar === false){
				errorAvatarRef.current?.classList.add('show');
			} else {
				errorAvatarRef.current?.classList.remove('show');
				file.preview = URL.createObjectURL(file);
				setFileAvatar(file);
			}
		}
	}

	useEffect(()=>{
		return () => {
			fileAvatar && URL.revokeObjectURL(fileAvatar.preview)
		}
	},[fileAvatar]);

	const updateMemberData = async (member : any) => {
		setIsLoading(true);
		setIsOverlay(true);
        try {
            const response = await axios.put(`/api/members/${memberId}`, member);
            console.log("Member updated successfully!");
            setIsLoading(false);
            setIsPopupEditSuccess(true);
        } catch (error : any) {
            setIsLoading(false);
            if (error.response && error.response.data) {
                console.log(error.response.data.message);
                inputNicknameRef.current?.classList.add('error');
                if(errorNicknameRef.current){
                    errorNicknameRef.current.classList.add('show');
                    errorNicknameRef.current.textContent = 'Name already exists';
                }
            } else {
                console.log('Failed to updated Member');
                setIsPopupError(true);
            }
        }
	}

	const handleUpdateMember = async (event : any) => {
		let avatarCheck = true;
		if(isChangeAvatar){
			avatarCheck = validationAvatar(fileAvatar, imageAvatarRef.current, errorAvatarRef.current);
			if (avatarCheck){
				member.avatar = await convertToBase64(fileAvatar);
			} else {
				console.log('There is an error in the nick avatar field.');
			}
        }

		const nicknameCheck = validationNickname(member.nickname, inputNicknameRef.current, errorNicknameRef.current);
		if (!nicknameCheck) {
			console.log('There is an error in the nickname field.')
		}

		const emailCheck = validationEmail(member.email, inputEmailRef.current, errorEmailRef.current);
		if (!emailCheck) {
			console.log('There is an error in the email field.')
		}

		if (selectedTeam.length === 0) {
			setIsErrorSelectTeam(true)
		} else {
			setIsErrorSelectTeam(false)
		}

		if(avatarCheck && nicknameCheck && emailCheck && (selectedTeam.length >= 0)){
			updateMemberData(member);
		}
	};

	const handleOpenAlertDeleteMember = () => {
		setIsOverlay(true);
		setIsLoading(false);
		setIsPopupAlertDelete(true);
	}

	const handleDeleteMember = async () => {
		setIsPopupAlertDelete(false);
		setIsLoading(true);
        try {
            const response = await axios.delete(`/api/members/deleteMember`, {params: { memberId }});
            console.log('Member document deleted successfully');
            console.log(response.data.message);
			setIsLoading(false);
            setIsPopupDeleteSuccess(true);

        } catch (error : any) {
            setIsLoading(false);
            setIsPopupError(true);
            console.log('Failed to delete Member: ' + error);
        }
	}

	const handleCloseModal = () => {
		setIsOverlay(false);
		setIsLoading(false);
		setIsPopupError(false);
		setIsPopupEditSuccess(false);	
		setIsPopupAlertDelete(false);	
		if(isPopupDeleteSuccess){
			router.push('/admin/member/');
		}
	}

	const handleCloseModalDeleteSuccess = () => {
		router.push('/admin/member/');
	}

  	return (
		<DefaultLayout>
			<HeadPageSecond title='Edit member' >
				<ul className='breadcrumb'>
					<li><a href="/admin/member/">Members</a></li>
					<li><span>Edit member</span></li>
				</ul>
			</HeadPageSecond>
			<div className={`${styles.wrap} wrapPage`}>
				<div className="formCmn1">
					<div className="row boxAvatar">
						<label htmlFor="memberAvatar" className="fileAvatar">
							<span className='iconCamera'></span>
							<figure className="image" ref={imageAvatarRef}>
								{(member.avatar || fileAvatar?.preview) && 
								<Image width={0} height={0} alt='' src={fileAvatar ? fileAvatar.preview : member.avatar} />}
							</figure>
							<input 
								id="memberAvatar" type="file" name="memberAvatar" 
								onChangeCapture={handleChangeAvatar}
							/>
						</label>
						<p className="txtError center" ref={errorAvatarRef}></p>
					</div>
					<div className="row">
						<p className="fieldTitle">Name</p>
						<div className="fieldBox">
							<input 
								className='inputCmn' type="text" placeholder='Nguyen...' maxLength={15}
								ref={inputNicknameRef}
								onChange={handleGetNickname}
								onBlur={handleValidationNickname}
								defaultValue={member.nickname}
							/>
							<p className="txtError" ref={errorNicknameRef}></p>
						</div>
					</div>
					<div className="row">
						<p className="fieldTitle">Email</p>
						<div className="fieldBox">
							<input 
								className='inputCmn' type="text" placeholder='nguyen@gmail.com...' 
								ref={inputEmailRef}
								onChange={handleGetEmail}
								onBlur={handleValidationEmail}
								defaultValue={member.email}
							/>
							<p className="txtError" ref={errorEmailRef}></p>
						</div>
					</div>
					<div className="row">
						<p className="fieldTitle">Team</p>
						<div className="fieldBox">
							<Select
								instanceId="select-edit-member"
								className={isErrorSelectTeam ? 'select-cmn error' : 'select-cmn'}
								classNamePrefix="select-cmn"
								isMulti
								options={teamDataList}
								getOptionLabel={(option : any) => option.name}
								getOptionValue={(option : any) => option.id}
								value={selectedTeam}
								onChange={handleSelectTeam}
								isOptionDisabled={() => selectedTeam.length >= 2}
								closeMenuOnSelect={false}
								placeholder="..."
							/>
							{isErrorSelectTeam && <p className="txtError show">Please select a team</p>}
						</div>
					</div>
					<div className="row">
						<p className="fieldTitle">Position</p>
						<div className="fieldBox">
							<SelectTag
								className='selectCmn'
								data={positionDataList}
								keyName='name'
								onChange={handleSelectPosition}
								value={selectedPosition}
							/>
						</div>
					</div>
					<div className="row">
						<p className="fieldTitle">Role</p>
						<div className="fieldRadio">
							<label className="inputRadio">
								<input 
									type="radio" 
									name="system_role" 
									value="staff" 
									checked={selectedRole === 'staff'}
									onChange={handleSelectRole}
								/>Staff
							</label>
							<label className="inputRadio">
								<input 
									type="radio" 
									name="system_role" 
									value="manager" 
									checked={selectedRole === 'manager'}
									onChange={handleSelectRole}
								/>Manager
							</label>
						</div>
					</div>
					<div className="row boxBtn">
						<button className='btnSave mr20 size1' onClick={handleUpdateMember}><span>Update</span></button>
						<button className='btnDelete size1' onClick={handleOpenAlertDeleteMember}><span>Delete</span></button>
					</div>
				</div>
			</div>
			{isOverlay && <Overlay closePopup={handleCloseModal}>
				{isLoading && <Loading />}
				{isPopupError && <PopupError 
					closePopup={handleCloseModal}
					text='Failed to update member, please try agian!'
				/>}
				{isPopupEditSuccess && <PopupSuccess 
					closePopup={handleCloseModal}
					text='Member updated successfully!'
				/>}
				{isPopupAlertDelete && <PopupAlert 
					closePopup={handleCloseModal}
					title='Are you sure you want to delete this member?'
					content={
						<div className="row boxBtn">
							<button className='btnCancel mr20' onClick={handleCloseModal}><span>Cancel</span></button>
							<button className='btnDelete' onClick={handleDeleteMember}><span>Delete</span></button>
						</div>
					}
				/>}
				{isPopupDeleteSuccess && <PopupSuccess 
					closePopup={handleCloseModalDeleteSuccess}
					text='Member deleted successfully!'
				/>}
			</Overlay>}
        </DefaultLayout>
	)
}
