import React, {useContext} from 'react';
import {KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import {Platform, View} from 'react-native';

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
import FormButton from '../../shared-components/button/form-button';
import Input from '../../shared-components/input/input';

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
    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        // validationSchema: loginSchema,
        onSubmit: values => {
            onLogin(values);
        },
    });

    const headerOptions = {
        heading: 'ACSEC',
        subHeading: 'Please login to your account to record your activities.',
    };

    const onLogin = () => {
        dispatchUser({
            type: 'SET_USER',
            user: {
                loggedIn: true,
            },
        });
    };

    return (
        <>
            <KeyboardAvoidingView
                behavior="padding"
                style={{flexGrow: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -400}>
                <Layout withHeader headerOptions={headerOptions}>
                    {/* Top Gradient Header */}
                    <View style={{paddingLeft: 20, paddingRight: 20}}>
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
                    </View>
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
