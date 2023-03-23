import React, {useState} from 'react';
import {Linking, Platform} from 'react-native';
import styled from 'styled-components';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useRoute} from '@react-navigation/native';

import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import Layout from '../../components/layout';
import {color, fonts, sizes} from '../../shared-components/helper';
import FormButton from '../../shared-components/button/form-button';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-fontawesome-pro';
import {getDefaultSettings, getSpecificJobs} from '../../hooks/useJobData';
import {useQuery} from 'react-query';
import DetailPagePlaceholder from '../../components/placeholders/detail-page-placeholder';

const JobDetail = ({navigation}) => {
    const [perksBenefits, setPerksBenefits] = useState([]);
    const [job, setJob] = useState({});
    const route = useRoute();
    const job_id = route?.params?.job_id;

    const otherInfo = [
        {
            title: 'Vacancies',
            value: job?.metadata?.crx_vacancies,
            iconName: 'user',
        },
        {
            title: 'Working hours',
            value: job?.metadata?.crx_working_hours,
            iconName: 'clock',
        },
        {
            title: 'Job Shift',
            value: job?.metadata?.crx_job_shift[0],
            iconName: 'clock-rotate-left',
        },
    ];

    const {isFetching: isjobFetching} = useQuery(
        ['job-by-id'],
        () => {
            const searchVal = `job_id=${job_id}`;
            return getSpecificJobs(searchVal);
        },
        {
            retry: false,
            onSuccess: data => {
                const res = data?.data?.data?.details[0];
                setJob(res);
            },
            onError: () => {},
        },
    );

    const headerOptions = {
        heading: job?.post_title,
        backBtn: true,
        backBtnAction: {
            screen: 'JobsListing',
        },
        noBorder: true,
        noSkew: true,
        headingPlaceholder: isjobFetching,
    };

    const {isFetching} = useQuery(
        ['perks-benefits'],
        () => getDefaultSettings(),
        {
            retry: false,
            onSuccess: data => {
                const perks = data?.data?.data?.details?.perks;
                setPerksBenefits(perks);
            },
        },
    );

    const handlePerkVal = (val, index) => {
        const perk = perksBenefits?.find(d => d.perk === val);
        if (perk) {
            return (
                <BenefitBox key={index}>
                    <BenefitIconWrap bgColor={perk?.color || color.primary}>
                        <Icon
                            name={perk?.icon}
                            size={wp('4.5%')}
                            color={perk?.color}
                        />
                    </BenefitIconWrap>
                    <BenefitText>{perk?.label || 'Perk Not Found'}</BenefitText>
                </BenefitBox>
            );
        }
    };

    const systemFonts = [
        ...defaultSystemFonts,
        'Gilroy-Regular',
        'Gilroy-Medium',
        'Gilroy-Bold',
        'Gilroy-ExtraBold',
    ];

    const handleMapPress = (latitude, longitude) => {
        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q=',
        });
        const latLng = `${latitude},${longitude}`;
        const label = latLng;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        });

        return Linking.openURL(url);
    };

    return (
        <>
            {(isjobFetching && (
                <Layout
                    noPadding
                    bgColor={color.white}
                    withHeader
                    headerOptions={headerOptions}>
                    <SkewWrapper>
                        <DetailPagePlaceholder />
                    </SkewWrapper>
                </Layout>
            )) || (
                <>
                    <Layout
                        noPadding
                        bgColor={color.white}
                        withHeader
                        headerOptions={headerOptions}>
                        <SkewWrapper bgColor={color.white}>
                            <JobDetailWrapper>
                                <RenderHtml
                                    contentWidth={wp('100%')}
                                    source={{html: job?.post_content}}
                                    tagsStyles={styles}
                                    systemFonts={systemFonts}
                                    customListStyleSpecs={{
                                        color: color.primary,
                                    }}
                                    baseStyle={styles.defaultStyle}
                                />
                                {!isFetching &&
                                    job?.metadata?.perks_benefits?.length >
                                        0 && (
                                        <>
                                            <SectionHeading>
                                                Perks and Benefits
                                            </SectionHeading>
                                            {job.metadata.perks_benefits.map(
                                                (item, index) =>
                                                    handlePerkVal(item, index),
                                            )}
                                        </>
                                    )}
                                {job?.metadata?.crx_location?.length > 0 && (
                                    <>
                                        <SectionHeading>
                                            Office Locations
                                        </SectionHeading>
                                        {job.metadata.crx_address_details.map(
                                            (item, index) => {
                                                return (
                                                    <LocationBox key={index}>
                                                        <MapImageClickAble
                                                            onPress={() =>
                                                                handleMapPress(
                                                                    item
                                                                        .metadata
                                                                        .latitude,
                                                                    item
                                                                        .metadata
                                                                        .longitude,
                                                                )
                                                            }>
                                                            <MapImage
                                                                source={
                                                                    item
                                                                        ?.metadata
                                                                        ?.city_name[0] ===
                                                                    'karachi'
                                                                        ? require('../../assets/images/map-karachi.png')
                                                                        : item
                                                                              ?.metadata
                                                                              ?.city_name[0] ===
                                                                          'lahore'
                                                                        ? require('../../assets/images/map-lahore.png')
                                                                        : require('../../assets/images/map-islamabad.png')
                                                                }
                                                            />
                                                        </MapImageClickAble>
                                                        <LocationInfo>
                                                            <JobCity>
                                                                {
                                                                    item
                                                                        ?.metadata
                                                                        ?.city_name[0]
                                                                }
                                                            </JobCity>
                                                            <OfficeAddress>
                                                                {
                                                                    item
                                                                        .metadata
                                                                        .complete_address
                                                                }
                                                            </OfficeAddress>
                                                            <Direction>
                                                                <DirectionHeading>
                                                                    View in
                                                                    Google Maps
                                                                </DirectionHeading>
                                                                <DirectionBtn
                                                                    onPress={() =>
                                                                        handleMapPress(
                                                                            item
                                                                                .metadata
                                                                                .latitude,
                                                                            item
                                                                                .metadata
                                                                                .longitude,
                                                                        )
                                                                    }>
                                                                    <Icon
                                                                        name="diamond-turn-right"
                                                                        size={wp(
                                                                            '5%',
                                                                        )}
                                                                        color={
                                                                            color.gray_text
                                                                        }
                                                                    />
                                                                </DirectionBtn>
                                                            </Direction>
                                                        </LocationInfo>
                                                    </LocationBox>
                                                );
                                            },
                                        )}
                                    </>
                                )}
                                {!isjobFetching && (
                                    <>
                                        <SectionHeading>
                                            More About Job
                                        </SectionHeading>
                                        <OtherInfoWrapper>
                                            {otherInfo &&
                                                otherInfo.length > 0 &&
                                                otherInfo.map((item, index) => {
                                                    return (
                                                        <OtherInfoBox
                                                            key={index}>
                                                            <OtherInfoIcon>
                                                                <Icon
                                                                    name={
                                                                        item.iconName
                                                                    }
                                                                    color={
                                                                        color.primary
                                                                    }
                                                                    size={wp(
                                                                        '4.5%',
                                                                    )}
                                                                />
                                                            </OtherInfoIcon>
                                                            <OtherInfoText>
                                                                <OtherInfoVal>
                                                                    {item.value}
                                                                </OtherInfoVal>
                                                                <OtherInfoLabel>
                                                                    {item.title}
                                                                </OtherInfoLabel>
                                                            </OtherInfoText>
                                                        </OtherInfoBox>
                                                    );
                                                })}
                                        </OtherInfoWrapper>
                                    </>
                                )}
                            </JobDetailWrapper>
                        </SkewWrapper>
                    </Layout>
                    <Layout noScroll footer bgColor={color.white}>
                        <FooterBtnWrap>
                            <FormButton
                                btnText="Refer"
                                bgColor={color.lightest_gray}
                                color={color.black}
                                btnWidth="29%"
                                onClick={() =>
                                    navigation.navigate('JobRefer', {
                                        job_meta: {
                                            job_id: job?.ID,
                                            title: job?.post_title,
                                            locations:
                                                job?.metadata?.crx_location,
                                            depart: job?.post_terms[0].name,
                                            departBg:
                                                job?.post_terms[0]?.metadata
                                                    ?.select_color,
                                        },
                                    })
                                }
                            />

                            <FormButton
                                btnText="Apply Now"
                                btnWidth="69%"
                                onClick={() =>
                                    navigation.navigate('JobApply', {
                                        job_meta: {
                                            job_id: job?.ID,
                                            title: job?.post_title,
                                            locations:
                                                job?.metadata?.crx_location,
                                            depart: job?.post_terms[0].name,
                                            departBg:
                                                job?.post_terms[0]?.metadata
                                                    ?.select_color,
                                        },
                                    })
                                }
                            />
                        </FooterBtnWrap>
                    </Layout>
                </>
            )}
        </>
    );
};

const FooterBtnWrap = styled.View`
    flex-direction: row;
    height: auto;
    justify-content: space-between;
`;

const BenefitBox = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${wp('1.5%')}px;
`;

const BenefitIconWrap = styled.View`
    height: ${wp('10%')}px;
    width: ${wp('10%')}px;
    align-items: center;
    justify-content: center;
    margin-right: ${wp('4%')}px;
    background-color: ${props =>
        props.bgColor ? `${props.bgColor}33` : color.gray};
    border-radius: ${wp('1.5%')}px;
`;

const BenefitText = styled.Text`
    font-size: ${sizes.font16};
    color: ${color.gray_text};
    font-family: ${fonts.GilroyMedium};
`;

const JobDetailWrapper = styled.View`
    margin-top: ${wp('-10%')}px;
`;

const SectionHeading = styled.Text`
    font-family: ${fonts.GilroyBold};
    color: ${color.black};
    font-size: ${wp('4.5%')}px;
    margin-top: ${wp('13%')}px;
    margin-bottom: ${wp('5%')}px;
`;

const styles = StyleSheet.create({
    ul: {
        fontFamily: fonts.GilroyMedium,
        color: color.primary,
        paddingLeft: wp('3.4%'),
        margin: 0,
        lineHeight: parseInt(sizes.font16) * 1.5,
    },
    li: {
        fontSize: wp('4%'),
        paddingLeft: 10,
        color: color.gray_text,
    },
    h3: {
        fontFamily: fonts.GilroyBold,
        color: color.black,
        fontSize: wp('4.5%'),
        marginTop: wp('13%'),
        marginBottom: wp('5%'),
    },
    defaultStyle: {
        color: color.gray_text,
        fontSize: wp('4%'),
        fontFamily: fonts.GilroyMedium,
        lineHeight: parseInt(sizes.font16) * 1.4,
    },
});

const LocationBox = styled.View`
    background-color: ${color.white};
    elevation: 2;
    width: 100%;
    padding: ${wp('4%')}px;
    margin-bottom: ${wp('4%')}px;
    border-radius: ${wp('3%')}px;
    border: 1px solid;
    border-color: ${color.inputBorder};
`;

const MapImageClickAble = styled.TouchableOpacity``;

const MapImage = styled.Image`
    resize-mode: cover;
    height: ${wp('25%')}px;
    width: 100%;
    border-radius: ${wp('3%')}px;
    border-width: 1px;
    border-color: ${color.inputBorder};
`;

const LocationInfo = styled.View`
    padding: 0 ${wp('2%')}px;
`;

const JobCity = styled.Text`
    color: ${color.primary};
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroyBold};
    margin: ${wp('3%')}px 0;
`;

const OfficeAddress = styled.Text`
    color: ${color.gray_text};
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyMedium};
    line-height: ${parseInt(sizes.font16) * 1.5}px;
`;

const Direction = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: ${wp('5%')}px;
    align-items: center;
`;

const DirectionHeading = styled.Text`
    font-family: ${fonts.GilroyBold};
    font-size: ${sizes.font16};
    color: ${color.black};
`;

const DirectionBtn = styled.TouchableOpacity`
    padding: ${wp('2.5%')}px;
    background-color: ${color.gray_text}0D;
    border-radius: ${wp('2%')}px;
`;

const OtherInfoWrapper = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
`;

const OtherInfoBox = styled.View`
    flex-direction: row;
    align-items: center;
    margin-bottom: ${wp('7%')}px;
    width: 50%;
`;

const OtherInfoIcon = styled.View`
    padding: ${wp('4%')}px;
    background-color: ${color.primary}0D;
    border-radius: ${wp('4%')}px;
`;

const OtherInfoText = styled.View`
    margin-left: ${wp('3%')}px;
`;

const OtherInfoVal = styled.Text`
    font-size: ${sizes.font18};
    font-family: ${fonts.GilroyBold};
    color: ${color.black};
`;

const OtherInfoLabel = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyRegular};
    color: ${color.black};
`;

export default JobDetail;
