import React from 'react';
import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems';
import styles from './SideDrawer.module.css';
import Backdrop from '../../UI/Backdrop/Backdrop';
import Arrow from '../Arrow/Arrow';

const SideDrawer = ({ closed, open, isAuthed }) => {
    const attachedClasses = [styles.sideDrawer];
    if (open) attachedClasses.push(styles.open)
    else attachedClasses.push(styles.close)
    return (
        <>
            <Backdrop show={open} clicked={closed} />
            <div className={attachedClasses.join(' ')}>
                <div className={styles.arrow}>
                    <Arrow
                        clicked={closed}
                        direction='left'
                    />
                </div>
                <div className={styles.logo}>
                    <Logo />
                </div>
                <nav onClick={closed}>
                    <NavigationItems isAuthed={isAuthed} />
                </nav>
            </div>
        </>
    );
}

export default SideDrawer;