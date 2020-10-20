import React, { useState } from 'react';
import { connect } from 'react-redux';
import styles from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = ({ children, isAuthed, userRole }) => {
    const [isSideDrawerShowed, setIsSideDrawerShowed] = useState(false);
    return (
        <>

            <Toolbar
                open={() => setIsSideDrawerShowed(true)}
                isAuthed={isAuthed}
                userRole={userRole}
            />
            <SideDrawer
                close={() => setIsSideDrawerShowed(false)}
                isShowed={isSideDrawerShowed}
                isAuthed={isAuthed}
                userRole={userRole}
            />
            <main className={styles.content}>
                {children}
            </main>
        </>
    );
}

const mapStateToProps = ({
    firebase: {
        auth: { uid },
        profile: { role }
    }
}) => ({
    isAuthed: !!uid,
    userRole: role
});

export default connect(mapStateToProps)(Layout);