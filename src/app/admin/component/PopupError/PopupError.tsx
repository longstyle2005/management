'use client'
import styles from './PopupError.module.scss'

export default function PopupError (
    {closePopup, text} : 
    {closePopup : any, text : string}
) {

    const handleClosePopup = () => {
        closePopup();
    }

    const handleClickContent = (e : any) => {
        e.stopPropagation();
    }

  	return (
        <div className={styles.popup} onClick={handleClickContent}>
            <span className={styles.closeBtn} onClickCapture={handleClosePopup}></span>
            <div className={styles.popupContent}>
                <p className={styles.text}>{text}</p>
            </div>
        </div>
	)
}