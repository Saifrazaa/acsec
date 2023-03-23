import React, {useState, useEffect} from 'react';
import {
    ActivityIndicator,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
} from 'react-native';
import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useFormik} from 'formik';
import * as yup from 'yup';
import CheckBox from '@react-native-community/checkbox';

import Input from '../../shared-components/input/input';
import {color, fonts, Iconsizes, sizes} from '../helper';
import FormButton from '../button/form-button';
import SkewWrapper from '../skew-wrapper/skew-wrapper';
import CustDatePicker from '../../shared-components/date-picker/date-picker';
import Icon from 'react-native-fontawesome-pro';
import {
    useCities,
    useEmpTypes,
    useExpDelete,
    useExpUpdate,
} from '../../hooks/useUserData';
import moment from 'moment';

const expSchema = yup.object({
    title: yup
        .string()
        .matches(/^([a-zA-Z\s])+$/, 'The title format is invalid.')
        .required('Title is required'),
    employment_type: yup
        .string()
        .required('Employment Type is required')
        .nullable(),
    location: yup.string().required('Location is required').nullable(),
    company_name: yup.string().required('Company name is required'),
});

const EditExpPopup = ({isVisible, onClose, noButton, expData, onUpdate}) => {
    const [visible, setVisible] = useState(false);
    const [empType, setEmpType] = useState('');
    const [empTypes, setEmpTypes] = useState([]);
    const [location, setLocation] = useState('');
    const [locations, setLocations] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [currentWork, setCurrentWork] = useState(false);

    const formik = useFormik({
        initialValues: {
            title: '',
            employment_type: '',
            location: '',
            company_name: '',
        },
        validationSchema: expSchema,
        onSubmit: values => {
            ExpUpdate({
                experience_id: expData !== undefined ? expData.ID : '',
                title: values.title,
                employment_type: values.employment_type,
                company_name: values.company_name,
                location: values.location,
                start_date: moment(startDate).format('YYYY-MM-DD'),
                end_date: moment(endDate).format('YYYY-MM-DD'),
                currently_working: currentWork,
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
    // Fetch Emp Types
    const {isFetching: isEmpFetching} = useEmpTypes({
        onSuccess: data => {
            const types = data?.data?.data?.details.map(key => {
                return {
                    label: key,
                    value: key,
                };
            });
            setEmpTypes(types);
        },
        onError: err => {
            console.log('Error', err);
        },
    });

    // Add/Update Experience
    const {
        mutate: ExpUpdate,
        isLoading,
        error,
    } = useExpUpdate({
        onSuccess: () => {
            onUpdate();
            onClose();
        },
        onError: ({response}) => {
            console.log('Error', response.data);
        },
    });

    // Delete Experience
    const {mutate: ExpDelete, isLoading: ExpDeleting} = useExpDelete({
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

        if (expData !== undefined && Object.keys(expData).length > 0) {
            setEmpType(expData.employment_type);
            setLocation(parseInt(expData.city));
            setStartDate(new Date(expData?.startdate));
            setEndDate(new Date(expData?.enddate));
            setCurrentWork(expData.currently_working !== '0');
            formik.setFieldValue('title', expData.job_title);
            formik.setFieldValue('company_name', expData.company_name);
        }

        return () => {
            setEmpType('');
            setLocation('');
            setStartDate(new Date());
            setEndDate(new Date());
            setCurrentWork(false);
            formik.resetForm();
        };
    }, [isVisible, expData]);

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                statusBarTranslucent
                visible={visible}
                onRequestClose={() => [onClose(), formik.resetForm()]}>
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
                    <CloseIcon onPress={() => [onClose(), formik.resetForm()]}>
                        <Icon name="xmark" color={color.gray_text} />
                    </CloseIcon>
                    <SkewWrapper bgColor={color.white} noSidePadding>
                        <ScrollView style={styles.scrollView}>
                            <ModalInfoWrap>
                                <Input
                                    placeholder="Analyst Software Engineer"
                                    label="Title"
                                    value={formik.values.title}
                                    onValueChange={value =>
                                        formik.setFieldValue('title', value)
                                    }
                                    errorText={
                                        (formik.touched.title &&
                                            formik.errors.title) ||
                                        error?.response?.data?.data?.details
                                            ?.title
                                    }
                                />
                                <CustSelect
                                    label="Employment Type"
                                    placeholder="Select Employment Type"
                                    value={empType}
                                    options={empTypes}
                                    onValueChange={val => [
                                        setEmpType(val),
                                        formik.setFieldValue(
                                            'employment_type',
                                            val,
                                        ),
                                    ]}
                                    errorText={
                                        (formik.touched.employment_type &&
                                            formik.errors.employment_type) ||
                                        error?.response?.data?.data?.details
                                            ?.employment_type
                                    }
                                    isLoading={isEmpFetching}
                                />
                                <Input
                                    placeholder="ibex Global"
                                    label="Organization"
                                    value={formik.values.company_name}
                                    onValueChange={value =>
                                        formik.setFieldValue(
                                            'company_name',
                                            value,
                                        )
                                    }
                                    errorText={
                                        (formik.touched.company_name &&
                                            formik.errors.company_name) ||
                                        error?.response?.data?.data?.details
                                            ?.company_name
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
                                        (formik.touched.location &&
                                            formik.errors.location) ||
                                        error?.response?.data?.data?.details
                                            ?.location
                                    }
                                    isLoading={isLocationFetching}
                                />
                                <CustDatePicker
                                    date={startDate}
                                    onChange={val => [setStartDate(val)]}
                                    label="Start Date"
                                    errorText={
                                        error?.response?.data?.data?.details
                                            ?.start_date
                                    }
                                />
                                <CustDatePicker
                                    date={endDate}
                                    onChange={val => [setEndDate(val)]}
                                    label="End Date"
                                    errorText={
                                        error?.response?.data?.data?.details
                                            ?.end_date
                                    }
                                    disabled={currentWork}
                                />
                                <CheckBoxWrap
                                    onPress={() => [
                                        setCurrentWork(!currentWork),
                                    ]}>
                                    <CheckBox
                                        value={currentWork}
                                        tintColors={{
                                            true: color.primary,
                                            false: color.inputBorder,
                                        }}
                                        onValueChange={newValue =>
                                            setCurrentWork(newValue)
                                        }
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
                                        I'm currently working here
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
                            {expData !== undefined && (
                                <FormButton
                                    bgColor={color.lightest_gray}
                                    btnWidth={'29%'}
                                    btnText={
                                        ExpDeleting ? (
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
                                        ExpDelete({experience_id: expData?.ID})
                                    }
                                />
                            )}
                            <FormButton
                                btnWidth={
                                    expData !== undefined ? '69%' : '100%'
                                }
                                btnText={
                                    isLoading ? (
                                        <ActivityIndicator
                                            color={color.white}
                                            size="small"
                                        />
                                    ) : expData !== undefined ? (
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

export default EditExpPopup;

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
