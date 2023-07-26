import React, {useRef} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import styled from 'styled-components';
import {color} from '../shared-components/helper';
import MainHeader from './header';

const Layout = ({
    children,
    noPadding,
    boxlayout,
    noScroll,
    bgColor,
    first,
    refreshControl,
    withHeader,
    headerOptions,
    stickyHeaderIndices,
    onChangeScrollTop,
    onContentScroll,
}) => {
    const scrollRef = useRef();

    const handleScrollPosition = () => {
        if (onChangeScrollTop) {
            scrollRef.current?.scrollTo({
                y: 0,
                animated: true,
            });
        }
    };

    return (
        <>
            {noScroll ? (
                <SafeAreaView
                    style={{
                        backgroundColor: color.white,
                    }}>
                    <View
                        style={[
                            {
                                backgroundColor: color.white,
                                borderTopRightRadius: wp('8%'),
                                borderTopLeftRadius: wp('8%'),
                                shadowColor: color.black,
                                shadowOffset: {
                                    width: 0,
                                    height: -5,
                                },
                                shadowOpacity: 0.03,
                                shadowRadius: 4,
                                elevation: 20,
                            },
                        ]}>
                        <FooterWrap>{children}</FooterWrap>
                    </View>
                </SafeAreaView>
            ) : (
                <MainWrapper bgColor={bgColor}>
                    <ScrollView
                        ref={scrollRef}
                        onScroll={onContentScroll}
                        onContentSizeChange={handleScrollPosition}
                        refreshControl={refreshControl}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'flex-start',
                            paddingBottom: noPadding ? 0 : wp('6%'),
                            paddingHorizontal: boxlayout ? wp('4%') : 0,
                            position: 'relative',
                            paddingTop: first
                                ? wp('5.5%')
                                : noPadding
                                ? 0
                                : wp('3%'),
                            bottom: 0,
                        }}
                        stickyHeaderIndices={stickyHeaderIndices}>
                        {withHeader && (
                            <MainHeader headerOptions={headerOptions} />
                        )}
                        {children}
                    </ScrollView>
                </MainWrapper>
            )}
        </>
    );
};

const MainWrapper = styled.View`
    background-color: ${props =>
        props.bgColor ? props.bgColor : color.app_bg};
    flex: 1 0;
`;

const Body = styled.View``;

const FooterWrap = styled.View`
    elevation: 4;
    padding: ${wp('5%')}px;
`;

export default Layout;
