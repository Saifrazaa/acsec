import React from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {fonts, sizes, color} from '../../shared-components/helper';
const NotFound = ({title, para}) => {
    return (
        <NotFoundWrapper>
            <NotFoundImg
                source={require('../../assets/images/404-not-found.png')}
            />
            <NotFoundHeading>{title}</NotFoundHeading>
            <NotFoundPara>{para}</NotFoundPara>
        </NotFoundWrapper>
    );
};

const NotFoundWrapper = styled.View`
    width: ${wp('80%')}px;
    align-self: center;
    justify-self: center;
`;

const NotFoundImg = styled.Image`
    resize-mode: contain;
    width: 100%;
`;

const NotFoundHeading = styled.Text`
    font-size: ${sizes.font24};
    font-family: ${fonts.GilroyBold};
    text-align: center;
    color: ${color.black};
`;

const NotFoundPara = styled.Text`
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroyRegular};
    text-align: center;
    color: ${color.black};
    margin-top: ${wp('5%')}px;
`;

export default NotFound;
