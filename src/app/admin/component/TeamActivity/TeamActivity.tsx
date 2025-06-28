import { useRef } from 'react';
import styles from './TeamActivity.module.scss'

export default function TeamActivity (
    {
        backendDataList,
        frontendDataList,
        itcDataList,
        testerDataList,
    } : 
    {
        backendDataList : any,
        frontendDataList : any,
        itcDataList : any,
        testerDataList : any,
    }
) {

    const backendMembers = backendDataList.filter((member : any) => member.off === false);
    const frontendMembers = frontendDataList.filter((member : any) => member.off === false);
    const itcMembers = itcDataList.filter((member : any) => member.off === false);
    const testerMembers = testerDataList.filter((member : any) => member.off === false);

    const backendPercent = Math.round( ((backendMembers.reduce((accumulator : number , item : any) => accumulator + Number(item.status) + 1, 0)) / (backendMembers.length) * (100 / 6)) );
    const frontendPercent = Math.round( ((frontendMembers.reduce((accumulator : number , item : any) => accumulator + Number(item.status) + 1, 0)) / (frontendMembers.length) * (100 / 6)) );
    const itcPercent = Math.round( ((itcMembers.reduce((accumulator : number , item : any) => accumulator + Number(item.status) + 1, 0)) / (itcMembers.length) * (100 / 6)) );
    const testerPercent = Math.round( ((testerMembers.reduce((accumulator : number , item : any) => accumulator + Number(item.status) + 1, 0)) / (testerMembers.length) * (100 / 6)) );


return (
    <div className={styles.wrap}>
        <h2 className='headline3'>Team Activity</h2>
        <div className={styles.list}>
            <div className={styles.team}>
                <div className={styles.head}>
                    <p className={styles.ttl1}>Backend</p>
                </div>
                <ul className={styles.barList}>
                    <li className={styles.bar} style={{ width: `${backendPercent ? backendPercent : '0'}%` }}>
                        <span className={styles.percent}>{backendPercent ? backendPercent : '0'}%</span>
                    </li>
                </ul>
            </div>
            <div className={styles.team}>
                <div className={styles.head}>
                    <p className={styles.ttl1}>Frontend</p>
                </div>
                <ul className={styles.barList}>
                    <li className={styles.bar} style={{ width: `${frontendPercent ? frontendPercent : '0'}%` }}>
                        <span className={styles.percent}>{frontendPercent ? frontendPercent : '0'}%</span>
                    </li>
                </ul>
            </div>
            <div className={styles.team}>
                <div className={styles.head}>
                    <p className={styles.ttl1}>ITC</p>
                </div>
                <ul className={styles.barList}>
                    <li className={styles.bar} style={{ width: `${itcPercent ? itcPercent : '0'}%` }}>
                        <span className={styles.percent}>{itcPercent ? itcPercent : '0'}%</span>
                    </li>
                </ul>
            </div>
            <div className={styles.team}>
                <div className={styles.head}>
                    <p className={styles.ttl1}>Tester</p>
                </div>
                <ul className={styles.barList}>
                    <li className={styles.bar} style={{ width: `${testerPercent ? testerPercent : '0'}%` }}>
                        <span className={styles.percent}>{testerPercent ? testerPercent : '0'}%</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
)}