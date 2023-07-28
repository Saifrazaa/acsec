import React, {useContext, useEffect} from 'react';
import {deleteUserToken} from '../../utils/token-manager';
import {UserContext} from '../../context/user';
const Logout = () => {
    const {user, dispatchUser} = useContext(UserContext);
    useEffect(() => {
        dispatchUser({
            type: 'SET_USER',
            user: {
                loggedIn: false,
            },
        });
        deleteUserToken();
    });
    return null;
};

export default Logout;
