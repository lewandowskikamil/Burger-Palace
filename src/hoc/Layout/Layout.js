import React, { useState } from 'react';
import { connect } from 'react-redux';
import styles from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout=({children, token})=>{
    const [showSideDrawer, setShowSideDrawer]=useState(false);
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
                    isAuthed={!!token}
                />
                <SideDrawer
                    closed={closeSideDrawer}
                    open={showSideDrawer}
                    isAuthed={!!token}
                />
                <main className={styles.content}>
                    {children}
                </main>
            </>
        );
}

const mapStateToProps = ({ auth: { token } }) => ({ token });

export default connect(mapStateToProps)(Layout);