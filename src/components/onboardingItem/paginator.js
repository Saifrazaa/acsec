import React from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import styled from 'styled-components';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { color } from '../../shared-components/helper';

export default Paginator = ({ data, scrollX, onClickDot }) => {
    const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

    return (
        <Wrapper>
            {data.map((_, i) => {
                const inputRange = [(i - 1) * wp('100%'), i * wp('100%'), (i + 1) * wp('100%')];
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [15, 25, 15],
                    extrapolate: 'clamp',
                });
                const dotOpacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });
                return (
                    <AnimatedTouchable
                        onPress={() => onClickDot(i)}
                        style={{
                            height: wp('1.5%'),
                            width: dotWidth,
                            borderRadius: wp('5%'),
                            backgroundColor: `${color.primary}`,
                            marginHorizontal: 3,
                            opacity: dotOpacity,
                        }}
                        key={i}
                    />
                );
            })}
        </Wrapper>
    );
};
const Wrapper = styled.View`
    flex-direction: row;
    align-self: center;
    margin-bottom: ${wp('3%')}px;
`;
