import { useRef } from 'react';
import styles from './ProjectStatistics.module.scss'

export default function ProjectStatistics (
    {
        projectDataList,
    } : 
    {
        projectDataList:any,
    }
) {
    const openList = projectDataList.filter((project : any) => project.situation.includes('situation_01'));
    const inProgressList = projectDataList.filter((project : any) => project.situation.includes('situation_02'));
    const urgentList = projectDataList.filter((project : any) => project.situation.includes('situation_03'));
    const deployingList = projectDataList.filter((project : any) => project.situation.includes('situation_04'));
    const releasingList = projectDataList.filter((project : any) => project.situation.includes('situation_05'));
    const closeList = projectDataList.filter((project : any) => project.situation.includes('situation_05'));
    const stopList = projectDataList.filter((project : any) => project.situation.includes('situation_06'));

return (
    <div className={styles.wrap}>
        <h2 className='headline3'>Project Statistics</h2>
        <ul className={styles.statistics}>
            <li>
                <span className={styles.ttl}>Total</span>
                <span className={styles.num}>{projectDataList.length}</span>
            </li>
            <li>
                <span className={styles.ttl}>Open</span>
                <span className={styles.num}>{openList.length}</span>
            </li>
            <li>
                <span className={styles.ttl}>In Progress</span>
                <span className={styles.num}>{inProgressList.length}</span>
            </li>
            <li>
                <span className={styles.ttl}>Urgent</span>
                <span className={styles.num}>{urgentList.length}</span>
            </li>
            <li>
                <span className={styles.ttl}>Deploying</span>
                <span className={styles.num}>{deployingList.length}</span>
            </li>
            <li>
                <span className={styles.ttl}>Releasing</span>
                <span className={styles.num}>{releasingList.length}</span>
            </li>
            <li>
                <span className={styles.ttl}>Stop</span>
                <span className={styles.num}>{closeList.length}</span>
            </li>
            <li>
                <span className={styles.ttl}>Close</span>
                <span className={styles.num}>{stopList.length}</span>
            </li>
        </ul>


        
    </div>
)}