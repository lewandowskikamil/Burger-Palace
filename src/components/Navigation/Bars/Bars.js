import React from 'react';
import styles from './Bars.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../shared/icons';

const Bars = ({ clicked, color, bgColor }) => {
    return (
        <div
            style={{
                color,
                backgroundColor: bgColor
            }}
            onClick={clicked}
            className={styles.burgerMenu}
        >
            <FontAwesomeIcon
                icon={icons.faBars}
            />
        </div>
    )
}

export default Bars;