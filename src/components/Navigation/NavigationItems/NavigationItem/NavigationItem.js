import React from 'react';
import styles from './NavigationItem.module.css';
import { NavLink } from 'react-router-dom';

const NavigationItem = ({ children, link, exact }) => {
    return (
        <li className={styles.navigationItem}>
            <NavLink to={link} exact={exact} activeClassName={styles.active}>
                {children}
            </NavLink>
        </li>
    );
}

export default NavigationItem;