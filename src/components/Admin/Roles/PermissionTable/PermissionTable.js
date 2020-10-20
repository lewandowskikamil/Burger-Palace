import React from 'react';
import Table from '../../../UI/Table/Table';
import icons from '../../../../shared/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const PermissionTable = ({
    showModal,
    changeRole,
    admins,
    superAdmins
}) => {
    const privilegedUsers = admins || superAdmins;
    const displayedPrivilegedUsers = privilegedUsers.length ? (
        <Table>
            <thead>
                <tr>
                    <th>Email</th>
                    {admins && <th>Promote</th>}
                    <th>Degrade</th>
                </tr>
            </thead>
            <tbody>
                {privilegedUsers.map(({ email, id }) => (
                    <tr key={id}>
                        <td>{email}</td>
                        {admins && (
                            <td
                                style={{
                                    textAlign: 'center'
                                }}
                            >
                                <span
                                    onClick={() => {
                                        showModal();
                                        changeRole(id, 'promote');
                                    }}
                                    className="success"
                                >
                                    <FontAwesomeIcon icon={icons.faArrowUp} />
                                </span>
                            </td>
                        )}
                        <td
                            style={{
                                textAlign: 'center'
                            }}
                        >
                            <span
                                onClick={() => {
                                    showModal();
                                    changeRole(id, 'degrade');
                                }}
                                className="danger"
                            >
                                <FontAwesomeIcon icon={icons.faArrowDown} />
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    ) : (
            <p className='info'>
                {`There are no ${admins ? '' : 'super '}admins.`}
            </p>
        );

    return displayedPrivilegedUsers;
}

export default PermissionTable;