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
import {setUserToken} from '../../utils/token-manager';
import database from '@react-native-firebase/database';

const signupSchema = yup.object({
    full_name: yup.string().required('Please Enter Your Full Name.'),
    username: yup
        .string()
        .required('Email address is required')
        .email('Please enter valid email')
        .matches(
            /^[a-zA-Z0-9@_.-]*$/,
            'Sorry, only letters (a-z), number (0-9), and periods (.) are allowed',
        ),
    phone_no: yup
        .string()
        .required('Phone Number is Required')
        .matches(/^[0-9]*$/, 'Only Numbers are allowed')
        .min(11, 'Invalid contact number')
        .max(11, 'Invalid contact number'),
    password: yup.string().required('Password is required'),
});

const Signup = ({navigation}) => {
    const {user, dispatchUser} = useContext(UserContext);
    const formik = useFormik({
        initialValues: {
            full_name: '',
            username: '',
            password: '',
        },
        validationSchema: signupSchema,
        onSubmit: values => {
            onSignup(values);
        },
    });

    const headerOptions = {
        heading: 'ACSEC',
        subHeading: 'Create Your Account to record your activities.',
    };

    const onSignup = () => {
        database()
            .ref(`/users/${formik.values.phone_no}`)
            .set({
                full_name: formik.values.full_name,
                email: formik.values.username,
                password: formik.values.password,
                phone_no: formik.values.phone_no,
            })
            .then(() => {
                setUserToken({
                    username: formik.values.full_name,
                    password: formik.values.password,
                    email: formik.values.username,
                    phone_no: formik.values.phone_no,
                });
                dispatchUser({
                    type: 'SET_USER',
                    user: {
                        loggedIn: true,
                        full_name: formik.values.full_name,
                        email: formik.values.username,
                        password: formik.values.password,
                        phone_no: formik.values.phone_no,
                    },
                });
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
                                placeholder="Enter your Full Name"
                                label="Full Name"
                                value={formik.values.full_name}
                                onValueChange={value =>
                                    formik.setFieldValue('full_name', value)
                                }
                                errorText={
                                    formik.touched.full_name &&
                                    formik.errors.full_name
                                }
                            />
                            <Input
                                placeholder="Enter your Phone Number"
                                label="Phone Number"
                                value={formik.values.phone_no}
                                onValueChange={value =>
                                    formik.setFieldValue('phone_no', value)
                                }
                                errorText={
                                    formik.touched.phone_no &&
                                    formik.errors.phone_no
                                }
                            />
                            <Input
                                placeholder="Enter your email"
                                label="Email"
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
                        </LoginForm>

                        {/* Already Have Account */}
                        <JoinNow>
                            <JoinNowText>Already have an account?</JoinNowText>
                            <TouchableOpacity
                                onPress={() => [
                                    navigation.navigate('Login'),
                                    formik.resetForm(),
                                ]}>
                                <JoinNowBtnTxt>Login</JoinNowBtnTxt>
                            </TouchableOpacity>
                        </JoinNow>
                    </View>
                </Layout>

                {/* Footer Buttons */}
                <Layout noScroll footer bgColor={color.white}>
                    <FooterBtnWrap>
                        <FormButton
                            btnText="Create Account"
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

export default Signup;
