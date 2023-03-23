import React, {useContext, useState} from 'react';
import styled from 'styled-components/native';
import moment from 'moment';
import {Platform, StyleSheet} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {color, fonts, sizes} from '../../shared-components/helper';
import IconButton from '../../shared-components/button/icon-button';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-fontawesome-pro';
import {UserContext} from '../../context/user';

const HeaderWithText = ({headerOptions}) => {
    const [searchOpened, setSearchOpened] = useState(false);
    const {user} = useContext(UserContext);
    const navigation = useNavigation();

    const {
        drawerBtn,
        heading,
        headerPara,
        subHeading,
        backBtn,
        shareBtn,
        searchBtn,
        noBorder,
        openFilterModal,
        setIsSearching,
        publishDate,
        notificationBtn,
        btnText,
        homepage,
        setSearchVal,
        filterApplied,
        noPaddingBottom,
        centerHeading,
        onPressBack,
        searchJobByTitle,
        headingPlaceholder,
    } = headerOptions;

    const handleSearchState = state => {
        setSearchOpened(state);
        setIsSearching(state);
    };

    return (
        <HeaderWrap homepage={homepage} noPaddingBottom={noPaddingBottom}>
            <HeaderButtons searchOpened={searchOpened}>
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
                {searchOpened && (
                    <IconButton
                        btnColor={color.white}
                        bgColor={`transparent`}
                        iconName="angle-left"
                        padding={`${wp('3.5%')}px ${wp('1.5%')}px`}
                        onPress={() => [
                            handleSearchState(false),
                            onPressBack(),
                        ]}
                    />
                )}
                {drawerBtn && !searchOpened && (
                    <IconButton
                        btnColor={color.white}
                        bgColor={`${color.white}33`}
                        iconName="bars-sort"
                        onPress={() => navigation.openDrawer()}
                    />
                )}

                {centerHeading && !searchOpened && (
                    <CenterHeadingWrap>
                        <CenterHeading>{centerHeading}</CenterHeading>
                    </CenterHeadingWrap>
                )}

                <InputWrapper
                    style={[
                        styles.searchWrapper,
                        {
                            flex: searchOpened ? 1 : 0.1,
                            opacity: searchOpened ? 1 : 0,
                        },
                    ]}>
                    <Icon
                        name="magnifying-glass"
                        color={color.white}
                        size={wp('4%')}
                    />
                    <SearchInput
                        placeholder="Search something..."
                        placeholderTextColor={color.white}
                        value={searchJobByTitle}
                        onChangeText={val => setSearchVal(val)}
                    />
                </InputWrapper>

                {searchBtn && !searchOpened && (
                    <IconButton
                        btnColor={color.white}
                        bgColor={`${color.white}33`}
                        iconName="magnifying-glass"
                        onPress={() => handleSearchState(true)}
                    />
                )}
                {searchOpened && (
                    <IconButton
                        btnColor={color.white}
                        bgColor={`${color.white}33`}
                        filterApplied={filterApplied}
                        iconName="filter"
                        onPress={() => openFilterModal(true)}
                    />
                )}
                {shareBtn && (
                    <IconButton
                        btnColor={color.white}
                        bgColor={`${color.white}33`}
                        iconName="share-nodes"
                        onPress={() => navigation.openDrawer()}
                    />
                )}
                {notificationBtn && (
                    <IconButton
                        btnColor={color.white}
                        bgColor={`${color.white}33`}
                        iconName="bell"
                        onPress={() => navigation.openDrawer()}
                    />
                )}
            </HeaderButtons>
            {!searchOpened && (
                <HeaderInfo>
                    {heading && heading !== '' && <Heading>{heading}</Heading>}
                    {headerPara && headerPara !== '' && (
                        <Para>{headerPara}</Para>
                    )}
                    {subHeading && subHeading !== '' && (
                        <SubHeading>{subHeading}</SubHeading>
                    )}
                    {publishDate && publishDate !== '' && (
                        <PublishDate>
                            {moment(publishDate).format('MMM DD, YYYY')}
                        </PublishDate>
                    )}
                    {headingPlaceholder && (
                        <SkeletonPlaceholder
                            highlightColor={color.white}
                            backgroundColor={`${color.inputBorder}33`}>
                            <SkeletonPlaceholder.Item
                                width={'100%'}
                                height={40}
                            />
                            <SkeletonPlaceholder.Item
                                width={'70%'}
                                height={40}
                                marginTop={wp('3%')}
                            />
                        </SkeletonPlaceholder>
                    )}
                </HeaderInfo>
            )}
            {homepage && (
                <>
                    <WelcomeNote>
                        <Note>Hi,</Note>
                        <Image
                            source={require('../../assets/images/hand.png')}
                        />
                    </WelcomeNote>
                    <UserName>{user && user.name}</UserName>
                </>
            )}
        </HeaderWrap>
    );
};

const HeaderButtons = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: ${wp('5%')}px;
    align-items: center;
    ${props => {
        if (props.searchOpened) {
            return `
                margin-bottom: ${wp('5%')}px;
            `;
        }
    }}
`;

const HeaderInfo = styled.View`
    padding-top: ${wp('10%')}px;
`;

const HeaderWrap = styled.View`
    padding-bottom: ${wp('22%')}px;
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

const SearchInput = styled.TextInput`
    color: ${color.white};
    margin-left: ${wp('3%')}px;
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroyMedium};
    flex: 1;
`;

const Heading = styled.Text`
    font-size: ${sizes.font38};
    color: ${color.white};
    font-family: ${fonts.GilroyExtraBold};
`;

const Para = styled.Text`
    font-size: ${sizes.font16};
    color: ${color.white}99;
    font-family: ${fonts.GilroyMedium};
    line-height: ${parseInt(sizes.font16) * 1.3}px;
`;

const styles = StyleSheet.create({
    searchWrapper: {
        backgroundColor: `${color.white}33`,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: wp('2%'),
        marginRight: wp('2%'),
        paddingLeft: wp('5%'),
        borderRadius: wp('3%'),
        height: wp('12%'),
    },
});

const WelcomeNote = styled.View`
    flex-direction: row;
    align-items: center;
`;
const Note = styled.Text`
    color: ${color.white};
    font-size: ${sizes.font18};
    font-family: ${fonts.GilroyBold};
    margin-right: ${wp('2%')}px;
`;

const Image = styled.Image`
    resize-mode: contain;
    width: ${wp('4%')}px;
`;

const UserName = styled.Text`
    color: ${color.white};
    font-size: ${sizes.font24};
    font-family: ${fonts.GilroyBold};
`;

const InputWrapper = styled.View``;

const CenterHeadingWrap = styled.View`
    padding: 0 ${wp('5%')}px;
    flex: 1;
`;

const CenterHeading = styled.Text`
    font-size: ${sizes.font20};
    color: ${color.white};
    font-family: ${fonts.GilroyBold};
`;

const SubHeading = styled.Text`
    font-size: ${sizes.font16};
    color: ${color.white};
    font-family: ${fonts.GilroyMedium};
    line-height: 23px;
    margin-top: ${wp('2%')}px;
`;

const PublishDate = styled.Text`
    font-size: ${sizes.font12};
    color: ${color.white};
    font-family: ${fonts.GilroyMedium};
    margin-top: ${wp('2%')}px;
`;

export default HeaderWithText;
