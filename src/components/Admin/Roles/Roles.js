import React from 'react';
import { motion } from 'framer-motion';
import styles from './Roles.module.css';
import GrantPermissionsForm from './GrantPermissionsForm/GrantPermissionsForm';
import PermissionTable from './PermissionTable/PermissionTable';
import { translateXVariants } from '../../../shared/utility';

const Roles = ({
    roles,
    changeRole,
    setIsModalShowed,
    setModalToShow
}) => {
    const showModal = () => {
        setModalToShow('changeRole');
        setIsModalShowed(true);
    }
    const admins = roles.filter(({ role }) => role === 'admin');
    const superAdmins = roles.filter(({ role }) => role === 'super admin');
    const displayedAdmins = (
        <PermissionTable
            showModal={() => setIsModalShowed(true)}
            changeRole={changeRole}
            admins={admins}
        />
    );
    const displayedSuperAdmins = (
        <PermissionTable
            showModal={() => setIsModalShowed(true)}
            changeRole={changeRole}
            superAdmins={superAdmins}
        />
    );

    return (
        <div className={styles.roles}>
            <div className={styles.permissionTables}>
                <motion.div
                    variants={translateXVariants}
                    custom={false}
                >
                    <h2>Super admins</h2>
                    {displayedSuperAdmins}
                </motion.div>
                <motion.div
                    variants={translateXVariants}
                    custom={true}
                >
                    <h2>Admins</h2>
                    {displayedAdmins}
                </motion.div>
            </div>
            <motion.div
                variants={translateXVariants}
                custom={false}
            >
                <GrantPermissionsForm
                    roles={roles}
                    showModal={showModal}
                    changeRole={changeRole}
                />
            </motion.div>
        </div>
    );
}

export default Roles;