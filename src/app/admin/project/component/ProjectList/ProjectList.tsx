'use client'
import ProjectCard from '~/app/admin/project/component/ProjectCard/ProjectCard'
import styles from './ProjectList.module.scss'

export default function ProjectList ( 
	{ 
        projectList, 
        onUpdateStatusProject,
        onUpdateMemberStatus,
    } : 
	{   projectList : any,
        onUpdateStatusProject: any,
        onUpdateMemberStatus : any,
    }
) {
    const listProject : any = projectList.map((project : any) => {
        return (
            <ProjectCard 
                key={project.projectId}
                projectData={project}
                onUpdateStatusProject={onUpdateStatusProject}   
                onUpdateMemberStatus={onUpdateMemberStatus}
            />
		)
	})

  	return (
        <div className={styles.cardList}>
            {listProject}
        </div>
	)
}