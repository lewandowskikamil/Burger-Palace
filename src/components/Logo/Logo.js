import React from 'react';
import logo from '../../assets/images/burgerLogo.png';
import styles from './Logo.module.css';
const Logo = () => {
    return ( 
        <div className={styles.logo}>
            <img src={logo} alt="myburger"/>
        </div>
     );
}
 
export default Logo;