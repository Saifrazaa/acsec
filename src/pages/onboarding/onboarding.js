import React, {useState, useRef} from 'react';
import {Platform, StatusBar, FlatList, Animated} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import styled from 'styled-components';
import * as Animatable from 'react-native-animatable';

import Layout from '../../components/layout';
import GradientHeader from '../../shared-components/gradient-elements/gradient-header';
import {color} from '../../shared-components/helper';
import FormButton from '../../shared-components/button/form-button';
import OnBoardingItem from '../../components/onboardingItem/onboardingItem';
import Paginator from '../../components/onboardingItem/paginator';
import {setGetStartedToken} from '../../utils/token-manager';

const getStarted = [
    {
        id: 1,
        image: require('../../assets/images/get-started-img-1.png'),
        title: 'Make your dream career with',
        logoText: 'ibex.',
        para: 'We help you to find your dream job according to your skillset, location & preference to build your career',
    },
    {
        id: 2,
        image: require('../../assets/images/get-started-img-2.png'),
        title: 'Get to know more about',
        logoTextPre: 'talent',
        logoText: 'ibex.',
        para: 'We help you to find your dream job according to your skillset, location & preference to build your career.',
    },
    {
        id: 3,
        image: require('../../assets/images/get-started-img-3.png'),
        title: 'Get register today with',
        logoTextPre: 'talent',
        logoText: 'ibex.',
    },
];

const Onboarding = ({navigation}) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNextSlide = () => {
        if (currentIndex !== getStarted.length - 1) {
            slidesRef.current.scrollToIndex({index: currentIndex + 1});
        } else {
            setGetStartedToken('startedApp');
            navigation.navigate('Login');
        }
    };

    const viewableItemsChanged = useRef(({viewableItems}) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;
    return (
        <>
            <Layout noPadding bgColor={color.white}>
                <GradientHeader noInnerMargin>
                    <HeaderWrap>
                        <LogoImg
                            source={require('../../assets/images/talentibex-logo.png')}
                        />
                        {getStarted.map((item, index) => {
                            return (
                                <Animatable.View
                                    key={index}
                                    easing="ease-out"
                                    transition="opacity"
                                    duration={300}
                                    style={{
                                        opacity: index === currentIndex ? 1 : 0,
                                        position: 'absolute',
                                        bottom: wp('-4%'),
                                        width: wp('95%'),
                                        height: hp('43%'),
                                    }}>
                                    <BannerImg source={item.image} />
                                </Animatable.View>
                            );
                        })}
                    </HeaderWrap>
                </GradientHeader>
                <OnBoardingWrapper>
                    <FlatList
                        data={getStarted}
                        renderItem={({item}) => <OnBoardingItem item={item} />}
                        keyExtractor={item => item.id}
                        bounces={false}
                        pagingEnabled
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {x: scrollX}}}],
                            {
                                useNativeDriver: false,
                            },
                        )}
                        onViewableItemsChanged={viewableItemsChanged}
                        viewabilityConfig={viewConfig}
                        ref={slidesRef}
                    />
                    <Paginator
                        data={getStarted}
                        scrollX={scrollX}
                        onClickDot={dotIndex => {
                            slidesRef.current.scrollToIndex({index: dotIndex});
                        }}
                    />
                </OnBoardingWrapper>
            </Layout>
            <Layout noScroll footer bgColor={color.white}>
                <FooterBtnWrap>
                    <Animatable.View
                        easing="ease-out"
                        transition={['width', 'opacity']}
                        duration={100}
                        style={{
                            width:
                                currentIndex === getStarted.length - 1
                                    ? '0%'
                                    : '29%',
                            opacity:
                                currentIndex === getStarted.length - 1 ? 0 : 1,
                        }}>
                        <FormButton
                            btnText="Skip"
                            bgColor={color.lightest_gray}
                            color={color.black}
                            btnWidth="100%"
                            onClick={() => {
                                setGetStartedToken('startedApp');
                                navigation.navigate('Login');
                            }}
                        />
                    </Animatable.View>
                    <Animatable.View
                        easing="ease-out"
                        transition="width"
                        duration={100}
                        style={{
                            width:
                                currentIndex === getStarted.length - 1
                                    ? '100%'
                                    : '69%',
                        }}>
                        <FormButton
                            btnText="Continue"
                            btnWidth="100%"
                            onClick={() => handleNextSlide()}
                        />
                    </Animatable.View>
                </FooterBtnWrap>
            </Layout>
        </>
    );
};

const HeaderWrap = styled.SafeAreaView`
    flex: 1 0;
    align-items: center;
    min-height: ${hp('57%')}px;
    margin-bottom: -15px;
    ${Platform.OS === 'android' && `padding-top: ${StatusBar.currentHeight}px`}
`;

const BannerImg = styled.Image`
    width: ${wp('95%')}px;
    height: ${hp('43%')}px;
    resize-mode: contain;
`;

const LogoImg = styled.Image`
    width: ${wp('45%')}px;
    height: ${wp('12%')}px;
    resize-mode: contain;
    margin-top: ${wp('8%')}px;
    margin-bottom: ${wp('2%')}px;
`;

const OnBoardingWrapper = styled.View``;

const FooterBtnWrap = styled.View`
    flex-direction: row;
    height: auto;
    justify-content: space-between;
`;

export default Onboarding;
