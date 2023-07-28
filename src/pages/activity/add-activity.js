import React, {useContext, useState} from 'react';
import Layout from '../../components/layout';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Input from '../../shared-components/input/input';
import FormButton from '../../shared-components/button/form-button';
import {color} from '../../shared-components/helper';
import CustDatePicker from '../../shared-components/date-picker/date-picker';
import {useFormik} from 'formik';
import * as yup from 'yup';
import database from '@react-native-firebase/database';
import {UserContext} from '../../context/user';
import CustSelect from '../../shared-components/select/select';

const activitySchema = yup.object({
    activity: yup.string().required('Activity Detail is required.'),
    date: yup.string().required('Date is required.'),
    type: yup.string().required('Activity Type is required.'),
});

const AddActivity = () => {
    const {user} = useContext(UserContext);

    const formik = useFormik({
        initialValues: {
            activity: '',
            date: new Date(),
            type: '',
        },
        validationSchema: activitySchema,
        onSubmit: values => {
            onAddActivity(values);
        },
    });

    const onAddActivity = () => {
        database()
            .ref(`/activities/${user.phone_no}`)
            .push({
                activity: formik.values.activity,
                completed: false,
                date: formik.values.date.toString(),
                type: formik.values.type,
            })
            .then(() => {
                alert('Activity Created');
                formik.resetForm();
            });
    };

    const headerOptions = {
        heading: 'Add Activity',
        subHeading: 'Enter the details of your new activity.',
        drawerBtn: true,
    };

    const types = [
        {
            label: 'Once',
            value: 'Once',
        },
        {
            label: 'Regular',
            value: 'Regular',
        },
    ];

    return (
        <>
            <Layout withHeader headerOptions={headerOptions}>
                <Wrapper>
                    <Input
                        placeholder="What is Your Activity"
                        label="Activity"
                        multiline
                        noflines={5}
                        value={formik.values.activity}
                        onValueChange={val =>
                            formik.setFieldValue('activity', val)
                        }
                        errorText={
                            formik.touched.activity && formik.errors.activity
                        }
                    />
                    <CustSelect
                        label="Type"
                        placeholder="Select Activity Type"
                        value={formik.values.type}
                        options={types}
                        onValueChange={value =>
                            formik.setFieldValue('type', value)
                        }
                        errorText={formik.touched.type && formik.errors.type}
                    />
                    <CustDatePicker
                        date={formik.values.date}
                        onChange={val => formik.setFieldValue('date', val)}
                        label="Activity Date"
                        errorText={formik.touched.date && formik.errors.date}
                    />
                </Wrapper>
            </Layout>
            <Layout noScroll footer bgColor={color.white}>
                <FooterBtnWrap>
                    <FormButton
                        btnText="Add New Activity"
                        btnWidth="100%"
                        onClick={formik.handleSubmit}
                    />
                </FooterBtnWrap>
            </Layout>
        </>
    );
};

const Wrapper = styled.View`
    padding: 0 ${wp('5%')}px;
`;

const FooterBtnWrap = styled.View`
    flex-direction: ${props => (props.last ? 'column' : 'row')};
    ${props => (props.last ? `height: ${wp('32%')}px` : `height: auto`)};
    justify-content: space-between;
`;

export default AddActivity;
