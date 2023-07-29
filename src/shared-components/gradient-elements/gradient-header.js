import React, {useContext} from 'react';
import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Platform} from 'react-native';
import {color} from '../helper';
import {UserContext} from '../../context/user';

const Header = ({
    children,
    noBorder,
    imgSrc,
    noMarginBottom,
    noOverlay,
    noSkew,
}) => {
    const {user} = useContext(UserContext);
    return (
        <Wrapper
            darkMode={user.darkMode}
            noSkew={noSkew}
            noBorder={noBorder}
            noMarginBottom={noMarginBottom}>
            {imgSrc !== undefined && !noOverlay && imgSrc ? (
                <DarkGradient
                    noSkew={noSkew}
                    source={require('../../assets/images/dark-gradient.png')}>
                    <InnerGradient>{children}</InnerGradient>
                </DarkGradient>
            ) : (
                <InnerWrapper noSkew={noSkew}>{children}</InnerWrapper>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.View`
    width: 100%;
    overflow: hidden;
    background-color: ${props =>
        props.darkMode ? color.black : color.primary};
    margin-bottom: 20px;
    padding-top: 20px;
`;

const DarkGradient = styled.View`
    width: 100%;
    overflow: hidden;
`;

const InnerGradient = styled.View`
    padding: 0 ${wp('7%')}px ${wp('5%')}px;
`;

const InnerWrapper = styled.View`
    margin: 0 ${wp('7%')}px ${wp('5%')}px;
`;

export default Header;
