import React, {useState} from 'react';
import Icon from 'react-native-fontawesome-pro';
import {ScrollView, RefreshControl} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useQuery} from 'react-query';
import styled from 'styled-components';

import Layout from '../../components/layout';
import {
    capitalizeFirstLetter,
    color,
    fonts,
    Iconsizes,
    sizes,
} from '../../shared-components/helper';
import JobCard from '../../components/job-card/job-card-applying';
import CardWithBg from '../../components/card/card-with-bg';
import {getSpecificJobs, getDefaultSettings} from '../../hooks/useJobData';
import {useProgramListing} from '../../hooks/useProgramData';
import {useBlogsCategories} from '../../hooks/useBlogsData';
import {Loader} from '../../shared-components/loader';

const Home = ({navigation}) => {
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [homeBlogs, setHomeBlogs] = useState([]);
    const [programs, setPrograms] = useState();
    const [jobsSearch, setJobsSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const [departCounts, setDepartCountr] = useState({
        technology: 0,
        bpo: 0,
        across_ibex: 0,
    });
    const headerOptions = {
        drawerBtn: true,
        homepage: true,
    };

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(100).then(() => [
            setRefreshing(false),
            queryClient.invalidateQueries([
                'homepage-jobs',
                'homepage-blogs',
                'jobs-count',
            ]),
        ]);
    }, []);

    const {isFetching: fetchingPrograms} = useProgramListing({
        onSuccess: data => {
            setPrograms(data.data.data.details);
        },
        onError: e => {
            console.log(e);
        },
    });

    const {isFetching: isjobFetching} = useQuery(
        ['homepage-jobs'],
        () => {
            const searchVal = 'per_page=5';
            return getSpecificJobs(searchVal);
        },
        {
            retry: false,
            onSuccess: data => {
                const res = data?.data?.data?.details;
                setRecommendedJobs(res);
            },
            onError: () => {},
        },
    );

    const {isFetching: isBlogsFetching} = useBlogsCategories({
        onSuccess: data => {
            const res = data?.data?.data?.details;
            setHomeBlogs(res);
        },
        onError: () => {},
    });

    const {isFetching: isCountsFetching} = useQuery(
        ['jobs-count'],
        () => getDefaultSettings(),
        {
            retry: false,
            onSuccess: data => {
                const jobsCounts = data?.data?.data?.details?.jobs;
                setDepartCountr(jobsCounts);
            },
            onError: () => {},
        },
    );

    return (
        <Layout
            noPadding
            withHeader
            headerOptions={headerOptions}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <Container>
                {/* Job Search Block */}
                <JobSearchWrap>
                    <FindJobTitle>Find your dream Job</FindJobTitle>
                    <SearchWrap>
                        <Icon
                            name="magnifying-glass"
                            size={20}
                            color={color.gray_text}
                        />
                        <SearchJobInput
                            placeholder="Search Jobs"
                            placeholderTextColor={color.gray_text}
                            returnKeyType="search"
                            onSubmitEditing={() => {
                                if (Boolean(jobsSearch.length)) {
                                    setTimeout(() => {
                                        navigation.navigate('Jobs', {
                                            screen: 'JobsListing',
                                            params: {
                                                search_term: jobsSearch,
                                                page: 'home',
                                                searchByVal: true,
                                            },
                                        });
                                    }, 100);
                                }
                            }}
                            onChangeText={val => setJobsSearch(val)}
                        />
                    </SearchWrap>
                </JobSearchWrap>
                {/* Main Heading Wrap */}
                <HeadingWrap>
                    <MainHeading>
                        Growth<PinkDot>.</PinkDot>
                    </MainHeading>
                    <MainSubHeading>for everyone</MainSubHeading>
                </HeadingWrap>
                {/* Departments Wrap */}
                <Departments>
                    <Row>
                        <Col width="45%">
                            <Depart
                                onPress={() =>
                                    navigation.navigate('Jobs', {
                                        screen: 'JobsListing',
                                        params: {
                                            department_id: 12,
                                            search_term: 'Technology',
                                            department_bg_color: color.sky,
                                            page: 'home',
                                        },
                                    })
                                }>
                                <DepartIcon bgColor={`${color.sky}12`}>
                                    <Icon
                                        name="laptop"
                                        color={color.sky}
                                        size={Iconsizes.size24}
                                    />
                                    <JobCount bgColor={color.sky}>
                                        {(isCountsFetching && (
                                            <Loader
                                                size={wp('3%')}
                                                loaderColor={color.white}
                                            />
                                        )) || (
                                            <Count>
                                                {departCounts?.technology || 0}
                                            </Count>
                                        )}
                                    </JobCount>
                                </DepartIcon>
                                <DepartName marginTop>Technology</DepartName>
                            </Depart>
                        </Col>
                        <Col width="55%">
                            <Row marginLeft={`${wp('4%')}px`}>
                                <Col width="100%">
                                    <Depart
                                        rowStyle
                                        onPress={() =>
                                            navigation.navigate('Jobs', {
                                                screen: 'JobsListing',
                                                params: {
                                                    department_id: 11,
                                                    search_term: 'BPO',
                                                    department_bg_color:
                                                        color.green,
                                                    page: 'home',
                                                },
                                            })
                                        }>
                                        <DepartIcon
                                            bgColor={`${color.green}12`}>
                                            <Icon
                                                name="headphones-simple"
                                                color={color.green}
                                                size={Iconsizes.size24}
                                            />

                                            <JobCount bgColor={color.green}>
                                                {(isCountsFetching && (
                                                    <Loader
                                                        size={wp('3%')}
                                                        loaderColor={
                                                            color.white
                                                        }
                                                    />
                                                )) || (
                                                    <Count>
                                                        {departCounts?.bpo || 0}
                                                    </Count>
                                                )}
                                            </JobCount>
                                        </DepartIcon>
                                        <DepartName marginLeft rowStyle>
                                            BPO
                                        </DepartName>
                                    </Depart>
                                </Col>
                                <Col width="100%">
                                    <Depart
                                        rowStyle
                                        onPress={() =>
                                            navigation.navigate('Jobs', {
                                                screen: 'JobsListing',
                                            })
                                        }>
                                        <DepartIcon
                                            bgColor={`${color.primary}12`}>
                                            <Icon
                                                name="building"
                                                color={color.primary}
                                                size={Iconsizes.size24}
                                            />

                                            <JobCount>
                                                {(isCountsFetching && (
                                                    <Loader
                                                        size={wp('3%')}
                                                        loaderColor={
                                                            color.white
                                                        }
                                                    />
                                                )) || (
                                                    <Count>
                                                        {departCounts?.across_ibex ||
                                                            0}
                                                    </Count>
                                                )}
                                            </JobCount>
                                        </DepartIcon>
                                        <DepartName marginLeft rowStyle>
                                            Across ibex.
                                        </DepartName>
                                    </Depart>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Departments>
                <CheckStatWrap
                    source={require('../../assets/images/gradient2.png')}>
                    <BlockImg
                        source={require('../../assets/images/women-with-mobile.png')}
                    />
                    <CheckStatContent>
                        <CheckStatHeading>
                            Want to see{' '}
                            <CheckStatHeading bold>Updates?</CheckStatHeading>
                        </CheckStatHeading>
                        <CheckStatBtn
                            onPress={() => navigation.navigate('CheckStatus')}>
                            <BtnText>Check Status</BtnText>
                        </CheckStatBtn>
                    </CheckStatContent>
                </CheckStatWrap>
            </Container>

            <ListingWrapper>
                <SectionHeader>
                    <SectionHeading>Programs</SectionHeading>
                    <SectionAction
                        onPress={() => navigation.navigate('Programs')}>
                        <ViewAllText>View all</ViewAllText>
                    </SectionAction>
                </SectionHeader>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingLeft: wp('6%'),
                        paddingRight: wp('6%'),
                    }}>
                    {programs &&
                        programs.length > 0 &&
                        programs.map((item, index) => {
                            return (
                                <CardWithBg
                                    key={index}
                                    width={wp('70%')}
                                    bgImg={item?.featured_image}
                                    logo={item?.logo}
                                    onPress={() =>
                                        navigation.navigate('ProgramDetails', {
                                            prg: item,
                                        })
                                    }
                                    btnText="Explore"
                                />
                            );
                        })}
                </ScrollView>
            </ListingWrapper>
            <RecommendedJobs>
                <SectionHeader>
                    <SectionHeading>Recommended Jobs</SectionHeading>
                    <SectionAction onPress={() => navigation.navigate('Jobs')}>
                        <ViewAllText>View all</ViewAllText>
                    </SectionAction>
                </SectionHeader>

                {(isjobFetching && <Loader size={wp('7%')} />) || (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingLeft: wp('6%'),
                            paddingRight: wp('6%'),
                        }}>
                        {recommendedJobs &&
                            recommendedJobs.length > 0 &&
                            recommendedJobs.map((item, index) => {
                                return (
                                    <JobCardWrapper key={index}>
                                        <JobCard
                                            horizontalView
                                            onPress={() =>
                                                navigation.navigate('Jobs', {
                                                    screen: 'JobDetail',
                                                    params: {job_id: item.ID},
                                                })
                                            }
                                            noShadow
                                            key={index}
                                            title={item?.post_title}
                                            locations={item?.metadata?.crx_location.map(
                                                i => i.name,
                                            )}
                                            depart={item?.post_terms[0]?.name}
                                            departBg={
                                                item?.post_terms[0]?.metadata
                                                    ?.select_color
                                            }
                                        />
                                    </JobCardWrapper>
                                );
                            })}
                    </ScrollView>
                )}
            </RecommendedJobs>

            <ListingWrapper>
                <SectionHeader>
                    <SectionHeading>Our Community</SectionHeading>
                    <SectionAction
                        onPress={() => navigation.navigate('LifeAtIbex')}>
                        <ViewAllText>View all</ViewAllText>
                    </SectionAction>
                </SectionHeader>
                {(isBlogsFetching && <Loader size={wp('7%')} />) || (
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingLeft: wp('6%'),
                            paddingRight: wp('6%'),
                        }}>
                        {homeBlogs &&
                            homeBlogs.length > 0 &&
                            homeBlogs.map((item, index) => {
                                return (
                                    <CardWithBg
                                        key={index}
                                        width={wp('42%')}
                                        bgImg={item?.thumbnail}
                                        btnText={capitalizeFirstLetter(
                                            item?.slug,
                                        )}
                                        onPress={() =>
                                            navigation.navigate('LifeAtIbex', {
                                                screen: 'LifeAtIbexListing',
                                                params: {
                                                    category_slug: item?.slug,
                                                },
                                            })
                                        }
                                    />
                                );
                            })}
                    </ScrollView>
                )}
            </ListingWrapper>
        </Layout>
    );
};

const JobSearchWrap = styled.View`
    margin-top: ${wp('-16%')}px;
`;
const FindJobTitle = styled.Text`
    font-size: ${sizes.font18};
    color: ${color.white};
    font-family: ${fonts.GilroyBold};
`;
const Container = styled.View`
    padding: 0 ${wp('8%')}px;
`;

const SearchWrap = styled.View`
    flex-direction: row;
    align-items: center;
    height: ${wp('15%')}px;
    background-color: ${color.white};
    margin-top: ${wp('3%')}px;
    border-radius: ${wp('3%')}px;
    padding-left: ${wp('5%')}px;
`;
const SearchJobInput = styled.TextInput`
    padding-left: ${wp('7%')}px;
    font-family: ${fonts.GilroyMedium};
    flex: 1;
    color: ${color.gray_text};
`;

const HeadingWrap = styled.View`
    margin-top: ${wp('8%')}px;
`;

const MainHeading = styled.Text`
    font-size: ${sizes.font30};
    font-family: ${fonts.GilroyExtraBold};
    color: ${color.black};
`;

const PinkDot = styled.Text`
    color: ${color.primary};
`;

const MainSubHeading = styled.Text`
    font-size: ${sizes.font30};
    font-family: ${fonts.GilroySemiBold};
    color: ${color.black};
`;

const Departments = styled.View`
    margin-top: ${wp('5%')}px;
`;

const Row = styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    margin-left: ${props => (props.marginLeft ? props.marginLeft : 0)};
    flex: 1 0;
`;

const Col = styled.View`
    width: ${props => (props.width ? props.width : '100%')};
`;

const DepartIcon = styled.View`
    padding: ${wp('4%')}px;
    background-color: ${props =>
        props.bgColor ? props.bgColor : color.app_bg};
    border-radius: ${wp('2%')}px;
`;

const Depart = styled.TouchableOpacity`
    width: 100%;
    background-color: ${color.white};
    justify-content: center;
    align-items: center;
    flex: 1 0;
    margin-bottom: ${wp('4%')}px;
    padding: ${wp('4%')}px;
    border-radius: ${wp('2%')}px;
    border-width: 1px;
    border-color: ${color.black}1A;
    ${props => {
        if (props.rowStyle) {
            return `
                flex-direction:row;
                align-items:center;
                justify-content:flex-start;
            `;
        }
    }}
`;

const JobCount = styled.View`
    position: absolute;
    top: ${wp('-2%')}px;
    right: ${wp('-2%')}px;
    height: ${wp('6%')}px;
    width: ${wp('6%')}px;
    border-radius: ${wp('50%')}px;
    background-color: ${props =>
        props.bgColor ? props.bgColor : color.primary};
    justify-content: center;
    align-items: center;
`;

const Count = styled.Text`
    color: ${color.white};
    font-size: ${sizes.font12};
    font-family: ${fonts.GilroyMedium};
`;

const DepartName = styled.Text`
    font-size: ${sizes.font16};
    font-family: ${fonts.GilroySemiBold};
    margin-top: ${props => (props.marginTop ? `${wp('5%')}px` : 0)};
    margin-left: ${props => (props.marginLeft ? `${wp('5%')}px` : 0)};
    ${props => props.rowStyle && 'flex: 1 0;'}
    color: ${color.black};
`;

const RecommendedJobs = styled.View`
    margin-bottom: ${wp('5%')}px;
`;

const SectionHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin: ${wp('5%')}px 0;
    padding: 0 ${wp('8%')}px;
`;

const SectionHeading = styled.Text`
    font-size: ${sizes.font18};
    font-family: ${fonts.GilroyBold};
    color: ${color.black};
`;

const SectionAction = styled.TouchableOpacity`
    font-size: ${sizes.font18};
    font-family: ${fonts.GilroyBold};
`;

const ViewAllText = styled.Text`
    color: ${color.primary};
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyMedium};
`;

const JobCardWrapper = styled.View`
    width: ${wp('80%')}px;
    margin-horizontal: ${wp('2%')}px;
`;

const CheckStatWrap = styled.ImageBackground`
    margin: ${wp('8%')}px 0;
    resize-mode: cover;
    overflow: hidden;
    border-bottom-left-radius: ${wp('3%')}px;
    border-bottom-right-radius: ${wp('3%')}px;
    border-top-left-radius: ${wp('3%')}px;
    border-top-right-radius: ${wp('3%')}px;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    padding: ${wp('5%')}px ${wp('3%')}px;
`;

const BlockImg = styled.Image`
    width: ${wp('35%')}px;
    height: ${hp('19%')}px;
    resize-mode: contain;
    position: absolute;
    left: 0;
    bottom: 0;
`;

const CheckStatContent = styled.View`
    width: 60%;
`;

const CheckStatHeading = styled.Text`
    font-size: ${sizes.font20};
    color: ${color.white};
    font-family: ${props =>
        props.bold ? fonts.GilroyBold : fonts.GilroyRegular};
    line-height: 25px;
`;

const CheckStatBtn = styled.TouchableOpacity`
    width: 100%;
    background-color: ${color.white}33;
    padding: ${wp('3%')}px 0;
    margin-top: ${wp('3%')}px;
    border-radius: ${wp('3%')}px;
`;

const BtnText = styled.Text`
    font-size: ${sizes.font16};
    color: ${color.white};
    text-align: center;
    font-family: ${fonts.GilroyRegular};
`;

const ListingWrapper = styled.View`
    margin-bottom: ${wp('10%')}px;
`;

export default Home;
