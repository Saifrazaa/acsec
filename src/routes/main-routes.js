import React, { useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import styled from 'styled-components';
import Icon from 'react-native-fontawesome-pro';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { color, fonts, Iconsizes } from '../shared-components/helper';
import CustomDrawerSidebar from '../components/customDrawerSidebar/customDrawerSidebar';

// I M P O R T  S C R E E N S
import Login from '../pages/auth/login';
import ForgotPassword from '../pages/auth/forgot-password';
import OTPVerification from '../pages/auth/otp-verification';
import ResetPassword from '../pages/auth/reset-password';

import JoinNow from '../pages/auth/join-now';

import HomeScreen from '../pages/home/home';
import Onboarding from '../pages/onboarding/onboarding';

import JobsListing from '../pages/jobs/jobs-listing';
import JobDetail from '../pages/jobs/job-detail';
import JobApply from '../pages/jobs/job-apply';
import JobRefer from '../pages/jobs/job-refer';

import ProfileScreen from '../pages/profile/profile';
import EditProfile from '../pages/edit-profile/edit-profile';
import Animated from 'react-native-reanimated';
import Settings from '../pages/settings/settings';

import Programs from '../pages/programs/programs';
import CheckStatus from '../pages/check-status/check-status';
import CheckStatusResult from '../pages/check-status/results';

import ProgramDetails from '../pages/programs/program-details';
import ApplyProgram from '../pages/programs/program-apply';

import LifeAtIbexListing from '../pages/life-at-ibex/life-at-ibex-listing';
import BlogDetail from '../pages/life-at-ibex/blog-detail';

const homeSchema = [
    {
        name: 'Home',
        initialRouteName: 'HomeScreen',
        iconName: 'house',
        screens: [
            {
                name: 'HomeScreen',
                component: HomeScreen,
            },
            {
                name: 'JobDetail',
                component: JobDetail,
            },
            {
                name: 'JobApply',
                component: JobApply,
            },
            {
                name: 'JobRefer',
                component: JobRefer,
            },
            {
                name: 'ProgramDetails',
                component: ProgramDetails,
            },
        ],
    },
    {
        name: 'Profile',
        initialRouteName: 'ProfileScreen',
        iconName: 'user',
        screens: [
            {
                name: 'ProfileScreen',
                component: ProfileScreen,
            },
            {
                name: 'EditProfile',
                component: EditProfile,
            },
        ],
    },
    {
        name: 'Jobs',
        initialRouteName: 'JobsListing',
        iconName: 'briefcase-medical',
        screens: [
            {
                name: 'JobsListing',
                component: JobsListing,
            },
            {
                name: 'JobDetail',
                component: JobDetail,
            },
            {
                name: 'JobApply',
                component: JobApply,
            },
            {
                name: 'JobRefer',
                component: JobRefer,
            },
        ],
    },
    {
        name: 'Programs',
        initialRouteName: 'Programs',
        iconName: 'chart-network',
        screens: [
            {
                name: 'Programs',
                component: Programs,
            },
            {
                name: 'ProgramDetails',
                component: ProgramDetails,
            },
            {
                name: 'ApplyProgram',
                component: ApplyProgram,
            },
        ],
    },
    {
        name: 'LifeAtIbex',
        initialRoute: 'LifeAtIbexListing',
        drawerLabel: 'Our Community',
        iconName: 'face-party',
        screens: [
            {
                name: 'LifeAtIbexListing',
                component: LifeAtIbexListing,
            },
            {
                name: 'BlogDetail',
                component: BlogDetail,
            },
        ],
    },
    {
        name: 'CheckStatus',
        initialRouteName: 'CheckStatus',
        drawerLabel: 'Check Status',
        iconName: 'spinner',
        screens: [
            {
                name: 'CheckStatus',
                component: CheckStatus,
            },
            {
                name: 'CheckStatusResult',
                component: CheckStatusResult,
            },
        ],
    },

    {
        name: 'Settings',
        initialRouteName: 'Settings',
        iconName: 'gear',
        screens: [
            {
                name: 'Settings',
                component: Settings,
            },
        ],
    },
];

// stack for non-logged in users
const AuthStack = createStackNavigator();

// stack for logged in users
const Drawer = createDrawerNavigator();
const AppStack = createStackNavigator();

const DrawerScreens = ({ initialRoute, subScreens, style }) => {
    return (
        <Animated.View
            style={[
                { flex: 1, overflow: 'hidden', borderColor: `${color.white}33` },
                style,
            ]}>
            <AppStack.Navigator
                initialRouteName={initialRoute}
                screenOptions={{
                    headerShown: false,
                }}>
                {subScreens.map((item, index) => {
                    return (
                        <AppStack.Screen
                            key={index}
                            name={item.name}
                            options={item.drawerOptions && item.drawerOptions}
                            component={item.component}
                        />
                    );
                })}
            </AppStack.Navigator>
        </Animated.View>
    );
};

export const CustomDrawer = () => {
    const [progress, setProgress] = useState(new Animated.Value(0));
    const scale = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [1, 0.85],
    });
    const borderRadius = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [0, 40],
    });

    const borderWidth = Animated.interpolateNode(progress, {
        inputRange: [0, 1],
        outputRange: [0, 8],
    });

    const screenStyles = { transform: [{ scale }], borderRadius, borderWidth };
    return (
        <DrawerWrapper source={require('../assets/images/gradient.png')}>
            <Drawer.Navigator
                drawerStyle={{
                    flex: 1,
                    width: '70%',
                    backgroundColor: 'transparent',
                }}
                overlayColor="transparent"
                headerShown={false}
                drawerContentStyle={{
                    display: 'none',
                }}
                drawerType="slide"
                sceneContainerStyle={{
                    backgroundColor: 'transparent',
                }}
                initialRouteName="Home"
                drawerContent={props => [
                    setProgress(props.progress),
                    <CustomDrawerSidebar {...props} />,
                ]}
                screenOptions={{
                    unmountOnBlur: true,
                }}
                drawerContentOptions={{
                    activeTintColor: color.white,
                    inactiveTintColor: color.white,
                    labelStyle: {
                        fontFamily: fonts.GilroyMedium,
                    },
                    itemStyle: {
                        paddingLeft: wp('2%'),
                        marginVertical: wp('2%'),
                    },
                }}>
                {homeSchema.map((item, index) => {
                    return (
                        <Drawer.Screen
                            name={item.name}
                            key={index}
                            options={{
                                drawerLabel: item.drawerLabel,
                                drawerIcon: ({ focused }) => (
                                    <Icon
                                        color={color.white}
                                        name={item.iconName}
                                        size={Iconsizes.size18}
                                    />
                                ),
                            }}>
                            {props => (
                                <DrawerScreens
                                    {...props}
                                    subScreens={item.screens}
                                    style={screenStyles}
                                />
                            )}
                        </Drawer.Screen>
                    );
                })}
            </Drawer.Navigator>
        </DrawerWrapper>
    );
};

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
            <AuthStack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{
                    headerShown: false,
                }}
            />
            <AuthStack.Screen
                name="OTPVerification"
                component={OTPVerification}
                options={{
                    headerShown: false,
                }}
            />
            <AuthStack.Screen
                name="ResetPassword"
                component={ResetPassword}
                options={{
                    headerShown: false,
                }}
            />
            <AuthStack.Screen
                name="JoinNow"
                component={JoinNow}
                options={{
                    headerShown: false,
                }}
            />
        </AuthStack.Navigator>
    );
}

const DrawerWrapper = styled.ImageBackground`
    flex: 1;
`;
