import React, {useMemo, useState} from 'react';
import styled from 'styled-components';
import {KeyboardAvoidingView, Platform, Text, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as Animatable from 'react-native-animatable';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import AutocompleteInput from 'react-native-autocomplete-input';
import moment from 'moment';

import Layout from '../layout';
import CustSelect from '../../shared-components/select/select';
import Input from '../../shared-components/input/input';
import InputMask from '../../shared-components/input-mask/input-mask';
import {cnicMask, color, fonts} from '../../shared-components/helper';
import SocialLogin from '../social-login/social-login';
import CustDatePicker from '../../shared-components/date-picker/date-picker';
import FormButton from '../../shared-components/button/form-button';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import RegisterHeader from './registration-header';
import {useCities} from '../../hooks/useUserData';
import Seperator from '../seperator/seperator';
import SearchableSelect from '../../shared-components/select/searchable-select';

const registerSchema = yup.object({
    full_name: yup
        .string()
        .required('Full Name is required')
        .matches(/^([a-zA-Z\s])+$/, 'The name format is invalid'),
    gender: yup.string().required('Please select your gender').nullable(),
    dob: yup.date().required('Please select Date of Birth'),
    cnic: yup.string().min(14, 'Please enter valid CNIC'),
    city_id: yup.number().required('Please select your city').nullable(),
    education: yup.string().required('Please select your qualification'),
});

export const RegisterStep1 = ({
    handleNextSlide,
    userData,
    setUserData,
    activeIndex,
}) => {
    const navigation = useNavigation();
    const [locations, setLocations] = useState([]);
    const [date, setDate] = useState(
        new Date(moment().subtract(18, 'years').calendar()),
    );
    const [query, setQuery] = useState('');
    const queriedLocations = useMemo(
        () => filterMovies(locations, query),
        [locations, query],
    );

    function filterMovies(movies, query) {
        if (!query || !movies.length) {
            return [];
        }

        const regex = new RegExp(`${query.trim()}`, 'i');
        return movies.filter(movie => movie.label.search(regex) >= 0);
    }

    function compareTitle(title) {
        return query.toLowerCase() === title.toLowerCase().trim();
    }

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
    const formik = useFormik({
        initialValues: {
            full_name: userData.full_name,
            gender: userData.gender,
            dob: userData.dob || date,
            cnic: userData.cnic,
            city_id: userData.city_id,
            education: userData.education,
        },
        validationSchema: registerSchema,

        onSubmit: values => {
            const data = {
                ...userData,
                full_name: values.full_name,
                gender: values.gender,
                dob: values.dob,
                cnic: values.cnic,
                city_id: values.city_id,
                education: values.education,
            };
            setUserData(data);
            handleNextSlide();
        },
    });
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
    const qualifications = [
        {
            label: 'Matriculation',
            value: 'Matriculation',
        },
        {
            label: 'Intermediate',
            value: 'Intermediate',
        },
        {
            label: 'Bachelors',
            value: 'Bachelors',
        },
        {
            label: 'Masters',
            value: 'Masters',
        },
        {
            label: 'M.Phil',
            value: 'M.phil',
        },
        {
            label: 'ph.D',
            value: 'ph.D',
        },
        {
            label: 'Diploma',
            value: 'Diploma',
        },
        {
            label: 'Certification',
            value: 'Certification',
        },
        {
            label: 'Other',
            value: 'Other',
        },
    ];
    const onChange = selectedDate => {
        setDate(selectedDate);
        formik.setFieldValue('dob', selectedDate);
    };

    return (
        <>
            <KeyboardAvoidingView
                behavior="padding"
                style={{flexGrow: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -400}>
                <Layout noPadding bgColor={color.white}>
                    <RegisterHeader activeStep={activeIndex} />
                    <SkewWrapper>
                        {/* <SocialLogin />
                        <Seperator text="or register with" /> */}
                        <Input
                            placeholder="Enter Full Name"
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
                        <CustSelect
                            label="Gender"
                            placeholder="Select Gender"
                            value={formik.values.gender}
                            options={genderSelect}
                            onValueChange={value =>
                                formik.setFieldValue('gender', value)
                            }
                            errorText={
                                formik.touched.gender && formik.errors.gender
                            }
                        />

                        <CustDatePicker
                            label="Date of Birth"
                            date={date}
                            onChange={onChange}
                            isDob
                        />
                        <InputMask
                            label="CNIC Number"
                            placeholder="xxxxx-xxxxxxx-x"
                            value={formik.values.cnic}
                            onValueChange={value =>
                                formik.setFieldValue('cnic', value)
                            }
                            keyboardType="phone-pad"
                            mask={cnicMask}
                            errorText={
                                formik.touched.cnic && formik.errors.cnic
                            }
                        />
                        <SearchableSelect
                            label="Location"
                            isLoading={isLocationFetching}
                            data={locations}
                            errorText={
                                formik.touched.city_id && formik.errors.city_id
                            }
                            onValueChange={value =>
                                formik.setFieldValue('city_id', value)
                            }
                            value={formik.values.city_id}
                        />
                        {/* <CustSelect
                            label="Location"
                            placeholder="Select Location"
                            value={formik.values.city_id}
                            options={locations}
                            onValueChange={value =>
                                formik.setFieldValue('city_id', value)
                            }
                            errorText={
                                formik.touched.city_id && formik.errors.city_id
                            }
                            isLoading={isLocationFetching}
                        /> */}
                        {/* <View style={{position: 'relative'}}>
                            <View
                                style={{
                                    flex: 1,
                                    left: 0,
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    zIndex: 1,
                                }}>
                                <AutocompleteInput
                                    editable={!isLocationFetching}
                                    autoCorrect={false}
                                    data={queriedLocations}
                                    value={query}
                                    onChangeText={text => setQuery(text)}
                                    placeholder="Select Location"
                                    flatListProps={{
                                        keyExtractor: (_, idx) => idx,
                                        renderItem: ({item}) => (
                                            <Text>{item.label}</Text>
                                        ),
                                    }}
                                />
                            </View>
                        </View> */}

                        <CustSelect
                            label="Qualification"
                            placeholder="Select Qualification"
                            value={formik.values.education}
                            options={qualifications}
                            onValueChange={value =>
                                formik.setFieldValue('education', value)
                            }
                            errorText={
                                formik.touched.education &&
                                formik.errors.education
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
                                onClick={() => navigation.navigate('Login')}
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
