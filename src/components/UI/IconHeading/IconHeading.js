import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './IconHeading.module.css';

const IconHeading = ({ icon }) => {
    return (
        <h2 className={styles.iconHeading}>
            <FontAwesomeIcon
                icon={icon}
            />
        </h2>
    );
}

export default IconHeading;