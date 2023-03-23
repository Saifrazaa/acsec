import React, { createContext } from 'react';

const defaultContext = {
    user: {
        loggedIn: false,
    },
};

export const UserContext = createContext(defaultContext);

export const userReducer = (state = defaultContext, action) => {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...action.user,
            };
        case 'CLEAR_USER':
            // deleteUserToken();
            return defaultContext;
        default:
            return state;
    }
};
