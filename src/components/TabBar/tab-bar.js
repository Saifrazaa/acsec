import React from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {color, fonts, sizes} from '../../shared-components/helper';

const TabBar = ({tabData, activeIndex, onChangeTab}) => {
    return (
        <Wrapper>
            <TabMenuWrapper>
                {tabData &&
                    tabData.length > 0 &&
                    tabData.map((menu, index) => {
                        return (
                            <TabMenu
                                active={index === activeIndex}
                                key={index}
                                onPress={() => onChangeTab(index)}>
                                <Label active={index === activeIndex}>
                                    {menu.title}
                                </Label>
                            </TabMenu>
                        );
                    })}
            </TabMenuWrapper>
        </Wrapper>
    );
};

const Wrapper = styled.View`
    width: 100%;
    height: ${wp('18%')}px;
    margin: ${wp('7%')}px 0;
    padding: 10px ${wp('5%')}px 0;
`;

const TabMenuWrapper = styled.View`
    background-color: ${color.white};
    padding: ${wp('2%')}px;
    flex-direction: row;
    border-radius: ${wp('2%')}px;
    height: 100%;
    border-width: 1px;
    border-color: ${color.black}1A;
`;

const TabMenu = styled.TouchableOpacity`
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    border-radius: ${wp('2%')}px;
    ${props => {
        if (props.active) {
            return `
                background-color:${color.app_bg};
            `;
        }
    }}
`;

const Label = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroySemiBold};
    color: ${props => (props.active ? color.black : color.gray_text)};
`;

export default TabBar;
