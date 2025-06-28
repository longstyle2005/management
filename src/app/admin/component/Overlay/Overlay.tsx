import styles from './Overlay.module.scss'

export default function Overlay (
    { children, closePopup } : 
    { children : any, closePopup : any }
) {

	const handleClosePopup = (e : any) => {
        e.stopPropagation();
        closePopup();
    }

return (
	<div className={styles.overlay} onClick={handleClosePopup}>
		{children}
	</div>
)}