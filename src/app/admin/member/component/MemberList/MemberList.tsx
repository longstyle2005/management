'use client'
import MemberCard from '~/app/admin/member/component/MemberCard/MemberCard'
import styles from './MemberList.module.scss'

export default function MemberList ( 
	{ 
        memberDataList, 
        teamDataList, 
        positionDataList, 
        onUpdateOnOffStatus,
        onUpdateProjectCurrent,
        onUpdateProjectStatus,
    } : { 
        memberDataList : any,
        teamDataList : any, 
        positionDataList : any, 
        onUpdateOnOffStatus : any,
        onUpdateProjectCurrent : any,
        onUpdateProjectStatus : any,
    }
) {
    const listCard : any = memberDataList.map((item : any) => {
        const memberData = item;
        const idTeamList = item.team;
        const dataTeam = teamDataList.filter((team : any) => idTeamList.includes(team.id));
        const idPosition = item.position;
        const dataPosition = positionDataList.find((position : any) => position.id === idPosition) || null;
        return (
            <MemberCard 
                key={item.memberId}
                memberData={memberData}
                dataTeam={dataTeam}
                dataPosition={dataPosition}
                onUpdateOnOffStatus={onUpdateOnOffStatus}
                onUpdateProjectCurrent={onUpdateProjectCurrent}
                onUpdateProjectStatus={onUpdateProjectStatus}
            />
		)
	})

  	return (
        <div className={styles.cardList}>
            {listCard}
        </div>
	)
}