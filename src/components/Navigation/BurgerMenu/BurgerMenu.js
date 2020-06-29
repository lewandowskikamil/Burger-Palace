import React from 'react';
import styles from './BurgerMenu.module.css';
import PropTypes from 'prop-types';

const BurgerMenu = ({ clicked, color, bgColor }) => {
    return (
        <div
            style={{
                color,
                backgroundColor: bgColor
            }}
            onClick={clicked}
            className={styles.burgerMenu}
        >
            <span
                className="fa fa-bars icon"
            ></span>
        </div>
    )
}
BurgerMenu.propTypes={
    color:PropTypes.string,
    bgColor:PropTypes.string,
    clicked:PropTypes.func.isRequired,
}
export default BurgerMenu;