'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './MemberFilterTeam.module.scss'

export default function MemberFilterTeam ( 
	{ 
        idTeamSelected,
        teamDataList,
        onMemberFilterTeam,
        onResetMemberFilterTeam,

    } : { 
        idTeamSelected: string,
        teamDataList: any,
        onMemberFilterTeam: any,
        onResetMemberFilterTeam: any,
    }
) {
    const titleRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [isShowList, setIsShowList] = useState(false);

    const handleClickTitle = (e : any) => {
        e.stopPropagation();
        setIsShowList(!isShowList);
    };

    const handleClickItem = (e: React.MouseEvent<HTMLLIElement>, teamName : any, teamId : string) => {
        const targetEle = e.target as HTMLElement;
        if(titleRef.current){
            titleRef.current.textContent = targetEle.textContent;
        }
        setIsShowList(false);
        if(teamId === 'team_all'){
            onResetMemberFilterTeam();
        } else {
            onMemberFilterTeam(teamId);
        }
    };

    const teamList = teamDataList.map((team : any, index : number) => {
        return (
            <li 
                key={index} 
                className={`${styles.item} ${idTeamSelected === team.id ? styles.active : ''}`}
                onClick={(e) => handleClickItem(e, team.name, team.id)}
            >
                {team.name}
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
                All Teams
            </div>
            {isShowList && <ul className={styles.list} ref={listRef}>
                {teamList}
            </ul>}
		</div>
	)
}