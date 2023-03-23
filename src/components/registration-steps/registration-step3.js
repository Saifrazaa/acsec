import React from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {TouchableOpacity} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useFormik} from 'formik';
import * as yup from 'yup';

import CustSelect from '../../shared-components/select/select';
import Input from '../../shared-components/input/input';
import {
    color,
    fonts,
    handleExternelLink,
    sizes,
} from '../../shared-components/helper';
import FormButton from '../../shared-components/button/form-button';
import Layout from '../layout';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import RegisterHeader from './registration-header';

const registerSchema = yup.object({
    is_ibex_employee: yup
        .string()
        .required('Please select employee type')
        .nullable(),
    employee_id: yup.string().when('is_ibex_employee', {
        is: val => val === '1',
        then: yup
            .string()
            .required('Employee ID is required')
            .matches(/^[0-9]*$/, 'Sorry, only numbers (0-9) are allowed'),
        otherwise: yup.string(),
    }),
    employee_email: yup.string().when('is_ibex_employee', {
        is: val => val === '1',
        then: yup
            .string()
            .required('Employee email is required')
            .email('Please enter valid email')
            .matches(
                /^[a-zA-Z0-9@_.-]*$/,
                'Sorry, only letters (a-z), number (0-9), and periods (.) are allowed',
            ),
        otherwise: yup.string(),
    }),
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
        .oneOf([yup.ref('password')], 'The passwords do not match'),
});

const employeeType = [
    {
        label: 'I am an Applicant',
        value: '0',
    },
    {
        label: 'I am an ibex Employee',
        value: '1',
    },
    {
        label: 'I am a Recruiter',
        value: '2',
    },
];

export const RegisterStep3 = ({
    handleBackSlide,
    userData,
    activeIndex,
    onRegister,
}) => {
    const formik = useFormik({
        initialValues: {
            is_ibex_employee: userData.is_ibex_employee,
            employee_id: userData.employee_id,
            employee_email: userData.employee_email,
            password: userData.password,
            confirm_password: userData.confirm_password,
        },
        validationSchema: registerSchema,
        onSubmit: values => {
            const data = {
                ...userData,
                is_ibex_employee: values.is_ibex_employee,
                employee_id: values.employee_id,
                employee_email: values.employee_email,
                password: values.password,
                confirm_password: values.confirm_password,
            };
            onRegister(data);
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
                        <CustSelect
                            label="Who are you?"
                            placeholder="Select Type"
                            value={formik.values.is_ibex_employee}
                            options={employeeType}
                            onValueChange={value =>
                                formik.setFieldValue('is_ibex_employee', value)
                            }
                            errorText={
                                formik.touched.is_ibex_employee &&
                                formik.errors.is_ibex_employee
                            }
                        />
                        {formik.values.is_ibex_employee === '1' && (
                            <>
                                <Input
                                    placeholder="Enter your ID"
                                    label="ibex. Employee ID"
                                    value={formik.values.employee_id}
                                    keyboardType="phone-pad"
                                    onValueChange={value =>
                                        formik.setFieldValue(
                                            'employee_id',
                                            value,
                                        )
                                    }
                                    errorText={
                                        formik.touched.employee_id &&
                                        formik.errors.employee_id
                                    }
                                />
                                <Input
                                    placeholder="Enter your email address"
                                    label="ibex. Email"
                                    keyboardType="email-address"
                                    value={formik.values.employee_email}
                                    onValueChange={value =>
                                        formik.setFieldValue(
                                            'employee_email',
                                            value,
                                        )
                                    }
                                    errorText={
                                        formik.touched.employee_email &&
                                        formik.errors.employee_email
                                    }
                                />
                            </>
                        )}
                        <Input
                            placeholder="Enter new password"
                            label="New Password"
                            passwordInput
                            value={formik.values.password}
                            onValueChange={value =>
                                formik.setFieldValue('password', value)
                            }
                            errorText={
                                formik.touched.password &&
                                formik.errors.password
                            }
                        />
                        <Input
                            placeholder="Enter confirm password"
                            label="Confirm Password"
                            passwordInput
                            value={formik.values.confirm_password}
                            onValueChange={value =>
                                formik.setFieldValue('confirm_password', value)
                            }
                            errorText={
                                formik.touched.confirm_password &&
                                formik.errors.confirm_password
                            }
                        />
                        <TermsText>
                            By creating an account you agree to our
                            <TouchableOpacity
                                onPress={() =>
                                    handleExternelLink(
                                        'https://www.talentibex.com/privacy-policy/',
                                    )
                                }>
                                <TermsPolicyTxt>Terms & Privacy</TermsPolicyTxt>
                            </TouchableOpacity>
                        </TermsText>
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

const TermsText = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroySemiBold};
    margin-top: ${wp('3%')}px;
    color: ${color.black};
`;

const TermsPolicyTxt = styled.Text`
    color: ${color.primary};
    font-family: ${fonts.GilroyBold};
    margin-top: ${wp('1%')}px;
`;

const FooterBtnWrap = styled.View`
    flex-direction: ${props => (props.last ? 'column' : 'row')};
    ${props => (props.last ? `height: ${wp('32%')}px` : `height: auto`)};
    justify-content: space-between;
`;
