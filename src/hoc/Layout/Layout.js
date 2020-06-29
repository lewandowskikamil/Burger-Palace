import React, { Component } from 'react';
import styles from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        showSideDrawer:false,
    }
    closeSideDrawer=()=>{
        this.setState({showSideDrawer:false})
    }
    openSideDrawer=()=>{
        this.setState({showSideDrawer:true})
    }
    render() {
        const { children } = this.props;
        return (
            <>
                <Toolbar opened={this.openSideDrawer}/>
                <SideDrawer closed={this.closeSideDrawer} open={this.state.showSideDrawer}/>
                <main className={styles.content}>
                    {children}
                </main>
            </>
        );
    }
}

export default Layout;