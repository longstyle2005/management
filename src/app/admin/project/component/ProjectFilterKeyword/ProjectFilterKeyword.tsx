'use client'
import { useRef } from 'react';
import styles from './ProjectFilterKeyword.module.scss'

export default function ProjectFilterKeyword ( 
	{ 	
		onInputProjectFilterKeyword,
        onProjectFilterKeyword,
        onResetProjectFilterKeyword,
	} : { 
		onInputProjectFilterKeyword: any,
        onProjectFilterKeyword:any,
        onResetProjectFilterKeyword: any,
	}
) {
	const inputSearchRef = useRef<HTMLInputElement>(null);
	const buttonClearSearchRef = useRef<HTMLButtonElement>(null);

    const handleProjectSearchInput = ( e : any) => {
		const inputValue = e.target.value.trim();
		if(inputValue){
			buttonClearSearchRef.current?.classList.add('show');
			onInputProjectFilterKeyword(inputValue)
		}
	}

	const handleResetProjectFilter = () => {
		buttonClearSearchRef.current?.classList.remove('show');
		if (inputSearchRef.current) {
			inputSearchRef.current.value = '';
			inputSearchRef.current.focus();
		}
        onResetProjectFilterKeyword();
	};

  	return (
		<div className={`${styles.wrap} searchFilter`}>
            <input 
                className='inputSearch' ref={inputSearchRef}
                type="text" placeholder='Project name...' 
                onChange={handleProjectSearchInput}
            />
            <button className='buttonClear' onClick={handleResetProjectFilter} ref={buttonClearSearchRef}></button>
            <button className='buttonSearch' onClick={onProjectFilterKeyword}></button>
        </div>
	)
}