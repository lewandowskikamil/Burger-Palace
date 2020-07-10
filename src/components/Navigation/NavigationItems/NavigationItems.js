import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem'
import styles from './NavigationItems.module.css'

const NavigationItems = ({ isAuthed }) => {
    return (
        <ul className={styles.navigationItems}>
            <NavigationItem
                link='/'
                exact
            >
                Burger Builder
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
                    Logout
                </NavigationItem>
            ) : (
                    <NavigationItem
                        link='/auth'
                    >
                        Authenticate
                    </NavigationItem>
                )
            }
        </ul >
    );
}

export default NavigationItems;