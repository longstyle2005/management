'use client'
import styles from './Loading.module.scss'

export default function Loading () {

  	return (
        <div className={styles.loadingBox}>
            <svg className={styles.svg} version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 100 100">
                <circle fill="#f3f3f3" stroke="none" cx="25" cy="50" r="6">
                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1" />
                </circle>
                <circle fill="#f3f3f3" stroke="none" cx="45" cy="50" r="6">
                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                </circle>
                <circle fill="#f3f3f3" stroke="none" cx="65" cy="50" r="6">
                    <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3" />
                </circle>
            </svg>
        </div>
	)
}