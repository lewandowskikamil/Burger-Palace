import React from 'react';
import styles from './Toolbar.module.css';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import BurgerMenu from '../BurgerMenu/BurgerMenu';
const Toolbar = ({ opened, isAuthed }) => {
    return (
        <header className={styles.toolbar}>
            <BurgerMenu
                color='white'
                clicked={opened}
            />
            <div className={styles.logo}>
                <Logo />
            </div>
            <nav>
                <NavigationItems isAuthed={isAuthed} />
            </nav>
        </header>
    );
}

export default Toolbar;