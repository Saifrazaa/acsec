import React, {useContext, useEffect, useState} from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';

import Input from '../../shared-components/input/input';
import CustDatePicker from '../../shared-components/date-picker/date-picker';
import InputMask from '../../shared-components/input-mask/input-mask';
import {UserContext} from '../../context/user';
import {useCities, useEditProfile} from '../../hooks/useUserData';
import {cnicMask, phoneMask} from '../../shared-components/helper';
import AlertModal from '../../shared-components/popups/alertModal';
import {setUserToken} from '../../utils/token-manager';

const genderSelect = [
    {
        label: 'Male',
        value: 'Male',
    },
    {
        label: 'Female',
        value: 'Female',
    },
    {
        label: 'Non-binary',
        value: 'Non-binary',
    },
    {
        label: 'I prefer not to answer',
        value: 'I prefer not to answer',
    },
];

const personalSchema = yup.object({
    full_name: yup
        .string()
        .matches(/^([a-zA-Z\s])+$/, 'The name format is invalid.')
        .required('Name is required'),
    gender: yup.string().required('Gender is required').nullable(),
    dob: yup.string().required('Date of birth is required'),
    cnic: yup.string().required('Cnic is required'),
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter valid email')
        .matches(
            /^[a-zA-Z0-9@_.-]*$/,
            'Sorry, only letters (a-z), number (0-9), and periods (.) are allowed',
        ),
    phone: yup
        .string()
        .required('Contact number is required')
        .min(10, 'Invalid contact number'),
    location: yup.string().required('Location is required').nullable(),
    alternate_phone: yup.string().min(10, 'Invalid contact number'),
    summary: yup.string(),
});

const PersonalInfoEdit = ({
    handleSubmit,
    checkLoadingState,
    changeSubmitState,
}) => {
    const {user, dispatchUser} = useContext(UserContext);
    const navigation = useNavigation();

    const [gender, setGender] = useState((user && user.profile.gender) || '');
    const [dob, setDob] = useState(new Date((user && user.profile.dob) || ''));
    const [location, setLocation] = useState(
        (user && parseInt(user.profile.city_id)) || '',
    );
    const [locations, setLocations] = useState([]);
    const [successModal, setSuccessModal] = useState(false);

    const formik = useFormik({
        initialValues: {
            full_name: (user && user.profile.name) || '',
            gender: (user && user.profile.gender) || '',
            dob: (user && user.profile.dob) || '',
            cnic: (user && user.profile.cnic) || '',
            email: (user && user.profile.email) || '',
            phone: (user && user.profile.phone) || '',
            location: (user && user.profile.city_id) || '',
            alternate_phone: (user && user.profile.alternate_phone) || '',
            summary: (user && user.profile.summary) || '',
        },
        validationSchema: personalSchema,
        onSubmit: values => {
            EditProfile({
                full_name: values.full_name,
                gender: values.gender,
                cnic: values.cnic,
                phone: '0' + values.phone,
                alternate_phone: '0' + values.alternate_phone,
                city_id: values.location,
                summary: values.summary,
                dob: values.dob,
            });
        },
    });

    // Fetch cities
    const {isFetching: isLocationFetching} = useCities({
        onSuccess: data => {
            const cities = data?.data?.data?.details.map(key => {
                return {
                    label: key.name,
                    value: key.term_id,
                };
            });
            setLocations(cities);
        },
        onError: err => {
            console.log('Error', err);
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
            const userData = {
                ...user,
                name: formik.values.full_name,
                email: formik.values.email,
                phone: formik.values.phone,
                summary: formik.values.summary,
                profile: {
                    ...user.profile,
                    name: formik.values.full_name,
                    email: formik.values.email,
                    dob: formik.values.dob,
                    summary: formik.values.summary,
                    cnic: formik.values.cnic,
                    city_id: formik.values.location,
                    gender: formik.values.gender,
                    phone: formik.values.phone,
                    alternate_phone: formik.values.alternate_phone,
                },
            };
            setUserToken({token: user.token, userData});
            dispatchUser({
                type: 'SET_USER',
                user: userData,
            });
        },
        onError: err => {
            console.log('Error', err.response.data);
        },
    });

    const onChange = selectedDate => {
        setDob(selectedDate);
        formik.setFieldValue('dob', selectedDate);
    };

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
                    placeholder="Full Name"
                    label="Full Name"
                    value={formik.values.full_name}
                    onValueChange={value => [
                        formik.setFieldValue('full_name', value),
                    ]}
                    errorText={
                        (formik.touched.full_name && formik.errors.full_name) ||
                        error?.response?.data?.data?.details?.full_name
                    }
                />
                <CustSelect
                    label="Gender"
                    placeholder="Select Gender"
                    value={gender}
                    options={genderSelect}
                    onValueChange={val => [
                        setGender(val),
                        formik.setFieldValue('gender', val),
                    ]}
                    errorText={
                        (formik.touched.gender && formik.errors.gender) ||
                        error?.response?.data?.data?.details?.gender
                    }
                />
                <CustDatePicker
                    label="Date of Birth"
                    date={(dob && dob !== '' && dob) || new Date()}
                    onChange={onChange}
                    errorText={error?.response?.data?.data?.details?.dob}
                    isDob
                />
                <InputMask
                    label="CNIC Number"
                    placeholder="xxxxx-xxxxxxx-x"
                    value={formik.values.cnic}
                    onValueChange={value => [
                        formik.setFieldValue('cnic', value),
                    ]}
                    errorText={
                        (formik.touched.cnic && formik.errors.cnic) ||
                        error?.response?.data?.data?.details?.cnic
                    }
                    keyboardType="phone-pad"
                    mask={cnicMask}
                />
                <Input
                    placeholder="Enter email address"
                    label="Email Address"
                    keyboardType="email-address"
                    value={formik.values.email}
                    onValueChange={value => [
                        formik.setFieldValue('email', value),
                    ]}
                    errorText={
                        (formik.touched.email && formik.errors.email) ||
                        error?.response?.data?.data?.details?.email
                    }
                />
                <InputMask
                    label="Contact Number"
                    placeholder="+92 ___ _______"
                    value={formik.values.phone}
                    onValueChange={(masked, unmasked) => {
                        formik.setFieldValue('phone', unmasked);
                    }}
                    keyboardType="phone-pad"
                    mask={phoneMask}
                    errorText={
                        (formik.touched.phone && formik.errors.phone) ||
                        error?.response?.data?.data?.details?.phone
                    }
                />
                <InputMask
                    label="Alternate Contact Number"
                    placeholder="+92 ___ _______"
                    value={formik.values.alternate_phone}
                    onValueChange={(masked, unmasked) =>
                        formik.setFieldValue('alternate_phone', unmasked)
                    }
                    keyboardType="phone-pad"
                    prefix={['+', '9', '2']}
                    mask={phoneMask}
                    errorText={
                        (formik.touched.alternate_phone &&
                            formik.errors.alternate_phone) ||
                        error?.response?.data?.data?.details?.alternate_phone
                    }
                />
                <CustSelect
                    label="Location"
                    placeholder="Select Location"
                    value={location}
                    options={locations}
                    onValueChange={val => [
                        setLocation(val),
                        formik.setFieldValue('location', val),
                    ]}
                    errorText={
                        (formik.touched.location && formik.errors.location) ||
                        error?.response?.data?.data?.details?.city_id
                    }
                    isLoading={isLocationFetching}
                />
                <Input
                    label="Summary"
                    placeholder="Write something about you..."
                    multiline
                    noflines={5}
                    value={formik.values.summary}
                    onValueChange={value =>
                        formik.setFieldValue('summary', value)
                    }
                    errorText={
                        (formik.touched.summary && formik.errors.summary) ||
                        error?.response?.data?.data?.details?.summary
                    }
                />
            </Wrapper>

            <AlertModal
                title="Congratulations"
                text={`Your profile is successfully updated`}
                btnText="Got it"
                isVisible={successModal}
                onClose={() => [setSuccessModal(false), navigation.goBack()]}
                onClickBtn={() => [setSuccessModal(false), navigation.goBack()]}
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

export default PersonalInfoEdit;
