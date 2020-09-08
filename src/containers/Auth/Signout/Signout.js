import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions'
import { Redirect } from 'react-router-dom';

const Signout = ({ onSignout, history, isAuthed }) => {

    useEffect(() => {
        onSignout()
    }, [onSignout])
    
    if (!isAuthed) {
        const { prevPath } = history.location.state || { prevPath: '/' };
        return <Redirect to={prevPath} />
    }
    return null;
}
const mapStateToProps = ({ firebase: { auth } }) => ({ isAuthed: !!auth.uid });
const mapDispatchToProps = dispatch => ({
    onSignout: () => dispatch(actions.signout())
})

export default connect(mapStateToProps, mapDispatchToProps)(Signout);