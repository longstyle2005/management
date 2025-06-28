
'use client'
import ProjectMemberStatusItem from '~/app/admin/project/component/ProjectCard/ProjectMemberStatus/ProjectMemberStatusItem/ProjectMemberStatusItem'

import styles from './ProjectMemberStatusList.module.scss'


export default function ProjectMemberStatusList ( 
	{ dataMemberFillter, onUpdateMemberStatus} : 
	{ dataMemberFillter : any, onUpdateMemberStatus : any}
) {

	const listMemberRender : any = dataMemberFillter.map((memberItem : any, index : number) => {
		return (
			<ProjectMemberStatusItem 
				key={index}
				memberData={memberItem}
				onUpdateMemberStatus={onUpdateMemberStatus}
			/>
		)
	})

	return (
        <ul className={styles.wrap}>
			{listMemberRender}
        </ul>
	)
}