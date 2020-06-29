import React from 'react';
import styles from './Arrow.module.css';
import PropTypes from 'prop-types';

const Arrow = ({ clicked, color, direction }) => {
    return (
        <div
            style={{
                color
            }}
            onClick={clicked}
            className={styles.arrow}
        >
            <span
                className={`fa fa-arrow-${direction} icon`}
            ></span>
        </div>
    )
}
Arrow.propTypes = {
    color: PropTypes.string,
    direction: PropTypes.oneOf(['left', 'right']).isRequired,
    clicked: PropTypes.func.isRequired,
}
export default Arrow;