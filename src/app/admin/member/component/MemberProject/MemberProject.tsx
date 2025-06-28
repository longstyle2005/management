'use client'
import Select from "react-select";
import styles from './MemberProject.module.scss'

export default function MemberProject ( 
	{ 	
		memberId,
		projectDataListOfMember, 
		projectCurrentDataOfMember,
		onMemberProjectCurrent, 
		authorCheckOwner
	} : { 
		memberId: string,
		projectDataListOfMember : any, 
		projectCurrentDataOfMember: any,
		onMemberProjectCurrent : any, 
		authorCheckOwner : boolean
	}
) {

	const handleSelectProject = (projectRole : any) => {
		if(authorCheckOwner){
			onMemberProjectCurrent({
				memberId,
				projectRoleId : projectRole._id,
			});
		}
	}

	let renderProjectList;
	if(projectDataListOfMember.length > 0){
		renderProjectList = <Select 
			instanceId={memberId}
			className='select-cmn-1 member-project'
			classNamePrefix="select-cmn-1"
			options={projectDataListOfMember}
			getOptionLabel={(option : any) => option.project.name}
			getOptionValue={(option : any) => option.projectId.toString()}
			value={projectCurrentDataOfMember}
			onChange={handleSelectProject}
			placeholder="Chọn dự án"
			menuPlacement="auto" 
			menuShouldScrollIntoView={true}
			// menuIsOpen={true} // Debug menu open
		/>
	} else {
		renderProjectList = <p className={styles.projectEmpty}>Chưa có dự án</p>
	}

  	return (
		<div className={authorCheckOwner ? styles.project : `${styles.project} ${styles.none}`}>
			{renderProjectList}
		</div>
	)
}