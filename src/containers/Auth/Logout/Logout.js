import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions'
import { Redirect } from 'react-router-dom';

const Logout = ({ onLogout }) => {

    useEffect(() => {
        onLogout()
    }, [onLogout])
    
    return <Redirect to='/' />;
}

const mapDispatchToProps = dispatch => ({
    onLogout: () => dispatch(actions.logout())
})

export default connect(null, mapDispatchToProps)(Logout);