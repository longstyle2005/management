'use client'
import styles from './ErrorModal.module.scss'

export default function ErrorModal (
    { onCloseModalError, infoText } :
    { onCloseModalError: any, infoText: string}
) {

    const handleCloseModal = () => {
        onCloseModalError();
    }

  	return (
        <div className={styles.modalError}>
            <span className={styles.closeBtn} onClickCapture={handleCloseModal}></span>
            <div className={styles.modalContent}>
                <p className="txtErrorInfo">{infoText}</p>
            </div>
        </div>
	)
}