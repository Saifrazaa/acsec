import React, {useContext, useState} from 'react';
import {KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import {Platform, StatusBar} from 'react-native';

import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useFormik} from 'formik';
import * as yup from 'yup';
import TouchID from 'react-native-touch-id';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {UserContext} from '../../context/user';
import Layout from '../../components/layout';
import {color, fonts, sizes} from '../../shared-components/helper';
import GradientHeader from '../../shared-components/gradient-elements/gradient-header';
import FormButton from '../../shared-components/button/form-button';
import Input from '../../shared-components/input/input';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import {useLogin} from '../../hooks/useUserData';
import {Loader, LoaderWrapper} from '../../shared-components/loader';
import AlertModal from '../../shared-components/popups/alertModal';
import {setUserToken} from '../../utils/token-manager';
import {setAuthToken} from '../../utils/api';
import SocialLogin from '../../components/social-login/social-login';
import {google, facebook} from 'react-native-simple-auth';
import Seperator from '../../components/seperator/seperator';

const loginSchema = yup.object({
    username: yup
        .string()
        .required('Email or Phone number is required')
        .matches(
            /^[a-zA-Z0-9@_.-]*$/,
            'Sorry, only letters (a-z), number (0-9), and periods (.) are allowed',
        ),
    password: yup.string().required('Password is required'),
});

const Login = ({navigation}) => {
    const {user, dispatchUser} = useContext(UserContext);
    const [errModal, setErrModal] = useState(false);
    const [errMsgs, setErrMsgs] = useState('');
    const [bioMetricModal, setBioMetricModal] = useState(false);

    const authUser = type => {
        switch (type) {
            case 'google':
                google({
                    appId: '846432049349-i55a9rb0s0qhv6k0mrrfgh5i23c6tmef.apps.googleusercontent.com',
                    callback: 'com.talent.ibex:/login',
                })
                    .then(info => {
                        Login({
                            platform: 'google',
                            mobile: true,
                            id: info.user.id,
                            access_token: info.credentials.access_token,
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });

            case 'facebook':
                facebook({
                    appId: '3321050008144642',
                    callback: 'fb3321050008144642://authorize',
                    fields: ['email'], // you can override the default fields here
                })
                    .then(info => {
                        Login({
                            platform: 'facebook',
                            mobile: true,
                            id: info.user.id,
                            access_token: info.credentials.access_token,
                        });
                    })
                    .catch(error => {
                        console.log(error);
                    });
        }
    };

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: values => {
            onLogin(values);
        },
    });

    const {mutate: Login, isLoading} = useLogin({
        onSuccess: async data => {
            if (data.status === 200) {
                const {token} = data?.data?.data?.details;
                const userData = {
                    id: data?.data?.data?.details?.id,
                    email: data?.data?.data?.details?.other_information?.info
                        ?.email,
                    name: data?.data?.data?.details?.other_information?.info
                        ?.full_name,
                    phone: data?.data?.data?.details?.other_information?.info
                        ?.phone,
                    avatar: data?.data?.data?.details?.other_information?.info
                        ?.avatar,
                    password: formik.values.password,
                };
                formik.resetForm();
                setAuthToken(token);
                setUserToken({token, userData});
                dispatchUser({
                    type: 'SET_USER',
                    user: {
                        ...userData,
                        token,
                        profile: {
                            ...userData,
                        },
                        loggedIn: true,
                    },
                });
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            setErrMsgs(response?.data?.message);
        },
    });

    const onLogin = async v => {
        await Login({username: v.username, password: v.password});
    };

    const checkBioFirstLogin = async () => {
        const jsonValue = await AsyncStorage.getItem('@biometricToken');
        const res = jsonValue != null ? JSON.parse(jsonValue) : null;
        if (res && Object.keys(res).length !== 0) {
            let fingerprintLableForOS =
                Platform.OS == 'ios' ? 'Touch/Face ID' : 'Fingerprint';
            TouchID.authenticate(
                'Login to talentibex using ' + fingerprintLableForOS,
            )
                .then(success => {
                    Login({
                        username: res[0].userEmail,
                        password: res[0].userPassword,
                    });
                })
                .catch(error => {
                    reject(error);
                });
        } else {
            setBioMetricModal(true);
        }
    };

    const headerOptions = {
        noSkew: true,
    };

    return (
        <>
            <KeyboardAvoidingView
                behavior="padding"
                style={{flexGrow: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -400}>
                <Layout
                    noPadding
                    bgColor={color.white}
                    headerOptions={headerOptions}>
                    {/* Top Gradient Header */}

                    <GradientHeader
                        noBorder
                        imgSrc={require('../../assets/images/gradient.png')}
                        noOverlay
                        noSkew
                        noMarginBottom>
                        <HeaderWrap>
                            <PreHeading>Login to</PreHeading>
                            <LogoImg
                                source={require('../../assets/images/talentibex-logo.png')}
                            />
                        </HeaderWrap>
                    </GradientHeader>

                    <SkewWrapper>
                        {/* Login Form Fields */}
                        <LoginForm>
                            <Input
                                placeholder="Enter your email or phone"
                                label="Email or Phone"
                                value={formik.values.username}
                                onValueChange={value =>
                                    formik.setFieldValue('username', value)
                                }
                                errorText={
                                    formik.touched.username &&
                                    formik.errors.username
                                }
                            />
                            <Input
                                placeholder="Enter your password"
                                passwordInput
                                label="Password"
                                value={formik.values.password}
                                onValueChange={value =>
                                    formik.setFieldValue('password', value)
                                }
                                errorText={
                                    formik.touched.password &&
                                    formik.errors.password
                                }
                            />
                            <TouchableOpacity
                                onPress={() => [
                                    navigation.navigate('ForgotPassword'),
                                    formik.resetForm(),
                                ]}>
                                <ForgotPassword>
                                    Forgot Password?
                                </ForgotPassword>
                            </TouchableOpacity>
                        </LoginForm>

                        {/* <Seperator text="or login with" /> */}

                        {/* Social Login Component */}
                        {/* <SocialLogin onPress={authUser} /> */}

                        {/* Already Have Account */}
                        <JoinNow>
                            <JoinNowText>Don’t have an account?</JoinNowText>
                            <TouchableOpacity
                                onPress={() => [
                                    navigation.navigate('JoinNow'),
                                    formik.resetForm(),
                                ]}>
                                <JoinNowBtnTxt>Join Now</JoinNowBtnTxt>
                            </TouchableOpacity>
                        </JoinNow>
                    </SkewWrapper>
                </Layout>

                {/* Footer Buttons */}
                <Layout noScroll footer bgColor={color.white}>
                    <FooterBtnWrap>
                        <FormButton
                            bgColor={color.lightest_gray}
                            btnWidth="29%"
                            iconSize={30}
                            iconButton
                            iconName="fingerprint"
                            onClick={() => checkBioFirstLogin()}
                        />
                        <FormButton
                            btnText="Login"
                            btnWidth="69%"
                            onClick={formik.handleSubmit}
                        />
                    </FooterBtnWrap>
                </Layout>
            </KeyboardAvoidingView>

            <AlertModal
                title="Enable Biometric"
                text="Please login using your Login Id and Password then go to Settings to enable fingerprint login."
                btnText="Ok"
                errModal
                isVisible={bioMetricModal}
                onClickBtn={() => {
                    setBioMetricModal(false);
                }}
            />
            <AlertModal
                title="Request Failed"
                text={errMsgs}
                btnText="Retry"
                errModal
                isVisible={errModal}
                onClickBtn={() => {
                    setErrModal(false);
                }}
            />
            {isLoading && (
                <LoaderWrapper>
                    <Loader size={wp('12%')} />
                </LoaderWrapper>
            )}
        </>
    );
};

const HeaderWrap = styled.SafeAreaView`
    flex: 1 0;
    min-height: ${hp('35%')}px;
    ${Platform.OS === 'android' && `padding-top: ${StatusBar.currentHeight}px`};
    justify-content: center;
`;

const LogoImg = styled.Image`
    width: ${wp('60%')}px;
    height: ${wp('12%')}px;
    resize-mode: contain;
    margin-top: ${wp('1%')}px;
`;

const PreHeading = styled.Text`
    font-size: ${sizes.font16};
    color: ${color.white};
    font-family: ${fonts.GilroyMedium};
`;

const FooterBtnWrap = styled.View`
    flex-direction: ${props => (props.last ? 'column' : 'row')};
    ${props => (props.last ? `height: ${wp('32%')}px` : `height: auto`)};
    justify-content: space-between;
`;

const LoginForm = styled.View``;

const ForgotPassword = styled.Text`
    text-align: right;
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyRegular};
    color: ${color.light_grey};
`;

const JoinNow = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-top: ${wp('8%')}px;
`;

const JoinNowText = styled.Text`
    font-family: ${fonts.GilroyRegular};
    color: ${color.black};
    font-size: ${sizes.font16};
`;

const JoinNowBtnTxt = styled.Text`
    color: ${color.primary};
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroySemiBold};
    margin-left: ${wp('1%')}px;
`;

export default Login;
