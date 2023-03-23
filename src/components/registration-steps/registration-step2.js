import React from 'react';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {useFormik} from 'formik';
import * as yup from 'yup';

import InputMask from '../../shared-components/input-mask/input-mask';
import Input from '../../shared-components/input/input';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import Layout from '../layout';
import FormButton from '../../shared-components/button/form-button';
import {color, phoneMask} from '../../shared-components/helper';
import RegisterHeader from './registration-header';

const registerSchema = yup.object({
    email: yup
        .string()
        .required('Email address is required')
        .email('Please enter valid email')
        .matches(
            /^[a-zA-Z0-9@_.-]*$/,
            'Sorry, only letters (a-z), number (0-9), and periods (.) are allowed',
        ),
    phone: yup
        .string()
        .required('Contact number is required')
        .min(15, 'Invalid contact number'),
    alternate_phone: yup.string().min(15, 'Invalid contact number'),
});

export const RegisterStep2 = ({
    handleNextSlide,
    handleBackSlide,
    userData,
    setUserData,
    activeIndex,
}) => {
    const formik = useFormik({
        initialValues: {
            email: userData.email,
            phone: userData.phone,
            alternate_phone: userData.alternate_phone,
        },
        validationSchema: registerSchema,
        onSubmit: values => {
            const data = {
                ...userData,
                email: values.email,
                phone: values.phone,
                alternate_phone: values.alternate_phone,
            };
            setUserData(data);
            handleNextSlide();
        },
    });

    return (
        <>
            <KeyboardAvoidingView
                behavior="padding"
                style={{flexGrow: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -400}>
                <Layout noPadding bgColor={color.white}>
                    <RegisterHeader activeStep={activeIndex} />
                    <SkewWrapper>
                        <Input
                            placeholder="Enter email address"
                            label="Email Address"
                            keyboardType="email-address"
                            value={formik.values.email}
                            onValueChange={value =>
                                formik.setFieldValue('email', value)
                            }
                            errorText={
                                formik.touched.email && formik.errors.email
                            }
                        />
                        <InputMask
                            label="Contact Number"
                            placeholder="+92 ___ _______"
                            keyboardType="phone-pad"
                            prefix={['+', '9', '2']}
                            mask={phoneMask}
                            value={formik.values.phone}
                            onValueChange={value =>
                                formik.setFieldValue('phone', value)
                            }
                            errorText={
                                formik.touched.phone && formik.errors.phone
                            }
                        />
                        <InputMask
                            label="Alternate Contact Number"
                            placeholder="+92 ___ _______"
                            keyboardType="phone-pad"
                            prefix={['+', '9', '2']}
                            mask={phoneMask}
                            value={formik.values.alternate_phone}
                            onValueChange={value =>
                                formik.setFieldValue('alternate_phone', value)
                            }
                            errorText={
                                formik.touched.alternate_phone &&
                                formik.errors.alternate_phone
                            }
                        />
                    </SkewWrapper>
                </Layout>
                <Layout noScroll footer>
                    <FooterBtnWrap>
                        <Animatable.View
                            easing="ease-out"
                            transition={['width']}
                            duration={100}
                            style={{
                                width: '29%',
                            }}>
                            <FormButton
                                btnText="Back"
                                btnWidth="100%"
                                bgColor={color.lightest_gray}
                                color={color.black}
                                onClick={() => handleBackSlide()}
                            />
                        </Animatable.View>
                        <Animatable.View
                            easing="ease-out"
                            transition={['width']}
                            duration={100}
                            style={{
                                width: '69%',
                            }}>
                            <FormButton
                                btnText="Continue"
                                btnWidth="100%"
                                onClick={formik.handleSubmit}
                            />
                        </Animatable.View>
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
