import React from 'react';
import styles from './NavigationItem.module.css';

const NavigationItem = ({ children, link, active }) => {
    return (
        <li className={styles.navigationItem}>
            <a
                href={link}
                className={active ? styles.active : null}
            >
                {children}
            </a>
        </li>
    );
}

export default NavigationItem;