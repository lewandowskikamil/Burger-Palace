import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem'
import styles from './NavigationItems.module.css'

const NavigationItems = ({ isAuthed }) => {
    return (
        <ul className={styles.navigationItems}>
            <NavigationItem
                link='/about'
            >
                About
            </NavigationItem>
            <NavigationItem
                link='/menu'
            >
                Menu
            </NavigationItem>
            <NavigationItem
                link='/'
                exact
            >
                Burger Builder
            </NavigationItem>
            <NavigationItem
                link='/cart'
            >
                <span className="fa fa-shopping-cart" style={{fontSize:'26px'}}></span>
            </NavigationItem>
            {isAuthed ? (
                <NavigationItem
                    link='/orders'
                >
                    Orders
                </NavigationItem>
            ) : null
            }
            {isAuthed ? (
                <NavigationItem
                    link='/logout'
                >
                    Sign Out
                </NavigationItem>
            ) : (
                    <NavigationItem
                        link='/auth'
                    >
                        Sign In
                    </NavigationItem>
                )
            }
        </ul >
    );
}

export default NavigationItems;