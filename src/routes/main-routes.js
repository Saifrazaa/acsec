import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// I M P O R T  S C R E E N S
import Login from '../pages/auth/login';

import Onboarding from '../pages/onboarding/onboarding';


// stack for non-logged in users
const AuthStack = createStackNavigator();


export function Auth({ isNew }) {
    return (
        <AuthStack.Navigator initialRouteName={isNew ? 'Onboarding' : 'Login'}>
            <AuthStack.Screen
                name="Onboarding"
                component={Onboarding}
                options={{
                    headerShown: false,
                }}
            />
            <AuthStack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: false,
                }}
            />
        </AuthStack.Navigator>
    );
}
