import React from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {color} from '../helper';

export const LoaderWrapper = ({children, width, borderRadius}) => {
    return (
        <Wrapper width={width} borderRadius={borderRadius}>
            {children}
        </Wrapper>
    );
};
const Wrapper = styled.View`
    position: absolute;
    background-color: ${color.white}BF;
    top: 0;
    left: 0;
    width: ${props => (props.width ? props.width : `${wp('100%')}px`)};
    height: 100%;
    z-index: 999;
    ${props => {
        if (props.borderRadius) {
            return `
          border-radius:${wp('50%')}px;
        `;
        }
    }}
`;
