import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem'
import styles from './NavigationItems.module.css'
import { useLocation } from 'react-router-dom';

const NavigationItems = ({ isAuthed }) => {
    const { pathname: prevPath } = useLocation();
    let navItems = (
        <>
            <NavigationItem to='/about'>About</NavigationItem>
            <NavigationItem to='/menu'>Menu</NavigationItem>
            <NavigationItem to='/' exact>Burger Builder</NavigationItem>
            <NavigationItem to={{ pathname: '/auth', state: { prevPath } }}>Sign In</NavigationItem>

        </>
    );
    if (isAuthed) navItems = (
        <>
            <NavigationItem to='/about'>About</NavigationItem>
            <NavigationItem to='/menu'>Menu</NavigationItem>
            <NavigationItem to='/' exact>Burger Builder</NavigationItem>
            <NavigationItem to='/cart'>
                <span className="fa fa-shopping-cart" style={{ fontSize: '26px' }}></span>
            </NavigationItem>
            <NavigationItem to='/orders'>Orders</NavigationItem>
            <NavigationItem to={{ pathname: '/signout', state: { prevPath } }}>Sign Out</NavigationItem>
        </>
    );

    return (
        <ul className={styles.navigationItems}>
            {navItems}
        </ul >
    );
}

export default NavigationItems;