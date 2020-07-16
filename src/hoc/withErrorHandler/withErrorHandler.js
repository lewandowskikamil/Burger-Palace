import React from 'react';

import Modal from '../../components/UI/Modal/Modal';
import useHttpErrorHandler from '../../hooks/httpErrorHandler';

const withErrorHandler = (WrappedComponent, axios) => {
    return props => {
        const [error, clearError] = useHttpErrorHandler(axios);
        // now if you want to handle error in any other way than showing modal you can achieve this using this hook
        return (
            <>
                <Modal
                    show={error}
                    modalClosed={clearError}
                >
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props} />
            </>
        )
    }
}
export default withErrorHandler;