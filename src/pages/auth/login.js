import React, {useContext, useState} from 'react';
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
import AlertModal from '../../shared-components/popups/alertModal';

const loginSchema = yup.object({
    username: yup
        .string()
        .required('Phone number is required')
        .matches(/^[0-9]*$/, 'Sorry, number (0-9) are required.'),
    password: yup.string().required('Password is required'),
});

const Login = ({navigation}) => {
    const {user, dispatchUser} = useContext(UserContext);
    const [errModal, setErrModal] = useState(false);
    const [errMsgs, setErrMsgs] = useState('');

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
        heading: 'ACSEC',
        subHeading: 'Please login to your account to record your activities.',
    };

    const onLogin = () => {
        database()
            .ref(`/users/${formik.values.username}`)
            .once('value')
            .then(snapshot => {
                const value = snapshot.val();
                if (value !== null) {
                    if (value.password === formik.values.password) {
                        setUserToken({
                            phone_no: formik.values.username,
                            password: formik.values.password,
                        });
                        dispatchUser({
                            type: 'SET_USER',
                            user: {
                                loggedIn: true,
                                phone_no: formik.values.username,
                            },
                        });
                    } else {
                        setErrModal(true);
                        setErrMsgs(
                            'Your Phone Number and Password does not match.',
                        );
                    }
                } else {
                    setErrModal(true);
                    setErrMsgs('No account found with this phone number.');
                }
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
                                placeholder="Enter your Phone"
                                label="Phone"
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
                            <JoinNowText>Don’t have an account?</JoinNowText>
                            <TouchableOpacity
                                onPress={() => [
                                    navigation.navigate('Signup'),
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
            <AlertModal
                title="Oops, Something went wrong!"
                text={errMsgs ?? "Can't login right now"}
                btnText="OK"
                errModal
                isVisible={errModal}
                onClickBtn={() => {
                    setErrModal(false);
                }}
            />
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
