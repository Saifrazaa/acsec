import React, {useState} from 'react';
import styled from 'styled-components';
import {Platform, StatusBar, KeyboardAvoidingView} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useFormik} from 'formik';
import * as yup from 'yup';

import FormButton from '../../shared-components/button/form-button';
import Layout from '../../components/layout';
import {color, fonts, sizes} from '../../shared-components/helper';
import GradientHeader from '../../shared-components/gradient-elements/gradient-header';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import Input from '../../shared-components/input/input';
import {Loader, LoaderWrapper} from '../../shared-components/loader';
import {usePassViaEmail} from '../../hooks/useUserData';
import AlertModal from '../../shared-components/popups/alertModal';

const forgotSchema = yup.object({
    email: yup
        .string()
        .required('Email address is required')
        .email('Please enter valid email')
        .matches(
            /^[a-zA-Z0-9@_.-]*$/,
            'Sorry, only letters (a-z), number (0-9), and periods (.) are allowed',
        ),
});

const ForgotPassword = ({navigation}) => {
    const [errModal, setErrModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errMsgs, setErrMsgs] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        validationSchema: forgotSchema,
        onSubmit: values => {
            ForgotPswrd({email: formik.values.email});
        },
    });

    const {
        mutate: Forgot,
        isLoading,
        isError,
        error,
    } = usePassViaEmail({
        onSuccess: data => {
            if (data && data.status === 200) {
                navigation.navigate('OTPVerification', {
                    email: formik.values.email,
                });
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            if (response?.data?.data?.status === 400) {
                setErrMsgs(response?.data?.data?.details?.email);
            } else {
                setErrMsgs(response?.data?.message);
            }
        },
    });

    const ForgotPswrd = async v => {
        await Forgot(v);
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
                            <Heading>Forgot Password</Heading>
                            <Para>
                                Don’t worry! it happens. Please enter the email
                                address associated with your account.
                            </Para>
                            <Input
                                placeholder="Enter your email"
                                label="Your email address"
                                keyboardType="email-address"
                                value={formik.values.email}
                                onValueChange={value =>
                                    formik.setFieldValue('email', value)
                                }
                                errorText={
                                    formik.touched.email && formik.errors.email
                                }
                            />
                        </ForgotWrap>
                    </SkewWrapper>
                </Layout>
                <Layout noScroll footer bgColor={color.white}>
                    <FooterBtnWrap>
                        <FormButton
                            btnText="Back"
                            btnWidth="29%"
                            bgColor={color.lightest_gray}
                            color={color.black}
                            onClick={() => navigation.navigate('Login')}
                        />
                        <FormButton
                            btnText="Continue"
                            btnWidth="69%"
                            onClick={formik.handleSubmit}
                        />
                    </FooterBtnWrap>
                </Layout>
            </KeyboardAvoidingView>

            {isLoading && (
                <LoaderWrapper>
                    <Loader size={wp('12%')} />
                </LoaderWrapper>
            )}
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
                title="Code Sent"
                text={`6 Digit Verification Code has been sent to your associated email address.`}
                btnText="Go to Verification"
                isVisible={successModal}
                onClickBtn={() => {
                    navigation.navigate('OTPVerification', {
                        email: formik.values.email,
                    });
                    setSuccessModal(false);
                }}
            />
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
    margin-bottom: ${wp('3%')}px;
    color: ${color.black};
`;

const Para = styled.Text`
    margin-bottom: ${wp('8%')}px;
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyRegular};
    color: ${color.black};
`;

export default ForgotPassword;
