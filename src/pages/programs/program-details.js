import React, {useContext, useState} from 'react';
import styled from 'styled-components';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import {useRoute} from '@react-navigation/native';
import {SafeAreaView, StyleSheet} from 'react-native';
import {ScrollView} from 'react-native';
import {useQuery} from 'react-query';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import Layout from '../../components/layout';
import {color, fonts, sizes, Iconsizes} from '../../shared-components/helper';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import FormButton from '../../shared-components/button/form-button';
import {getSpecificProgram} from '../../hooks/useProgramData';
import CardWithBg from '../../components/card/card-with-bg';
import WebView from 'react-native-webview';
import Icon from 'react-native-fontawesome-pro';
import {UserContext} from '../../context/user';

const ProgramDetails = ({navigation}) => {
    const [programs, setPrograms] = useState();
    const {user} = useContext(UserContext);
    const [applyProgram, setApplyProgram] = useState();

    const route = useRoute();
    const program = route.params.prg;

    const headerOptions = {
        programmePage: true,
        featuredProgramme: program,
        exploreBtn: false,
        backBtn: true,
        backBtnAction: {
            screen: 'ApplyProgram',
        },
        noBorder: true,
        noSkew: true,
    };

    const systemFonts = [
        ...defaultSystemFonts,
        'Gilroy-Regular',
        'Gilroy-Medium',
        'Gilroy-Bold',
        'Gilroy-ExtraBold',
    ];

    const {isFetching} = useQuery(
        ['specific-program'],
        () => {
            return getSpecificProgram(`exclude=${program.ID}`);
        },
        {
            retry: false,
            onSuccess: data => {
                setPrograms(data.data.data.details);
            },
            onError: e => {
                console.log(e);
            },
        },
    );

    const programForm = `${program?.form_url}?auth_token=${user.token}&post_id=${program.ID}&is_mobile=true`;
    const bodyData = {
        auth_token: user.token,
        post_id: program.ID,
        is_mobile: true,
    };
    return (
        <>
            {!applyProgram ? (
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
                                    source={{
                                        html: program && program.post_content,
                                    }}
                                    tagsStyles={styles}
                                    systemFonts={systemFonts}
                                    customListStyleSpecs={{
                                        color: color.primary,
                                    }}
                                />
                            </JobDetailWrapper>
                        </SkewWrapper>
                        {!isFetching && programs && programs.length && (
                            <ListingWrapper>
                                <SectionHeader>
                                    <SectionHeading>
                                        Other Programs
                                    </SectionHeading>
                                </SectionHeader>
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={{
                                        paddingLeft: wp('6%'),
                                        paddingRight: wp('6%'),
                                    }}>
                                    {programs &&
                                        programs.length > 0 &&
                                        programs.map((item, index) => {
                                            return (
                                                <CardWithBg
                                                    key={index}
                                                    width={wp('70%')}
                                                    bgImg={item?.featured_image}
                                                    logo={item?.logo}
                                                    onPress={() =>
                                                        navigation.push(
                                                            'ProgramDetails',
                                                            {
                                                                prg: item,
                                                            },
                                                        )
                                                    }
                                                    btnText="Explore"
                                                />
                                            );
                                        })}
                                </ScrollView>
                            </ListingWrapper>
                        )}
                    </Layout>
                    <Layout noScroll footer bgColor={color.white}>
                        <FooterBtnWrap>
                            <FormButton
                                btnText="Apply Now"
                                btnWidth="100%"
                                onClick={
                                    () => setApplyProgram(true)
                                    // navigation.navigate('ApplyProgram', {program})
                                }
                            />
                        </FooterBtnWrap>
                    </Layout>
                </>
            ) : (
                <SafeAreaView>
                    <WebViewWrapper>
                        <WebView
                            // source={{
                            //     uri: programForm,
                            //     method: 'POST',
                            // }}
                            source={{
                                uri: 'https://beta.talentibex.com/program-submission?is_mobile=true',
                                body: `access_token=${user.token}&post_id=${program.ID}&is_mobile=true`,
                                method: 'POST',
                                headers: {
                                    'Content-Type':
                                        'application/x-www-form-urlencoded',
                                },
                            }}
                            containerStyle={{
                                flex: 0,
                                height: '100%',
                            }}
                        />
                        <CloseButton onPress={() => setApplyProgram(false)}>
                            <Icon
                                name="xmark"
                                size={Iconsizes.size24}
                                color={color.black}
                            />
                        </CloseButton>
                    </WebViewWrapper>
                </SafeAreaView>
            )}
        </>
    );
};

export default ProgramDetails;

const JobDetailWrapper = styled.View``;
const styles = StyleSheet.create({
    ol: {
        fontFamily: fonts.GilroyMedium,
        color: color.primary,
        margin: 0,
        lineHeight: parseInt(sizes.font16) * 1.5,
    },
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
    Headers: {fontFamily: fonts.GilroyMedium},
    body: {
        fontFamily: fonts.GilroyMedium,
    },
    p: {
        fontFamily: fonts.GilroyMedium,
        color: color.gray_text,
        lineHeight: parseInt(sizes.font16) * 1.5,
        fontSize: sizes.font16,
    },
    h3: {
        fontFamily: fonts.GilroyBold,
        color: color.black,
        fontSize: sizes.font20,
        marginBottom: wp('5%'),
        marginTop: wp('10%'),
    },
    h1: {
        fontFamily: fonts.GilroyMedium,
        color: color.black,
        fontSize: sizes.font24,
    },
    a: {
        color: color.primary,
        textDecorationLine: 'none',
    },
});

const FooterBtnWrap = styled.View`
    flex-direction: row;
    height: auto;
    justify-content: space-between;
`;

const ListingWrapper = styled.View`
    margin-top: ${wp('10%')}px;
`;

const SectionHeader = styled.View`
    padding-left: ${wp('8%')}px;
`;
const SectionHeading = styled.Text`
    font-family: ${fonts.GilroySemiBold};
    color: ${color.black};
    font-size: ${sizes.font18};
    margin-bottom: ${wp('5%')}px;
`;
const WebViewWrapper = styled.View`
    padding-top: 50px;
`;
const CloseButton = styled.TouchableOpacity`
    position: absolute;
    top: ${wp('3%')}px;
    right: ${wp('3%')}px;
`;
