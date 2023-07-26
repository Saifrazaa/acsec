import React, {useState} from 'react';
import styled from 'styled-components/native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {color, fonts, sizes} from '../../shared-components/helper';
import IconButton from '../../shared-components/button/icon-button';
import {useNavigation} from '@react-navigation/native';

const HeaderWithText = ({headerOptions}) => {
    const [searchOpened, setSearchOpened] = useState(false);
    const navigation = useNavigation();

    const {drawerBtn, homepage, noPaddingBottom, heading, subHeading} =
        headerOptions;

    return (
        <HeaderWrap homepage={homepage} noPaddingBottom={noPaddingBottom}>
            <HeaderButtons searchOpened={searchOpened}>
                {drawerBtn && !searchOpened && (
                    <IconButton
                        btnColor={color.white}
                        bgColor={`${color.white}33`}
                        iconName="bars-sort"
                        onPress={() => navigation.openDrawer()}
                    />
                )}
            </HeaderButtons>
            <HeaderInfo>
                {heading && heading !== '' && <Heading>{heading}</Heading>}
                {subHeading && subHeading !== '' && (
                    <SubHeading>{subHeading}</SubHeading>
                )}
            </HeaderInfo>
        </HeaderWrap>
    );
};

const HeaderButtons = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin-top: ${wp('2%')}px;
    align-items: center;
`;

const HeaderWrap = styled.View`
    padding-bottom: ${wp('4%')}px;
    padding-top: ${wp('4%')}px;
    justify-content: space-between;
`;

const HeaderInfo = styled.View`
    padding-top: ${wp('5%')}px;
`;

const Heading = styled.Text`
    font-size: ${sizes.font38};
    color: ${color.white};
    font-family: ${fonts.GilroyExtraBold};
`;

const SubHeading = styled.Text`
    font-size: ${sizes.font16};
    color: ${color.white};
    font-family: ${fonts.GilroyMedium};
    line-height: 23px;
    margin-top: ${wp('2%')}px;
`;

export default HeaderWithText;
