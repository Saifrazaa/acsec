import React from 'react';
import {Platform} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';
import {useNavigation} from '@react-navigation/native';

import IconButton from '../../shared-components/button/icon-button';
import {color, fonts, sizes} from '../../shared-components/helper';

const HeaderWithBg = ({headerOptions}) => {
    const navigation = useNavigation();
    const {drawerBtn, featuredProgramme, exploreBtn, backBtn, btnText} =
        headerOptions;

    return (
        <HeaderWrap>
            <HeaderButtons>
                {backBtn && (
                    <IconButton
                        btnColor={color.white}
                        bgColor={`transparent`}
                        iconName="angle-left"
                        withText
                        text={btnText ? btnText : 'Back'}
                        onPress={() => navigation.goBack()}
                    />
                )}
                {drawerBtn && (
                    <IconButton
                        btnColor={color.white}
                        bgColor={`${color.white}33`}
                        iconName="bars-sort"
                        onPress={() => navigation.openDrawer()}
                    />
                )}
            </HeaderButtons>
            <ContentWrap>
                <FeaturedLogo
                    source={
                        featuredProgramme?.metadata?.logo && {
                            uri: featuredProgramme.metadata.logo,
                        }
                    }
                />
                {exploreBtn && (
                    <ExploreButton
                        onPress={() =>
                            navigation.navigate('ProgramDetails', {
                                prg: featuredProgramme,
                            })
                        }>
                        <BtnText>Explore</BtnText>
                    </ExploreButton>
                )}
            </ContentWrap>
        </HeaderWrap>
    );
};

const HeaderButtons = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: ${wp('5%')}px;
    align-items: center;
`;

const HeaderWrap = styled.View`
    padding-bottom: ${wp('12%')}px;
    padding-top: ${Platform.OS === 'ios' ? wp('12%') : wp('8%')}px;
    justify-content: space-between;
    ${props => {
        if (props.noPaddingBottom) {
            return `
                padding-bottom:0;
            `;
        }
    }}
`;

const ContentWrap = styled.View`
    margin-top: ${wp('20%')}px;
    margin-bottom: ${wp('5%')}px;
    align-items: center;
`;

const FeaturedLogo = styled.Image`
    margin: ${wp('5%')}px 0;
    width: ${wp('80%')}px;
    height: ${wp('10%')}px;
    resize-mode: contain;
`;

const ExploreButton = styled.TouchableOpacity`
    padding: ${wp('2%')}px ${wp('7%')}px;
    background-color: ${color.white}33;
    border-radius: ${wp('2%')}px;
    border: 1px solid;
    border-color: ${color.white};
`;

const BtnText = styled.Text`
    color: ${color.white};
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyRegular};
`;

export default HeaderWithBg;
