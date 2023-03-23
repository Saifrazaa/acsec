import React, {useState} from 'react';
import styled from 'styled-components';
import {Platform, StatusBar, KeyboardAvoidingView} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useRoute} from '@react-navigation/native';
import {useFormik} from 'formik';
import * as yup from 'yup';

import FormButton from '../../shared-components/button/form-button';
import Layout from '../../components/layout';
import {color, fonts, sizes} from '../../shared-components/helper';
import GradientHeader from '../../shared-components/gradient-elements/gradient-header';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import Input from '../../shared-components/input/input';
import {usePasswordReset} from '../../hooks/useUserData';
import {Loader, LoaderWrapper} from '../../shared-components/loader';
import AlertModal from '../../shared-components/popups/alertModal';
import {deleteBiometricToken} from '../../utils/token-manager';

const newPswrdSchema = yup.object({
    password: yup
        .string()
        .required('Password is required')
        .matches(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/,
            'Password must contain minimum 8 characters, maximum 16 characters, at least one uppercase letter, at least one lowercase letter, one number and one special character.',
        ),
    confirm_password: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords do not match'),
});

const ResetPassword = ({navigation}) => {
    const [errModal, setErrModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errMsgs, setErrMsgs] = useState([]);
    const route = useRoute();
    const {email, otp} = route.params;

    const formik = useFormik({
        initialValues: {
            password: '',
            confirm_password: '',
        },
        validationSchema: newPswrdSchema,
        onSubmit: values => {
            PasswordReset({
                email,
                password: values.password,
                confirm_password: values.confirm_password,
                otp,
            });
        },
    });

    const {mutate: ResetPswrd, isLoading} = usePasswordReset({
        onSuccess: data => {
            if (data && data.status === 200) {
                setSuccessModal(true);
                deleteBiometricToken();
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            setErrMsgs(response?.data?.message);
        },
    });

    const PasswordReset = async v => {
        await ResetPswrd(v);
    };

    return (
        <>
            <KeyboardAvoidingView
                behavior="padding"
                style={{flexGrow: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -400}>
                <Layout noPadding bgColor={color.white}>
                    <GradientHeader noBorder noSkew>
                        <HeaderWrap>
                            <LogoImg
                                source={require('../../assets/images/talentibex-logo.png')}
                            />
                            <BannerImg
                                source={require('../../assets/images/forget-pswrd-img.png')}
                            />
                        </HeaderWrap>
                    </GradientHeader>
                    <SkewWrapper>
                        <ForgotWrap>
                            <Heading>Reset Password</Heading>
                            <Input
                                placeholder="Enter new password"
                                passwordInput
                                value={formik.values.password}
                                label="New Password"
                                errorText={
                                    formik.touched.password &&
                                    formik.errors.password
                                }
                                onValueChange={value =>
                                    formik.setFieldValue('password', value)
                                }
                            />
                            <Input
                                placeholder="Enter confirm password"
                                passwordInput
                                value={formik.values.confirm_password}
                                label="Confirm Password"
                                errorText={
                                    formik.touched.confirm_password &&
                                    formik.errors.confirm_password
                                }
                                onValueChange={value =>
                                    formik.setFieldValue(
                                        'confirm_password',
                                        value,
                                    )
                                }
                            />
                        </ForgotWrap>
                    </SkewWrapper>
                </Layout>
                <Layout noScroll footer bgColor={color.white}>
                    <FooterBtnWrap>
                        <FormButton
                            btnText="Reset"
                            btnWidth="100%"
                            onClick={formik.handleSubmit}
                        />
                    </FooterBtnWrap>
                </Layout>
            </KeyboardAvoidingView>

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
            <AlertModal
                title="Password Successfuly Reset"
                text={`Your password has been successfuly reset.`}
                btnText="Login"
                isVisible={successModal}
                onClickBtn={() => {
                    navigation.navigate('Login');
                    setSuccessModal(false);
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
    align-items: center;
    min-height: ${hp('58%')}px;
    ${Platform.OS === 'android' && `padding-top: ${StatusBar.currentHeight}px`}
`;

const FooterBtnWrap = styled.View`
    flex-direction: ${props => (props.last ? 'column' : 'row')};
    ${props => (props.last ? `height: ${wp('32%')}px` : `height: auto`)};
    justify-content: space-between;
`;

const BannerImg = styled.Image`
    width: ${wp('95%')}px;
    height: ${hp('43%')}px;
    resize-mode: contain;
`;

const ForgotWrap = styled.View``;

const LogoImg = styled.Image`
    width: ${wp('50%')}px;
    height: ${wp('12%')}px;
    resize-mode: contain;
    margin-top: ${wp('8%')}px;
    margin-bottom: ${wp('2%')}px;
`;

const Heading = styled.Text`
    font-size: ${sizes.font24};
    font-family: ${fonts.GilroyBold};
    margin-bottom: ${wp('5%')}px;
    color: ${color.black};
`;

export default ResetPassword;
