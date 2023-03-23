import React from 'react';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';
import {color, fonts, sizes} from '../helper';
const ErrorText = ({text, marginTop}) => {
    return <CustText marginTop={marginTop}>{text}</CustText>;
};
const CustText = styled.Text`
    font-family: ${fonts.GilroyMedium};
    font-size: ${sizes.font14};
    color: ${color.danger};
    margin-top: ${props => (props.marginTop ? `${wp('2%')}px` : 0)};
`;

export default ErrorText;
