import React, {useContext, useEffect, useState} from 'react';

import Layout from '../../components/layout';
import {Switch} from 'react-native';
import styled from 'styled-components';
import {color, fonts} from '../../shared-components/helper';
import {UserContext} from '../../context/user';

const headerOptions = {
    drawerBtn: true,
    heading: 'Settings',
    subHeading: 'Below is the list of settings available for your application.',
};

const Settings = () => {
    const {user, dispatchUser} = useContext(UserContext);
    return (
        <>
            <Layout withHeader headerOptions={headerOptions}>
                <SettingsWrapper>
                    <Setting>
                        <Label>Dark Mode</Label>
                        <Switch
                            value={user.darkMode ? true : false}
                            onValueChange={val =>
                                dispatchUser({
                                    type: 'SET_USER',
                                    user: {
                                        ...user,
                                        darkMode: val,
                                    },
                                })
                            }
                        />
                    </Setting>
                </SettingsWrapper>
            </Layout>
        </>
    );
};

const SettingsWrapper = styled.View`
    padding: 0px 20px;
`;

const Label = styled.Text`
    font-family: ${fonts.GilroyBold};
    color: ${color.black};
`;

const Setting = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export default Settings;
