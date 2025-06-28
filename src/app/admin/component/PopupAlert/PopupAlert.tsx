'use client'
import styles from './PopupAlert.module.scss'

export default function PopupAlert (
    {closePopup, title, content} : 
    {closePopup : any, title : string, content : React.ReactNode}
) {

    const handleClosePopup = () => {
        closePopup();
    }

    const handleClickContent = (e : any) => {
        e.stopPropagation();
    }

  	return (
        <div className={styles.popup} onClick={handleClickContent}>
            <span className={styles.closeBtn} onClick={handleClosePopup}></span>
            <div className={styles.popupContent}>
                <p className={styles.title}>{title}</p>
                <div className={styles.block}>
                    {content}
                </div>
            </div>
        </div>
	)
}