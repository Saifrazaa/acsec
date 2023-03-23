import React from 'react';
import {color, fonts, sizes} from '../../shared-components/helper';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import JobCardApplied from '../../components/job-card/job-card-applied';
import Layout from '../../components/layout';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import FormButton from '../../shared-components/button/form-button';
import {useRoute} from '@react-navigation/native';
import NotFound from '../../components/not-found/not-found';

const headerOptions = {
    heading: 'Check Status',
    drawerBtn: true,
    noBorder: true,
    noSkew: true,
};

const CheckStatusResult = ({navigation}) => {
    const route = useRoute();
    const {jobs, applied} = route?.params;

    return (
        <>
            <Layout
                noPadding
                bgColor={color.white}
                withHeader
                headerOptions={headerOptions}>
                <SkewWrapper bgColor={color.white}>
                    {jobs && typeof jobs === 'object' && jobs.length > 0 && (
                        <>
                            <ResultLabel>
                                {jobs.length} Results found
                            </ResultLabel>
                            {jobs.map((item, index) => {
                                return (
                                    <JobCardApplied
                                        key={index}
                                        title={item.job_title}
                                        jobStatus={item.short_status}
                                        jobApplied={applied}
                                        jobRefered={!applied}
                                        onPress={() => {}}
                                    />
                                );
                            })}
                        </>
                    )}
                    {jobs && (typeof jobs === 'string' || jobs.message) && (
                        <NotFound
                            title="No Job Found"
                            para=" There is no job/referral found based on the
                            details you have entered."
                        />
                    )}
                </SkewWrapper>
            </Layout>
            <Layout noScroll footer>
                <FooterBtnWrap>
                    <FormButton
                        btnBorder
                        borderColor={color.primary}
                        bgColor={color.white}
                        color={color.primary}
                        btnText="Back to Check Status"
                        btnWidth="100%"
                        onClick={() => navigation.goBack()}
                    />
                </FooterBtnWrap>
            </Layout>
        </>
    );
};

const ResultLabel = styled.Text`
    margin-bottom: ${wp('3%')}px;
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroySemiBold};
    color: ${color.gray_text};
`;
const FooterBtnWrap = styled.View`
    flex-direction: ${props => (props.last ? 'column' : 'row')};
    ${props => (props.last ? `height: ${wp('32%')}px` : `height: auto`)};
    justify-content: space-between;
`;

export default CheckStatusResult;
