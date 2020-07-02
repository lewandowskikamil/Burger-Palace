import React from 'react';
import styles from './Modal.module.css';
import Backdrop from '../Backdrop/Backdrop';

const Modal = ({ children, show, modalClosed }) => {
    return (
        <>
            <Backdrop show={show} clicked={modalClosed} />
            <div className={styles.modal}
                style={{
                    opacity: show ? '1' : '0',
                    transform: show ? 'translateY(0)' : 'translateY(-100vh)'
                }}
            >
                {children}
            </div>
        </>
    );
}
const areEqual = (prevProps, nextProps) => (
    prevProps.show === nextProps.show &&
    prevProps.children === nextProps.children
)
export default React.memo(Modal, areEqual);