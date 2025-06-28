'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './ProjectFilterSituation.module.scss'

export default function ProjectFilterSituation ( 
	{ 	
		idSituationSelected,
		projectSituationData,
		onResetFilterSituation,
		onProjectFilterSituation,
	} : { 
		idSituationSelected: string,
		projectSituationData: any,
		onResetFilterSituation: any,
		onProjectFilterSituation: any,
	}
) {
    const titleRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [isShowList, setIsShowList] = useState(false);

	const handleClickTitle = (e : any) => {
        e.stopPropagation();
        setIsShowList(!isShowList);
    };

    const handleClickItem = (e: React.MouseEvent<HTMLLIElement>, situationName : any, situationId : string) => {
        const targetEle = e.target as HTMLElement;
        if(titleRef.current){
            titleRef.current.textContent = targetEle.textContent;
        }
        setIsShowList(false);
        if(situationId === 'situation_all'){
            onResetFilterSituation();
        } else {
            onProjectFilterSituation(situationId);
        }
    };

    const situationList = projectSituationData.map((situation : any, index : number) => {
        return (
            <li 
                key={index} 
                className={`${styles.item} ${idSituationSelected === situation.id ? styles.active : ''}`}
                onClick={(e) => handleClickItem(e, situation.name, situation.id)}
            >
                {situation.name}
            </li>
        )
    });

    useEffect(() => {
		const handleOutsideClick = (e : any) => {
			e.stopPropagation();
			if (
				listRef.current && 
				!listRef.current.contains(e.target) &&
				!titleRef.current?.contains(e.target)
			) {
				setIsShowList(false);
			}
		}
		document.addEventListener('mousedown', handleOutsideClick);
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick);
		}
	}, []);

  	return (
		<div className={styles.wrap}>
            <div 
                className={isShowList ? `${styles.ttl} ${styles.active}` : styles.ttl} 
                onClick={handleClickTitle} ref={titleRef}
            >
                All Situation
            </div>
            {isShowList && <ul className={styles.list} ref={listRef}>
                {situationList}
            </ul>}
		</div>
	)
}