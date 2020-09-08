import React, { useState } from 'react';
import { connect } from 'react-redux';
import styles from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = ({ children, isAuthed }) => {
    const [showSideDrawer, setShowSideDrawer] = useState(false);
    const closeSideDrawer = () => {
        setShowSideDrawer(false)
    }
    const openSideDrawer = () => {
        setShowSideDrawer(true)
    }
    return (
        <>
            <Toolbar
                opened={openSideDrawer}
                isAuthed={isAuthed}
            />
            <SideDrawer
                closed={closeSideDrawer}
                open={showSideDrawer}
                isAuthed={isAuthed}
            />
            <main className={styles.content}>
                {children}
            </main>
        </>
    );
}

const mapStateToProps = ({ firebase: { auth } }) => ({ isAuthed: !!auth.uid });

export default connect(mapStateToProps)(Layout);