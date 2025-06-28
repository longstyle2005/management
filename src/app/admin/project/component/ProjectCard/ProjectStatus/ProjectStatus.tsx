
'use client'
import { useState, useRef, useEffect } from 'react'

import styles from './ProjectStatus.module.scss'

export default function ProjectStatus ( 
	{ 
		onProjectStatus, 
		projectStatusDataList, 
		statusData, 
		situationData,
		authorCheckManager,
		authorCheckMainController,
	} : 
	{ 
		onProjectStatus : any,
		projectStatusDataList: any,
		statusData: string,
		situationData: string,
		authorCheckManager : boolean,
		authorCheckMainController : boolean,
	}
) {
	const [isOpenList, setIsOpenList] = useState(false);
	const listRef = useRef<HTMLUListElement>(null);
	const titleRef = useRef<HTMLParagraphElement>(null);
	const percenRef = useRef<HTMLSpanElement>(null);

	const handleSelectStatus = (e : any, item : any)  => {
		e.stopPropagation();
		if(authorCheckManager || authorCheckMainController){
			setIsOpenList(false);
			onProjectStatus(item.id);
			if (percenRef.current) {
				percenRef.current.textContent = item.value;
			}
		}
    }

    const handleClickTitle = (e : any) => {
		e.stopPropagation();
		if(authorCheckManager || authorCheckMainController){
			if(isOpenList){
				setIsOpenList(false);
				titleRef.current?.classList.remove('active');
			} else {
				setIsOpenList(true);
				titleRef.current?.classList.add('active');
			}
		}
	}

    const statusDefault = projectStatusDataList.find((item : any) => {
        return item.id === statusData
    });

    const listStatus = projectStatusDataList.map((item : any, index : any) => {
        return (
            <li onClick={(e) => handleSelectStatus(e, item)} key={index}>{item.value}</li>
        )
    })
    
	useEffect(() => {
		const handleOutsideClick = (e : any) => {
			e.stopPropagation();
			if (
				listRef.current && 
				!listRef.current.contains(e.target) &&
				!titleRef.current?.contains(e.target)
			) {
				setIsOpenList(false);
			}
		}
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		}
	}, []);
   
	return (
        <div className={(authorCheckManager || authorCheckMainController) ? styles.status : `${styles.status} ${styles.none}`}>
            <p 
                className={isOpenList ? `${styles.statusTitle} ${styles.active}` : styles.statusTitle} 
                onClick={handleClickTitle}
                data-situation={situationData}
				data-status={statusData}
                ref={titleRef}
            >
				<span ref={percenRef}>{statusDefault ? statusDefault.value : '0'}</span>
				<em>%</em>
			</p>
            {isOpenList && 
                <ul className={styles.statusList} ref={listRef}>
                    {listStatus}
                </ul>
            }
        </div>
	)
}