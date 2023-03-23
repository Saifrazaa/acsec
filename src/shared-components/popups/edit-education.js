import React, {useState, useEffect} from 'react';
import {ActivityIndicator, Modal, ScrollView, StyleSheet} from 'react-native';
import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useFormik} from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import Input from '../../shared-components/input/input';

import {color, fonts, Iconsizes, sizes} from '../helper';
import FormButton from '../button/form-button';
import SkewWrapper from '../skew-wrapper/skew-wrapper';
import CustDatePicker from '../../shared-components/date-picker/date-picker';
import Icon from 'react-native-fontawesome-pro';
import {useCities, useEduDelete, useEduUpdate} from '../../hooks/useUserData';
import CheckBox from '@react-native-community/checkbox';

const eduSchema = yup.object({
    degree_title: yup.string().required('Qualification is required').nullable(),
    program: yup.string().required('Program is required'),
    location: yup.string().required('Location is required').nullable(),
    institute: yup.string().required('Institute name is required'),
});

const EditEducationPopup = ({
    isVisible,
    onClose,
    noButton,
    eduData,
    onUpdate,
}) => {
    const [visible, setVisible] = useState(false);
    const [qualification, setQualification] = useState('');
    const [location, setLocation] = useState('');
    const [locations, setLocations] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [currentStudying, setCurrentStuding] = useState(false);

    const formik = useFormik({
        initialValues: {
            degree_title: '',
            program: '',
            location: '',
            institute: '',
        },
        validationSchema: eduSchema,
        onSubmit: values => {
            EduUpdate({
                education_id: eduData !== undefined ? eduData.ID : '',
                degree_title: values.degree_title,
                program: values.program,
                institute: values.institute,
                city: values.location,
                start_year: moment(startDate).format('YYYY'),
                end_year: moment(endDate).format('YYYY'),
                currently_studying: currentStudying,
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

    // Add/Update Experience
    const {
        mutate: EduUpdate,
        isLoading,
        error,
    } = useEduUpdate({
        onSuccess: () => {
            onUpdate();
            onClose();
        },
        onError: ({response}) => {
            console.log('Error', response.data);
        },
    });

    // Delete Experience
    const {mutate: EduDelete, isLoading: EduDeleting} = useEduDelete({
        onSuccess: () => {
            onUpdate();
            onClose();
        },
        onError: ({response}) => {
            console.log('Error', response.data);
        },
    });

    useEffect(() => {
        setVisible(isVisible);

        if (eduData !== undefined && Object.keys(eduData).length > 0) {
            setQualification(eduData.degree_title);
            setLocation(parseInt(eduData.city));
            setStartDate(new Date(eduData?.start_year + '-08-01'));
            setEndDate(new Date(eduData?.end_year + '-05-01'));
            setCurrentStuding(eduData.currently_studying !== '0');
            formik.setFieldValue('program', eduData.program);
            formik.setFieldValue('institute', eduData.institute);
            formik.setFieldValue('location', eduData.city);
        }

        return () => {
            setQualification('');
            setLocation('');
            setStartDate(new Date());
            setEndDate(new Date());
            setCurrentStuding(false);
            formik.resetForm();
        };
    }, [isVisible, eduData]);

    const qualificationType = [
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
            label: 'Mastes',
            value: 'Mastes',
        },
        {
            label: 'M.Phil',
            value: 'M.Phil',
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
    ];

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent
                visible={visible}
                onRequestClose={onClose}>
                <ModalWrapper visible={visible} />
                <ModalWrap
                    style={{
                        backgroundColor: `${color.white}`,
                        position: 'absolute',
                        bottom: 0,
                        width: '100%',
                        height: 'auto',
                        shadowColor: '#E8E8E8',
                        shadowOffset: {
                            width: 0,
                            height: 1,
                        },
                        shadowOpacity: 0.2,
                        shadowRadius: 1.41,
                        elevation: 4,
                    }}>
                    <CloseIcon onPress={onClose}>
                        <Icon name="xmark" color={color.gray_text} />
                    </CloseIcon>
                    <SkewWrapper bgColor={color.white} noSidePadding>
                        <ScrollView style={styles.scrollView}>
                            <ModalInfoWrap>
                                <Input
                                    placeholder="Enter College Name"
                                    label="Institute Name"
                                    value={formik.values.institute}
                                    onValueChange={value =>
                                        formik.setFieldValue('institute', value)
                                    }
                                    errorText={
                                        (formik.touched.institute &&
                                            formik.errors.institute) ||
                                        error?.response?.data?.data?.details
                                            ?.institute
                                    }
                                />
                                <CustSelect
                                    label="Qualification Type"
                                    placeholder="Select Qualification"
                                    value={qualification}
                                    options={qualificationType}
                                    onValueChange={val => [
                                        setQualification(val),
                                        formik.setFieldValue(
                                            'degree_title',
                                            val,
                                        ),
                                    ]}
                                    errorText={
                                        (formik.touched.degree_title &&
                                            formik.errors.degree_title) ||
                                        error?.response?.data?.data?.details
                                            ?.degree_title
                                    }
                                />
                                <Input
                                    placeholder="Enter your Program"
                                    label="Program Name"
                                    value={formik.values.program}
                                    onValueChange={value =>
                                        formik.setFieldValue('program', value)
                                    }
                                    errorText={
                                        (formik.touched.program &&
                                            formik.errors.program) ||
                                        error?.response?.data?.data?.details
                                            ?.program
                                    }
                                />
                                <CustSelect
                                    label="City"
                                    placeholder="Select City"
                                    value={location}
                                    options={locations}
                                    onValueChange={val => [
                                        setLocation(val),
                                        formik.setFieldValue('location', val),
                                    ]}
                                    errorText={
                                        (formik.touched.location &&
                                            formik.errors.location) ||
                                        error?.response?.data?.data?.details
                                            ?.location
                                    }
                                    isLoading={isLocationFetching}
                                />
                                <CustDatePicker
                                    date={startDate}
                                    onChange={val => setStartDate(val)}
                                    errorText={
                                        error?.response?.data?.data?.details
                                            ?.start_date
                                    }
                                    label="Start Date"
                                />
                                <CustDatePicker
                                    date={endDate}
                                    onChange={val => setEndDate(val)}
                                    label="End Date"
                                    errorText={
                                        error?.response?.data?.data?.details
                                            ?.end_date
                                    }
                                    disabled={currentStudying}
                                />
                                <CheckBoxWrap
                                    onPress={() =>
                                        setCurrentStuding(!currentStudying)
                                    }>
                                    <CheckBox
                                        value={currentStudying}
                                        onValueChange={newValue =>
                                            setCurrentStuding(newValue)
                                        }
                                        tintColors={{
                                            true: color.primary,
                                            false: color.inputBorder,
                                        }}
                                        style={{
                                            width: 17,
                                            height: 17,
                                            marginRight:
                                                Platform.OS === 'ios' ? 0 : 10,
                                        }}
                                        tintColor={color.inputBorder}
                                        onFillColor={color.primary}
                                        onCheckColor={color.white}
                                        onTintColor={color.primary}
                                    />
                                    <CheckBoxText>
                                        I'm currently studying
                                    </CheckBoxText>
                                </CheckBoxWrap>
                            </ModalInfoWrap>
                        </ScrollView>
                    </SkewWrapper>

                    {!noButton && (
                        <ModalButtonWrap
                            style={[
                                {
                                    backgroundColor: color.white,
                                    borderTopRightRadius: wp('8%'),
                                    borderTopLeftRadius: wp('8%'),
                                    shadowColor: color.black,
                                    shadowOffset: {
                                        width: 0,
                                        height: -5,
                                    },
                                    shadowOpacity: 0.03,
                                    shadowRadius: 4,
                                    elevation: 20,
                                    padding: wp('5%'),
                                    marginTop: wp('10%'),
                                },
                            ]}>
                            {eduData !== undefined && (
                                <FormButton
                                    bgColor={color.lightest_gray}
                                    btnWidth={'29%'}
                                    btnText={
                                        EduDeleting ? (
                                            <ActivityIndicator
                                                color={color.primary}
                                                size="small"
                                            />
                                        ) : (
                                            'Delete'
                                        )
                                    }
                                    color={color.black}
                                    onClick={() =>
                                        EduDelete({education_id: eduData?.ID})
                                    }
                                />
                            )}
                            <FormButton
                                btnWidth={
                                    eduData !== undefined ? '69%' : '100%'
                                }
                                btnText={
                                    isLoading ? (
                                        <ActivityIndicator
                                            color={color.white}
                                            size="small"
                                        />
                                    ) : eduData !== undefined ? (
                                        'Update'
                                    ) : (
                                        'Save'
                                    )
                                }
                                onClick={formik.handleSubmit}
                            />
                        </ModalButtonWrap>
                    )}
                </ModalWrap>
            </Modal>
        </>
    );
};

export default EditEducationPopup;

const ModalWrapper = styled.View`
    background-color: ${color.black}4D;
    position: absolute;
    top: 0;
    ${props => {
        if (props.visible) {
            return `
                height: ${hp('100%')}px;
                width: ${wp('100%')}px;
            `;
        }
    }}
`;

const ModalWrap = styled.View`
    min-height: ${hp('70%')}px;
    border-top-right-radius: ${wp('8%')}px;
    border-top-left-radius: ${wp('8%')}px;
`;

const ModalInfoWrap = styled.View`
    padding: 0 ${wp('7%')}px;
    margin-bottom: ${wp('15%')}px;
`;

const ModalButtonWrap = styled.View`
    flex-direction: row;
    height: auto;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    width: 100%;
`;

const CheckBoxWrap = styled.TouchableOpacity`
    flex-direction: row;
    align-items: center;
`;

const CheckBoxText = styled.Text`
    margin-left: ${wp('2%')}px;
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyRegular};
    color: ${color.black};
`;

const CloseIcon = styled.TouchableOpacity`
    position: absolute;
    right: ${wp('6%')}px;
    top: ${wp('-8%')}px;
    z-index: 99;
`;

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        height: hp('60%'),
        marginTop: wp('15%'),
    },
});
