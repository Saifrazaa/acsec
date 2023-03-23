import React from 'react';
import {ActivityIndicator} from 'react-native';
import styled from 'styled-components';
import {color} from '../helper';

export const Loader = ({size, loaderColor}) => {
    return (
        <Wrapper>
            <ActivityIndicator
                color={loaderColor ? loaderColor : color.primary}
                size={size}
            />
        </Wrapper>
    );
};

const Wrapper = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;
