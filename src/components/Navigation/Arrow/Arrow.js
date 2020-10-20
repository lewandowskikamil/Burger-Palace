import React from 'react';
import styles from './Arrow.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import icons from '../../../shared/icons';

const Arrow = ({ clicked, color, direction }) => {
    return (
        <div
            style={{
                color
            }}
            onClick={clicked}
            className={styles.arrow}
        >
            <FontAwesomeIcon
                icon={icons[`faArrow${direction}`]}
            />
        </div>
    )
}

export default Arrow;