import { useRef } from 'react';
import styles from './Modal.module.scss'

export default function Modal (
	{children, onClose } : 
	{children: React.ReactNode, onClose: VoidFunction}
) {
	const modalRef = useRef(null);
	const handleCloseModal = (event : any) => {
		if (event.target && !event.target.contains(modalRef.current)) {
			onClose();
		} 
	}

  return (
    <>
		<div className={styles.overlay} onClick={handleCloseModal}></div>
		<div className={styles.modal} ref={modalRef}>
			<span className={styles.close} onClickCapture={onClose}></span>
			<div className={styles.modalContent}>
				{children}
			</div>
		</div>
    </>
  )
}