import React, {useState} from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';
import {ActivityIndicator, KeyboardAvoidingView} from 'react-native';
import {useFormik} from 'formik';
import * as yup from 'yup';

import Layout from '../../components/layout';
import {color} from '../../shared-components/helper';
import TabBar from '../../components/TabBar/tab-bar';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import MyApplications from './my-applications';
import MyReferrals from './my-referrals';
import FormButton from '../../shared-components/button/form-button';
import {useCheckStatus} from '../../hooks/useJobData';
import AlertModal from '../../shared-components/popups/alertModal';

const CheckStatus = ({navigation}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [errModal, setErrModal] = useState(false);
    const [errMsgs, setErrMsgs] = useState([]);

    const headerOptions = {
        heading: 'Check Status',
        drawerBtn: true,
        noBorder: true,
        noMarginBottom: true,
        noSkew: true,
        headerPara:
            'Follow the status of your respective applications by entering in below boxes.',
    };

    const formik = useFormik({
        initialValues: {
            contact_number: '',
            cnic_number: '',
            referrer_id: '',
        },
        onSubmit: values => {
            onCheckStatus(values);
        },
    });

    const tabsProps = [
        {
            title: 'My Applications',
        },
        {
            title: 'My Referrals',
        },
    ];

    const {mutate: CheckStatus, isLoading} = useCheckStatus({
        onSuccess: data => {
            if (data?.data?.status === 1) {
                const jobs =
                    activeIndex === 0
                        ? data?.data?.data
                        : data?.data?.data?.message;
                formik.resetForm();
                navigation.navigate('CheckStatusResult', {
                    jobs: jobs,
                    applied: activeIndex === 0 ? true : false,
                });
            }
        },
        onError: ({response}) => {
            setErrModal(true);
            setErrMsgs('There are some errors in the request.');
        },
    });

    const onCheckStatus = async v => {
        const formData = new FormData();
        if (activeIndex === 1) {
            formData.append('referrer_id', v.referrer_id);
        } else if (activeIndex === 0 && v.contact_number !== '') {
            formData.append('candidate_phone', v.contact_number);
        } else {
            formData.append('candidate_cnic', v.cnic_number);
        }

        await CheckStatus(formData);
    };

    const handleDisable = () => {
        if (
            activeIndex === 0 &&
            (formik.values.contact_number === '' ||
                formik.values.contact_number.length < 15) &&
            (formik.values.cnic_number === '' ||
                formik.values.cnic_number.length < 15)
        ) {
            return true;
        } else if (activeIndex === 1 && formik.values.referrer_id === '') {
            return true;
        } else {
            return false;
        }
    };
    const disableval = handleDisable();

    return (
        <>
            <KeyboardAvoidingView
                behavior="padding"
                style={{flexGrow: 1}}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -400}>
                <Layout noPadding withHeader headerOptions={headerOptions}>
                    <SkewWrapper noSidePadding bgColor={color.app_bg}>
                        <CheckStatusWrapper>
                            <TabBar
                                tabData={tabsProps}
                                activeIndex={activeIndex}
                                onChangeTab={index => [
                                    setActiveIndex(index),
                                    formik.resetForm(),
                                ]}
                            />
                            {activeIndex === 0 ? (
                                <MyApplications
                                    contactNumber={formik.values.contact_number}
                                    cnicNumber={formik.values.cnic_number}
                                    setContactNumber={value => [
                                        formik.setFieldValue(
                                            'contact_number',
                                            value,
                                        ),
                                    ]}
                                    setCnicNumber={value => [
                                        formik.setFieldValue(
                                            'cnic_number',
                                            value,
                                        ),
                                    ]}
                                />
                            ) : (
                                <MyReferrals
                                    referrerID={formik.values.referrer_id}
                                    setReferrerID={value =>
                                        formik.setFieldValue(
                                            'referrer_id',
                                            value,
                                        )
                                    }
                                />
                            )}
                        </CheckStatusWrapper>
                    </SkewWrapper>
                </Layout>
                <Layout noScroll footer>
                    <FooterBtnWrap>
                        <FormButton
                            btnText={
                                isLoading ? (
                                    <ActivityIndicator
                                        size="small"
                                        color={color.white}
                                    />
                                ) : (
                                    'Submit'
                                )
                            }
                            btnWidth="100%"
                            onClick={formik.handleSubmit}
                            disabled={disableval}
                        />
                    </FooterBtnWrap>
                </Layout>
            </KeyboardAvoidingView>
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
        </>
    );
};

const CheckStatusWrapper = styled.View``;
const FooterBtnWrap = styled.View`
    flex-direction: ${props => (props.last ? 'column' : 'row')};
    ${props => (props.last ? `height: ${wp('32%')}px` : `height: auto`)};
    justify-content: space-between;
`;

export default CheckStatus;
