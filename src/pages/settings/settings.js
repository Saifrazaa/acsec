import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Switch} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import AlertModal from '../../shared-components/popups/alertModal';
import Layout from '../../components/layout';
import {color, fonts, sizes} from '../../shared-components/helper';
import {
    deleteBiometricToken,
    setBiometricToken,
} from '../../utils/token-manager';
import {UserContext} from '../../context/user';
import {checkBiometricSupportednEnrolled} from '../../utils/biometricService';

const headerOptions = {
    heading: 'Settings',
    drawerBtn: true,
    // notificationBtn: true,
};

const Settings = () => {
    const [isBioMetricEnabled, setIsBioMetricEnabled] = useState(false);
    const [bioMetricFailed, setBioMetricFailed] = useState(false);
    const {user} = useContext(UserContext);

    const checkBioMetricAccess = async () => {
        const jsonValue = await AsyncStorage.getItem('@biometricToken');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        if (res && Object.keys(res).length !== 0) {
            setIsBioMetricEnabled(true);
        } else {
            setIsBioMetricEnabled(false);
        }
    };

    const handleBioMetricToggle = async () => {
        if (isBioMetricEnabled) {
            setIsBioMetricEnabled(false);
            deleteBiometricToken();
        } else {
            let isFingerPrintSupported =
                await checkBiometricSupportednEnrolled();
            if (isFingerPrintSupported === true) {
                setBiometricToken({
                    userEmail: user.email,
                    userPassword: user.password,
                });
                setIsBioMetricEnabled(true);
            } else {
                setBioMetricFailed(true);
            }
        }
    };

    useEffect(() => {
        checkBioMetricAccess();
    }, [isBioMetricEnabled]);

    return (
        <>
            <Layout
                withHeader
                headerOptions={headerOptions}
                noPadding
                bgColor={color.white}>
                <SettingsWrapper>
                    <Setting>
                        <SettingTitle>Enable Fingerprint Login</SettingTitle>
                        <SettingAction>
                            <Switch
                                trackColor={{
                                    false: color.lightest_gray,
                                    true: color.primary,
                                }}
                                thumbColor={
                                    isBioMetricEnabled
                                        ? color.white
                                        : color.light_grey
                                }
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => handleBioMetricToggle()}
                                value={isBioMetricEnabled}
                            />
                        </SettingAction>
                    </Setting>
                    <Setting>
                        <SettingTitle>Do not call me</SettingTitle>
                        <SettingAction>
                            <Switch
                                trackColor={{
                                    false: color.lightest_gray,
                                    true: color.primary,
                                }}
                                thumbColor={
                                    isBioMetricEnabled
                                        ? color.white
                                        : color.light_grey
                                }
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => handleBioMetricToggle()}
                                value={isBioMetricEnabled}
                            />
                        </SettingAction>
                    </Setting>
                </SettingsWrapper>
            </Layout>
            <AlertModal
                title="Fingerprint login failed"
                text="Your device doesn't support fingerprint login."
                btnText="Ok"
                errModal
                isVisible={bioMetricFailed}
                onClickBtn={() => {
                    setBioMetricFailed(false);
                }}
            />
        </>
    );
};

const SettingsWrapper = styled.View`
    padding: 0 ${wp('5%')}px;
    padding-top: ${wp('12%')}px;
`;

const Setting = styled.View`
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    border: 1px solid;
    border-color: ${color.inputBorder};
    padding: ${wp('5%')}px;
    elevation: 5;
    background-color: ${color.white};
`;

const SettingTitle = styled.Text`
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroyMedium};
    color: ${color.black};
`;

const SettingAction = styled.View``;

export default Settings;
