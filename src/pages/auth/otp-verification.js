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
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Loader, LoaderWrapper} from '../../shared-components/loader';
import {useOTPVerify, useResendOTP} from '../../hooks/useUserData';
import AlertModal from '../../shared-components/popups/alertModal';

const otpCodeSchema = yup.object({
    otp_code: yup
        .string()
        .required('OTP code is required')
        .min(6, 'OTP code is invalid')
        .max(6, 'OTP code is invalid'),
});

const OTPVerification = ({navigation}) => {
    const [errModal, setErrModal] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [errMsgs, setErrMsgs] = useState('');
    const [otpResent, setOtpResent] = useState(false);
    const route = useRoute();
    const email = route.params.email;

    const formik = useFormik({
        initialValues: {
            otp_code: '',
        },
        validationSchema: otpCodeSchema,
        onSubmit: values => {
            OTPVerification({
                email,
                otp: values.otp_code,
                verification_action: 'forget_password',
            });
        },
    });

    const {mutate: ResendOTP, isLoading: isLoadingResentOtp} = useResendOTP({
        onSuccess: data => {
            if (data && data.status === 200) {
                setOtpResent(true);
                setSuccessModal(true);
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            if (response?.data?.data?.status === 401) {
                setErrMsgs(response?.data?.data?.details?.otp);
            } else {
                setErrMsgs(response?.data?.message);
            }
        },
    });

    const {mutate: OTPverify, isLoading} = useOTPVerify({
        onSuccess: data => {
            if (data && data.status === 200) {
                navigation.navigate('ResetPassword', {
                    email,
                    otp: formik.values.otp_code,
                });
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            if (response?.data?.data?.status === 401) {
                setErrMsgs(response?.data?.data?.details?.otp);
            } else {
                setErrMsgs(response?.data?.message);
            }
        },
    });

    const OTPVerification = async v => {
        await OTPverify(v);
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
                            <Heading>Verification</Heading>
                            <Para>
                                Please enter verfication code that you have
                                received on your email.
                            </Para>
                            <Input
                                placeholder="Enter the code"
                                label="Verification Code"
                                keyboardType="phone-pad"
                                value={formik.values.otp_code}
                                onValueChange={value =>
                                    formik.setFieldValue('otp_code', value)
                                }
                                errorText={
                                    formik.touched.otp_code &&
                                    formik.errors.otp_code
                                }
                            />
                            <ResendCodeWrap>
                                <ResendCodeText>
                                    Didn't receive the code yet?
                                </ResendCodeText>
                                <TouchableOpacity
                                    onPress={() => ResendOTP({email})}>
                                    <ResendBtnTxt>Resend Code</ResendBtnTxt>
                                </TouchableOpacity>
                            </ResendCodeWrap>
                        </ForgotWrap>
                    </SkewWrapper>
                </Layout>
                <Layout noScroll footer bgColor={color.white}>
                    <FooterBtnWrap>
                        <FormButton
                            btnText="Continue"
                            btnWidth="100%"
                            onClick={formik.handleSubmit}
                        />
                    </FooterBtnWrap>
                </Layout>
            </KeyboardAvoidingView>

            <AlertModal
                title={otpResent ? 'OTP Resent' : 'OTP Verified'}
                text={
                    otpResent
                        ? 'New OTP code has been sent to your email address'
                        : `OTP code successfully verified`
                }
                btnText={otpResent ? 'Verify Again' : 'Reset Password'}
                isVisible={successModal}
                onClickBtn={() => {
                    setSuccessModal(false);
                    if (!otpResent) {
                        navigation.navigate('ResetPassword', {
                            email,
                            otp: formik.values.otp_code,
                        });
                    } else {
                        setOtpResent(false);
                    }
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
            {(isLoading || isLoadingResentOtp) && (
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
    height: ${hp('55%')}px;
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

const ResendCodeWrap = styled.View`
    align-self: center;
    margin-top: ${wp('3%')}px;
`;

const ResendCodeText = styled.Text`
    font-family: ${fonts.GilroyRegular};
    text-align: center;
    margin-bottom: ${wp('1%')}px;
    color: ${color.black};
`;

const ResendBtnTxt = styled.Text`
    color: ${color.primary};
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroySemiBold};
    text-align: center;
`;

export default OTPVerification;
