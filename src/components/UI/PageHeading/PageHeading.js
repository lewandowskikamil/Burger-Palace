import React from 'react';
import styles from './PageHeading.module.css';

const PageHeading = ({
    children
}) => {
    return (
        <div
            className={styles.wrapper}
        >
            <h1 className={styles.pageHeading}>
                {children}
            </h1>
        </div>
    );
}

export default PageHeading;