import React, { useState } from 'react';
import styles from './NavigationItems.module.css';
import { NavLink } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const NavigationItems = ({ isAuthed, userRole, clicked, mobile }) => {

    const { pathname: prevPath } = useLocation();
    const [waveCenter, setWaveCenter] = useState({ left: 0, top: 0 });
    const navItemClickHandler = e => {
        const left = e.clientX;
        const top = e.clientY - e.target.parentNode.getBoundingClientRect().top;
        setWaveCenter({ left, top });
        clicked();
    }
    let navItemsData = [
        {
            label: 'About',
            data: { to: '/', exact:true }
        },
        {
            label: 'Menu',
            data: { to: '/menu' }
        },
        {
            label: 'Burger Builder',
            data: { to: '/builder' }
        },
        {
            label: 'Sign In',
            data: {
                to: { pathname: '/auth', state: { prevPath } }
            }
        }
    ]
    if (isAuthed) {
        navItemsData.pop();
        navItemsData = navItemsData.concat([
            {
                label: 'Cart',
                data: { to: '/cart' }
            },
            {
                label: 'Orders',
                data: { to: '/orders' }
            },
            {
                label: 'Sign Out',
                data: {
                    to: { pathname: '/signout', state: { prevPath } }
                }
            }
        ])
    }
    if (isAuthed && ['admin', 'super admin'].includes(userRole)) {
        navItemsData.push({
            label: 'Admin',
            data: { to: '/admin' }
        })
    }
    const navItems = navItemsData.map(({ label, data }) => (
        <li
            className={styles.navigationItem}
            key={label}
        >
            <NavLink
                {...data}
                activeClassName={styles.active}
                onClick={mobile ? navItemClickHandler : () => { }}
            >
                {label}
            </NavLink>
            {mobile && <span
                style={{
                    left: `${waveCenter.left}px`,
                    top: `${waveCenter.top}px`
                }}
            ></span>}
        </li>
    ))
    return (
        <ul className={styles.navigationItems}>
            {navItems}
        </ul>
    )
}

export default NavigationItems;