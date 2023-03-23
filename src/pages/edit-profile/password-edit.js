import React, {useContext, useEffect, useState} from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';

import Input from '../../shared-components/input/input';
import {UserContext} from '../../context/user';
import {useEditProfile} from '../../hooks/useUserData';
import AlertModal from '../../shared-components/popups/alertModal';

const newPswrdSchema = yup.object({
    old_password: yup.string().required('Current password is required'),
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

const PasswordEdit = ({handleSubmit, checkLoadingState, changeSubmitState}) => {
    const {user, dispatchUser} = useContext(UserContext);
    const navigation = useNavigation();

    const [errorOldPass, setErrorOldPass] = useState('');
    const [successModal, setSuccessModal] = useState(false);

    const formik = useFormik({
        initialValues: {
            old_password: '',
            password: '',
            confirm_password: '',
        },
        validationSchema: newPswrdSchema,
        onSubmit: values => {
            if (values.old_password !== user.password) {
                setErrorOldPass('Current password is incorrect');
            } else {
                EditProfile({
                    full_name: user.profile.name,
                    gender: user.profile.gender,
                    cnic: user.profile.cnic,
                    phone: user.profile.phone,
                    alternate_phone: user.profile.alternate_phone,
                    city_id: user.profile.city_id,
                    summary: user.profile.summary,
                    dob: user.profile.dob,
                    password: values.password,
                    confirm_password: values.confirm_password,
                });
            }
        },
    });

    // Edit Profile
    const {
        mutate: EditProfile,
        isLoading,
        error,
    } = useEditProfile({
        onSuccess: data => {
            setSuccessModal(true);

            dispatchUser({
                type: 'SET_USER',
                user: {
                    ...user,
                    password: formik.values.password,
                },
            });
        },
        onError: err => {
            console.log('Error', err.response.data);
        },
    });

    useEffect(() => {
        if (handleSubmit) {
            formik.handleSubmit();
            changeSubmitState(false);
        }
    }, [handleSubmit]);

    checkLoadingState(isLoading);

    return (
        <>
            <Wrapper>
                <Input
                    placeholder="Enter Current Password"
                    label="Current Password"
                    passwordInput
                    value={formik.values.old_password}
                    onValueChange={value => [
                        formik.setFieldValue('old_password', value),
                        setErrorOldPass(''),
                    ]}
                    errorText={
                        (formik.touched.old_password &&
                            formik.errors.old_password) ||
                        errorOldPass
                    }
                />
                <Input
                    placeholder="Enter New Password"
                    label="New Password"
                    passwordInput
                    value={formik.values.password}
                    onValueChange={value => [
                        formik.setFieldValue('password', value),
                    ]}
                    errorText={
                        (formik.touched.password && formik.errors.password) ||
                        error?.response?.data?.data?.details?.password
                    }
                />
                <Input
                    placeholder="Confirm Your Password"
                    label="Confirm Password"
                    passwordInput
                    value={formik.values.confirm_password}
                    onValueChange={value => [
                        formik.setFieldValue('confirm_password', value),
                    ]}
                    errorText={
                        (formik.touched.confirm_password &&
                            formik.errors.confirm_password) ||
                        error?.response?.data?.data?.details?.confirm_password
                    }
                />
            </Wrapper>

            <AlertModal
                title="Congratulations"
                text={`Your password is successfully updated`}
                btnText="Got it"
                isVisible={successModal}
                onClose={() => [
                    setSuccessModal(false),
                    formik.resetForm(),
                    navigation.goBack(),
                ]}
                onClickBtn={() => [
                    setSuccessModal(false),
                    formik.resetForm(),
                    navigation.goBack(),
                ]}
            />
        </>
    );
};

const Wrapper = styled.View`
    width: ${wp('100%')}px;
    padding: 0 ${wp('5%')}px;
`;

const BtnWrap = styled.View`
    padding-vertical: ${wp('5%')}px;
`;

export default PasswordEdit;
