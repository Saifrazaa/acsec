import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {Keyboard, Platform} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

const KeyboardAvoidingView = ({children, keyBoardOffset}) => {
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const onKeyboardDidShow = e => {
        setKeyboardHeight(e.endCoordinates.height);
    };

    const onKeyboardDidHide = () => {
        setKeyboardHeight(0);
    };

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            'keyboardDidShow',
            onKeyboardDidShow,
        );
        const hideSubscription = Keyboard.addListener(
            'keyboardDidHide',
            onKeyboardDidHide,
        );
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    return (
        <Wrapper>
            {children}
            {Platform.OS === 'ios' && (
                <Animatable.View
                    transition="height"
                    easing="ease-out-circ"
                    duration={100}
                    style={{
                        width: wp('100%'),
                        height:
                            keyBoardOffset !== undefined
                                ? keyboardHeight - keyBoardOffset
                                : keyboardHeight,
                    }}
                />
            )}
        </Wrapper>
    );
};

const Wrapper = styled.View`
    flex: 1 0;
`;

export default KeyboardAvoidingView;
