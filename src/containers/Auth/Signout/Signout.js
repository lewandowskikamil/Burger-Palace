import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions';

const signoutVariants = {
    hidden: {
        x: 0
    },
    visible: {
        x: 0,
        transition: {
            duration: 0
        }
    }
}
const Signout = ({ onSignout, history, isAuthed }) => {

    useEffect(() => {
        onSignout()
    }, [onSignout])
    useEffect(() => {
        if (!isAuthed) {
            const { prevPath } = history.location.state || { prevPath: '/' };
            history.replace(prevPath);
        }
    }, [isAuthed, history]);
    return (
        <motion.div
            variants={signoutVariants}
            initial='hidden'
            animate='visible'
            exit='visible'
        >
        </motion.div>
    )
}
const mapStateToProps = ({ firebase: { auth } }) => ({ isAuthed: !!auth.uid });
const mapDispatchToProps = dispatch => ({
    onSignout: () => dispatch(actions.signout())
})

export default connect(mapStateToProps, mapDispatchToProps)(Signout);