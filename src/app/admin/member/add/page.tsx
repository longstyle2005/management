"use client";
import { useState, useRef, useEffect, Suspense } from 'react';
import Select from "react-select";
import styles from './page.module.scss';
import Image from 'next/image';
import DefaultLayout from '~/app/admin/layout/DefaultLayout';
import HeadPageSecond from '~/app/admin/component/HeadPageSecond/HeadPageSecond';
import SelectTag from '~/app/admin/component/SelectTag/SelectTag';
import Overlay from '~/app/admin/component/Overlay/Overlay';
import Loading from '~/app/admin/component/Loading/Loading';
import PopupError from '~/app/admin/component/PopupError/PopupError';
import PopupSuccess from '~/app/admin/component/PopupSuccess/PopupSuccess';
import { AVATAR_DEMO } from '~/app/constant/image/avatarDemo';

import validationAvatar from '~/app/utils/validation/validationAvatar.mjs'
import validationNickname from '~/app/utils/validation/validationNickname.mjs'
import validationEmail from '~/app/utils/validation/validationEmail.mjs'
import convertToBase64 from '~/app/utils/convert/convertToBase64.mjs';
import axios from 'axios';
import teamDataList from '~/data/teams.json';
import positionDataList from '~/data/positions.json';
import { Member } from '~/app/utils/interfaces/member.interface';


export default function AddMemberPage () {
	const [isOverlay, setIsOverlay] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isPopupError, setIsPopupError] = useState(false);
	const [isPopupSuccess, setIsPopupSuccess] = useState(false);
	const [isErrorSelectTeam, setIsErrorSelectTeam] = useState(false);

    const imageAvatarRef = useRef<HTMLElement>(null);
	const errorAvatarRef = useRef<HTMLParagraphElement>(null);
    const errorNicknameRef = useRef<HTMLParagraphElement>(null);
    const inputNicknameRef = useRef<HTMLInputElement>(null);
    const errorEmailRef = useRef<HTMLParagraphElement>(null);
    const inputEmailRef = useRef<HTMLInputElement>(null);

	const [fileAvatar, setFileAvatar] = useState<any>('');
	const [selectedTeam, setSelectedTeam] = useState([]); 
	const [selectedPosition, setSelectedPosition] = useState(positionDataList[0].id);
	const [selectedRole, setSelectedRole] = useState<string>('staff');

	const [member, setMember] = useState<Member>({
		avatar: '',
		nickname: '',
		email: '',
		team: [],
		position: positionDataList[0].id,
		off: false,
		role: selectedRole,
	});

	const handleChangeAvatar = (event : any) => {
		const file = event.target.files[0];
		if(file){
            setFileAvatar(file);
			if(validationAvatar(file, imageAvatarRef.current, errorAvatarRef.current)){
				file.preview = URL.createObjectURL(file);
			}
		}
	}

	useEffect(()=>{
		return () => {
			fileAvatar && URL.revokeObjectURL(fileAvatar.preview)
		}
	},[fileAvatar]);

	const handleGetNickname = (event : any) => {
		setMember(prevMember => ({
			...prevMember,
			nickname: event.target.value
		}));
    }

	const handleValidationNickname = (event : any) => {
		validationNickname(event.target.value, inputNicknameRef.current, errorNicknameRef.current);
	}
	
	const handleGetMemberEmail = (event : any) => {
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

	const addMemberData = async () => {
		setIsLoading(true);
		setIsOverlay(true);
		try {
            member.avatar = await convertToBase64(fileAvatar);
            const response = await axios.post('/api/members/createMember', member)
            console.log("Member document uploaded successfully!");
            setIsLoading(false);
            setIsPopupSuccess(true);
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
                console.log('Failed to create Member');
                setIsPopupError(true);
            }
        }
	}

	const handleAddMember = () => {
		const avatarCheck = validationAvatar(fileAvatar, imageAvatarRef.current, errorAvatarRef.current);
		if (!avatarCheck){
			console.log('There is an error in the nick avatar field.')
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

		if(nicknameCheck && emailCheck && (selectedTeam.length >= 0)){
			addMemberData();
		}
	};

	const handleCloseModal = () => {
		setIsOverlay(false);
		setIsLoading(false);
		setIsPopupError(false);
		setIsPopupSuccess(false);
		
		setFileAvatar('');
		setSelectedTeam([]);
		setSelectedPosition(teamDataList[0].id);
		setSelectedRole('staff');
		setMember(prevMember => ({
			...prevMember,
			avatar: '',
			nickname: '',
			email: '',
			team: [],
			position: positionDataList[0].id,
			role: 'staff',
		}));
	}

  	return (
		<Suspense>
			<DefaultLayout>
				<HeadPageSecond title='Add member' >
					<ul className='breadcrumb'>
						<li><a href="/admin/member/">Members</a></li>
						<li><span>Add member</span></li>
					</ul>
				</HeadPageSecond>
				<div className={`${styles.wrap} wrapPage`}>
					<div className="formCmn1">
						<div className="row boxAvatar">
							<label htmlFor="memberAvatar" className="fileAvatar">
								<span className='iconCamera'></span>
								<figure className="image" ref={imageAvatarRef}>
									<Image width={0} height={0} alt='' src={fileAvatar ? fileAvatar.preview : AVATAR_DEMO} />
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
									value={member.nickname}
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
									onChange={handleGetMemberEmail}
									onBlur={handleValidationEmail}
									value={member.email}
								/>
								<p className="txtError" ref={errorEmailRef}></p>
							</div>
						</div>
						<div className="row">
							<p className="fieldTitle">Team</p>
							<div className="fieldBox">
								<Select
									instanceId="select-create-member"
									className={isErrorSelectTeam ? 'select-cmn error' : 'select-cmn'}
									classNamePrefix="select-cmn"
									isMulti
									options={teamDataList}
									getOptionLabel={(option : any) => option.name}
									getOptionValue={(option : any) => option.id.toString()}
									value={selectedTeam}
									onChange={handleSelectTeam}
									isOptionDisabled={() => selectedTeam.length >= 2}
									closeMenuOnSelect={false}
									placeholder="..."
									menuPlacement="auto" 
									menuShouldScrollIntoView={true}
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
										defaultChecked={true}
										onChange={handleSelectRole}
									/>Staff
								</label>
								<label className="inputRadio">
									<input 
										type="radio" 
										name="system_role" 
										value="manager" 
										onChange={handleSelectRole}
									/>Manager
								</label>
							</div>
						</div>
						<div className="row boxBtn">
							<button className='btnSave' onClick={handleAddMember}><span>Save</span></button>
						</div>
					</div>
				</div>
				{isOverlay && <Overlay closePopup={handleCloseModal}>
					{isLoading && <Loading />}
					{isPopupError && <PopupError 
						closePopup={handleCloseModal}
						text='Failed to add member, please try again!'
					/>}
					{isPopupSuccess && <PopupSuccess 
						closePopup={handleCloseModal}
						text='Member added successfully!'
					/>}
				</Overlay>}
			</DefaultLayout>
		</Suspense>
	)
}
