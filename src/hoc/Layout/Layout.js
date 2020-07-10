import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends Component {
    state = {
        showSideDrawer: false,
    }
    closeSideDrawer = () => {
        this.setState({ showSideDrawer: false })
    }
    openSideDrawer = () => {
        this.setState({ showSideDrawer: true })
    }
    render() {
        const { children } = this.props;
        return (
            <>
                <Toolbar
                    opened={this.openSideDrawer}
                    isAuthed={!!this.props.token}
                />
                <SideDrawer
                    closed={this.closeSideDrawer}
                    open={this.state.showSideDrawer}
                    isAuthed={!!this.props.token}
                />
                <main className={styles.content}>
                    {children}
                </main>
            </>
        );
    }
}

const mapStateToProps = ({ auth: { token } }) => ({ token });

export default connect(mapStateToProps)(Layout);