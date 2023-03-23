import React, {useState} from 'react';
import styled from 'styled-components';
import {FlatList} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {color, fonts, sizes} from '../../shared-components/helper';
import Layout from '../../components/layout';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import ProgramCard from '../../components/program-card/program-card';
import {useProgramListing} from '../../hooks/useProgramData';
import ProgramPlaceHolder from '../../components/placeholders/programs-placeholder';

const Programs = ({navigation}) => {
    const [programs, setPrograms] = useState();

    const {isFetching, refetch: getPrograms} = useProgramListing({
        onSuccess: data => {
            setPrograms(data.data.data.details);
        },
        onError: e => {
            console.log(e);
        },
    });

    const headerOptions = {
        programmePage: !isFetching && true,
        featuredProgramme: !isFetching && programs && programs[0],
        drawerBtn: true,
        noBorder: true,
        exploreBtn: true,
        noSkew: true,
        headingPlaceholder: isFetching,
    };

    return (
        <>
            {(isFetching && (
                <Layout withHeader headerOptions={headerOptions}>
                    <SkewWrapper>
                        {[...Array(6).keys()].map((item, index) => (
                            <ProgramPlaceHolder key={index} />
                        ))}
                    </SkewWrapper>
                </Layout>
            )) || (
                <Layout
                    out
                    noPadding
                    bgColor={color.white}
                    withHeader
                    headerOptions={headerOptions}>
                    <SkewWrapper bgColor={color.white}>
                        <ProgramsWrapper>
                            <HeadingWrap>
                                <MainHeading>Programs</MainHeading>
                            </HeadingWrap>
                            <ContentStyle>
                                {`We can't give you Wings, \n But we can help you Fly.`}
                            </ContentStyle>
                            <CardWrapper>
                                <FlatList
                                    data={programs && programs}
                                    renderItem={({item}) => (
                                        <ProgramCard
                                            label={item?.post_title}
                                            bgImage={item?.featured_image}
                                            logo={item?.metadata?.logo}
                                            onPress={() =>
                                                navigation.navigate(
                                                    'ProgramDetails',
                                                    {prg: item},
                                                )
                                            }
                                        />
                                    )}
                                    keyExtractor={item => item.id}
                                    style={{flexGrow: 0, flex: 1}}
                                />
                            </CardWrapper>
                        </ProgramsWrapper>
                    </SkewWrapper>
                </Layout>
            )}
        </>
    );
};
const ProgramsWrapper = styled.View``;
const HeadingWrap = styled.View``;
const MainHeading = styled.Text`
    font-size: ${sizes.font30};
    font-family: ${fonts.GilroyExtraBold};
    color: ${color.black};
`;

const ContentStyle = styled.Text`
    color: ${color.black};
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroyMedium};
    margin: ${wp('3%')}px 0;
    padding: 0;
    line-height: ${parseInt(sizes.font16) * 1.5}px;
`;

const CardWrapper = styled.View`
    flex: 1;
    margin-top: ${wp('10%')}px;
`;

export default Programs;
