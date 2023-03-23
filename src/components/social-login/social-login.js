import React from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {color} from '../../shared-components/helper';
export default SocialLogin = ({onPress}) => {
    const socialLogin = [
        {
            iconPath: require('../../assets/images/facebook-icon.png'),
            type: 'facebook',
        },
        {
            iconPath: require('../../assets/images/google-icon.png'),
            type: 'google',
        },
        // {
        //     iconPath: require('../../assets/images/linked-in-icon.png'),
        //
        // },
    ];
    return (
        <SocialLoginWrapper>
            {socialLogin &&
                socialLogin.map((socialBtn, index) => {
                    return (
                        <SocialLoginBtn
                            onPress={() => {
                                onPress(socialBtn.type);
                            }}
                            key={index}>
                            <SocialBtnImage source={socialBtn.iconPath} />
                        </SocialLoginBtn>
                    );
                })}
        </SocialLoginWrapper>
    );
};
const SocialLoginWrapper = styled.View`
    flex-direction: row;
    justify-content: space-between;
    width: 45%;
    align-self: center;
`;

const SocialLoginBtn = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
    padding: ${wp('4%')}px;
    background-color: ${color.lightest_gray};
    border-radius: ${wp('3%')}px;
`;

const SocialBtnImage = styled.Image`
    height: ${wp('6%')}px;
    width: ${wp('6%')}px;
    resize-mode: contain;
`;
