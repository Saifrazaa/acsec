import React from 'react';
import styled from 'styled-components';
import {useFormik} from 'formik';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {WebView} from 'react-native-webview';

import Layout from '../../components/layout';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import {color} from '../../shared-components/helper';
import FormButton from '../../shared-components/button/form-button';
import {useRoute} from '@react-navigation/native';

const ApplyProgram = () => {
    const route = useRoute();
    const {program} = route.params;

    const formik = useFormik({
        initialValues: {
            fullname: '',
            phone: '',
            email: '',
            dob: '',
            semester: '',
            city: '',
        },
        onSubmit: values => {
            console.log(values);
        },
    });

    const headerOptions = {
        featuredProgramme: program,
        programmePage: true,
        exploreBtn: false,
        backBtn: true,
        noBorder: true,
        noSkew: true,
    };

    return (
        <>
            <Layout
                noPadding
                bgColor={color.white}
                withHeader
                headerOptions={headerOptions}>
                <SkewWrapper bgColor={color.white}>
                    <ApplyFormWrapper>
                        <WebView source={{uri: 'https://reactnative.dev/'}} />
                    </ApplyFormWrapper>
                </SkewWrapper>
            </Layout>
            <Layout noScroll footer bgColor={color.white}>
                <FooterBtnWrap>
                    <FormButton
                        btnText="Submit"
                        btnWidth="100%"
                        onClick={() => console.log('form submitted')}
                    />
                </FooterBtnWrap>
            </Layout>
        </>
    );
};

const ApplyFormWrapper = styled.View`
    /* padding: ${wp('7%')}px; */
`;

const FooterBtnWrap = styled.View`
    flex-direction: row;
    height: auto;
    justify-content: space-between;
`;

export default ApplyProgram;
