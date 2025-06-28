'use client'
import { useRef, useEffect } from 'react';
import styles from './MemberFilterKeyword.module.scss'

export default function MemberFilterKeyword ( 
	{ 	
		onInputKeywordNickname,
        onMemberFilterNickname,
        onResetMemberFilter,
	} : { 
		onInputKeywordNickname: any,
        onMemberFilterNickname: any,
        onResetMemberFilter: any,
	}
) {
	const inputSearchRef = useRef<HTMLInputElement>(null);
	const buttonClearSearchRef = useRef<HTMLButtonElement>(null);

    const handleMemberSearchInput = ( e : any) => {
		const inputValue = e.target.value.trim().toLowerCase();
		if(inputValue){
			buttonClearSearchRef.current?.classList.add('show');
			onInputKeywordNickname(inputValue)
		}
	}

	const handleResetMemberFilter = () => {
		buttonClearSearchRef.current?.classList.remove('show');
		if (inputSearchRef.current) {
			inputSearchRef.current.value = '';
			inputSearchRef.current.focus();
		}
        onResetMemberFilter();
	};

  	return (
		<div className={`${styles.wrap} searchFilter`}>
            <input 
                className='inputSearch' ref={inputSearchRef}
                type="text" placeholder='Name...' 
                onChange={handleMemberSearchInput}
            />
            <button className='buttonClear' onClick={handleResetMemberFilter} ref={buttonClearSearchRef}></button>
            <button className='buttonSearch' onClick={onMemberFilterNickname}></button>
        </div>
	)
}