import React, {useEffect} from 'react';
import { motion } from 'framer-motion';
import { useHistory } from 'react-router-dom';

const redirectVariants = {
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

const Redirect = ({to}) => {
    const history = useHistory();
    useEffect(() => history.replace(to),[history, to]);
    return (
        <motion.div
            variants={redirectVariants}
            initial='hidden'
            animate='visible'
            exit='visible'
        ></motion.div>
    );
}

export default Redirect;