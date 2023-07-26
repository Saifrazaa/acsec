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

import {UserContext} from '../../context/user';
import Layout from '../../components/layout';
import {color, fonts, sizes} from '../../shared-components/helper';
import GradientHeader from '../../shared-components/gradient-elements/gradient-header';
import FormButton from '../../shared-components/button/form-button';
import Input from '../../shared-components/input/input';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import {Loader, LoaderWrapper} from '../../shared-components/loader';

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
                                source={require('../../assets/images/logo.png')}
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
                            btnText="Login"
                            btnWidth="100%"
                            onClick={formik.handleSubmit}
                        />
                    </FooterBtnWrap>
                </Layout>
            </KeyboardAvoidingView>

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
    width: ${wp('30%')}px;
    height: ${wp('15%')}px;
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
