import React, { useState, useEffect } from 'react';
import styles from './GrantPermissionsForm.module.css';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import Card from '../../../UI/Card/Card';
import { updateObject, checkValidity } from '../../../../shared/utility';

const GrantPermissionsForm = ({ roles, showModal, changeRole }) => {

    const initialEmailData = {
        elementType: 'input',
        elementLabel: 'Email',
        elementPrefix: 'Envelope',
        elementConfig: {
            id: 'emailInput',
            type: 'email',
        },
        value: '',
        validation: {
            required: true,
            isEmail: true,
            errorMessage: 'Invalid email format.'
        },
        valid: false,
        touched: false
    }

    const [userEmail, setUserEmail] = useState(initialEmailData);
    const [isAdmin, setIsAdmin] = useState(false);
    const [exists, setExists] = useState(false);

    useEffect(() => {
        const userData = roles
            .find(({ email }) => email === userEmail.value);
        if (userData &&
            ['admin', 'super admin'].includes(userData.role) &&
            !isAdmin) {
            setIsAdmin(true);
        } else if (userData &&
            !['admin', 'super admin'].includes(userData.role) &&
            isAdmin) {
            setIsAdmin(false);
        }
    }, [roles, isAdmin, userEmail.value]);

    const formSubmitHandler = (e) => {
        e.preventDefault();
        const userId = roles
            .find(({ email }) => email === userEmail.value).id;
        changeRole(userId, 'make admin');
        showModal();
    }
    const inputChangeHandler = (e) => {
        const userData = roles
            .find(({ email }) => email === e.target.value);
        const updatedEmail = updateObject(userEmail, {
            value: e.target.value,
            valid: checkValidity(
                e.target.value, userEmail.validation
            ),
            touched: true,
        });
        setUserEmail(updatedEmail);

        if (userData && !exists) {
            setExists(true);
        }
        else if (!userData && exists) {
            setExists(false)
        };

        if (userData &&
            ['admin', 'super admin'].includes(userData.role) &&
            !isAdmin) {
            setIsAdmin(true);
        } else if (isAdmin) {
            setIsAdmin(false)
        };
    }

    const form = (
        <form onSubmit={formSubmitHandler}>
            <Input
                changed={inputChangeHandler}
                {...userEmail}
            />
            {isAdmin && <p className='info'>
                This user is already admin or super admin.
            </p>}
            {!exists && userEmail.valid && <p className='info'>
                There's no user with above email.
            </p>}
            <Button
                secondary
                disabled={!userEmail.valid || isAdmin || !exists}>
                Submit
            </Button>
        </form>
    );

    return (
        <Card destination='form'>
            <h2 className={styles.formHeading}>
                Grant admin permissions
            </h2>
            {form}
        </Card>
    );
}

export default GrantPermissionsForm;