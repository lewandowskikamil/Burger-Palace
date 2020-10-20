import React from 'react';
import styles from './Spinner.module.css';

const Spinner = ({
    withWrapper,
    withFullPageWrapper,
    large
}) => {
    const spinnerClasses = [styles.spinner];
    if (large) spinnerClasses.push(styles.large)
    const spinner = (
        <div className={spinnerClasses.join(' ')}>
            <div className={styles.cube}></div>
            <div className={styles.cube}></div>
            <div className={styles.cube}></div>
            <div className={styles.cube}></div>
        </div>
    )
    if (withWrapper) return (
        <div className={styles.wrapper}>
            {spinner}
        </div>
    );
    if (withFullPageWrapper) return (
        <div
            className={styles.fullPageWrapper}
        >
            {spinner}
        </div>
    );
    return spinner;
}

export default Spinner;