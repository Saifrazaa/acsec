import React from 'react';
import styled from 'styled-components';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {color, fonts} from '../../shared-components/helper';

const Seperator = ({text, smallMargin}) => {
    return (
        <Separator smallMargin={smallMargin}>
            <SeperatorLine />
            <SeperatorText>{text}</SeperatorText>
            <SeperatorLine />
        </Separator>
    );
};

const Separator = styled.View`
    flex-direction: row;
    align-items: center;
    margin-top: ${props =>
        props.smallMargin ? `${wp('4%')}px` : `${wp('10%')}px`};
    margin-bottom: ${props =>
        props.smallMargin ? `${wp('7%')}px` : `${wp('10%')}px`};
`;

const SeperatorLine = styled.View`
    height: 1px;
    flex-grow: 1;
    background: ${color.black}33;
`;

const SeperatorText = styled.Text`
    padding-left: ${wp('5%')}px;
    padding-right: ${wp('5%')}px;
    color: ${color.black}80;
    font-family: ${fonts.GilroyMedium};
`;

export default Seperator;
