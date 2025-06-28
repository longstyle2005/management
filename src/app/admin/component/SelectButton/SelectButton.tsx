'use client'
import { useState, useEffect, useRef } from 'react'
import styles from './SelectButton.module.scss'

export default function SelectButton ( 
	{ dataList } : 
	{ dataList : any}
) {
    const titleRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const [isShowList, setIsShowList] = useState(false);

    const firstItem = dataList[0];

    const handleClickItem = (e : any) => {
        if(titleRef.current){
            titleRef.current.textContent = e.target.textContent;
        }
        setIsShowList(false);
    };

    const handleClickTitle = (e : any) => {
        e.stopPropagation();
        setIsShowList(!isShowList);
    };

    const teamList = dataList.map((item : any, index : number) => {
        return (
            <li key={index} className={styles.item} onClick={handleClickItem}>{item}</li>
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
	}, [listRef]);

  	return (
		<div className={styles.wrap}>
            <div className={isShowList ? `${styles.ttl} ${styles.active}` : styles.ttl} onClickCapture={handleClickTitle} ref={titleRef}>{firstItem}</div>
            {isShowList && <ul className={styles.list} ref={listRef}>
                {teamList}
            </ul>}
		</div>
	)
}