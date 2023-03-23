import React from 'react';
import {Dimensions, Image} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';

const ProgramCard = ({logo, bgImage, label, onPress}) => {
    const wi = Dimensions.get('window').width;

    return (
        <Card activeOpacity={0.9} onPress={() => onPress()}>
            <CardBg source={{uri: bgImage}}>
                <Image
                    source={
                        logo && {
                            uri: logo,
                        }
                    }
                    style={{
                        width: wi * 0.15,
                        aspectRatio: 1,
                        resizeMode: 'contain',
                        top: wp('3%'),
                        left: wp('8%'),
                    }}
                />
            </CardBg>
        </Card>
    );
};

const Card = styled.TouchableOpacity`
    width: 100%;
    border-radius: ${wp('2%')}px;
    margin-bottom: ${wp('5%')}px;
    border-radius: ${wp('2%')}px;
    overflow: hidden;
    position: relative;
`;

const CardBg = styled.ImageBackground`
    width: 100%;
    height: ${wp('35%')}px;
    resize-mode: cover;
`;

export default ProgramCard;
