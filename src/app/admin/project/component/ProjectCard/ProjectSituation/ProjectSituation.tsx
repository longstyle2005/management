
'use client'
import { useState, useRef, useEffect } from 'react'

import styles from './ProjectSituation.module.scss'

export default function ProjectManager ( 
	{ 
        situationDataList, 
        onProjectSituation, 
        situationData, 
        classesFull, 
        authorCheckManager,
        authorCheckMainController,
    } : 
	{ 
        situationDataList : any, 
        onProjectSituation : any, 
        situationData : string, 
        classesFull : boolean,
        authorCheckManager: boolean,
        authorCheckMainController : boolean,
    }
) {
    const [isOpenList, setIsOpenList] = useState(false);
	const listRef = useRef<HTMLUListElement>(null);
	const titleRef = useRef<HTMLParagraphElement>(null);

    const handleSelectSituation = (e : any, item : any)  => {
		e.stopPropagation();
        if(authorCheckManager || authorCheckMainController){
            setIsOpenList(false);
            if (titleRef.current) {
                titleRef.current.textContent = item.name;
            }
            onProjectSituation(item.id);
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

    const situationDefault = situationDataList.find((item : any) => {
        return item.id === situationData
    });

    const listSituation = situationDataList.map((item : any, index : any) => {
        return (
            <li onClick={(e) => handleSelectSituation(e,item)} key={index}>{item.name}</li>
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
	}, [listRef]);
   
	return (
        <div className={classesFull ? `${styles.progress} ${styles.full}` : styles.progress}>
            <div className={(authorCheckManager || authorCheckMainController) ? '' : styles.none}>
                <p 
                    className={isOpenList ? `${styles.progressTitle} ${styles.active}` : styles.progressTitle} 
                    onClick={handleClickTitle}
                    data-situation={situationData}
                    ref={titleRef}
                >{situationDefault ? situationDefault.name : 'Open'}</p>
            </div>
            {isOpenList && (authorCheckManager || authorCheckMainController) && 
                <ul className={styles.progressList} ref={listRef}>
                    {listSituation}
                </ul>
            }
        </div>
	)
}