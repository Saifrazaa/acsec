import React, {useState, useRef} from 'react';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {ScrollView, RefreshControl, Animated, View} from 'react-native';
import {useQueryClient, useQuery} from 'react-query';
import {useRoute} from '@react-navigation/native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import Layout from '../../components/layout';
import {color, fonts, Iconsizes, sizes} from '../../shared-components/helper';
import JobCard from '../../components/job-card/job-card-applying';
import FilterModal from '../../shared-components/popups/filterModal';
import {getSpecificJobs} from '../../hooks/useJobData';
import MainHeader from '../../components/header';
import Icon from 'react-native-fontawesome-pro';
import JobCardPlaceHolder from '../../components/placeholders/job-card-placeholder';
import NotFound from '../../components/not-found/not-found';

const JobsListing = ({navigation}) => {
    const [activeDepart, setActiveDepart] = useState(0);
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [jobsRaw, setJobsRaw] = useState([]);
    const [jobsCat, setJobsCat] = useState([]);
    const [filterModal, setFilterModal] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filterApplied, setFilterApplied] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedLoc, setSelectedLoc] = useState(0);
    const [selectedDepart, setSelectedDepart] = useState(0);
    const [searchJobByTitle, setSearchJobByTitle] = useState('');

    const route = useRoute();

    const [params, setPageParams] = useState({
        department_id: route?.params?.department_id,
        search_term: route?.params?.search_term,
        department_bg_color: route?.params?.department_bg_color,
        previousPage: route?.params?.page,
        searchByVal: route?.params?.searchByVal,
    });

    const scrollY = useRef(new Animated.Value(0)).current;

    const queryClient = useQueryClient();

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        clearFilter();
        wait(100).then(() => [
            setRefreshing(false),
            queryClient.invalidateQueries('jobs-list'),
        ]);
    }, []);

    const {isFetching: isjobFetching, refetch} = useQuery(
        ['jobs-list', params?.department_id, params?.search_term],
        () => {
            const searchVal = params?.searchByVal
                ? `search=${params.search_term}`
                : params.department_id
                ? `department_id=${params.department_id}`
                : '';
            return getSpecificJobs(searchVal);
        },
        {
            retry: false,
            onSuccess: data => {
                const res = data?.data?.data?.details;
                setJobs(res);
                setJobsRaw(res);
                setFilteredJobs(res);
                // For Categories
                var catData = ['All'];
                res?.map(item => {
                    return catData.push(item?.post_terms[0]?.name);
                });
                const catFinalData = catData.filter((item, index) => {
                    return catData.indexOf(item) === index;
                });

                setJobsCat(catFinalData);
            },
            onError: () => {},
        },
    );

    const headerOptions = {
        centerHeading: 'Find Your Team.',
        drawerBtn: true,
        searchBtn: !isjobFetching && true,
        filterApplied,
        noPaddingBottom: true,
        searchJobByTitle,
        openFilterModal: val => setFilterModal(val),
        setIsSearching: val => [
            setIsSearching(val),
            setJobs(jobsRaw),
            setFilteredJobs(jobsRaw),
        ],
        setSearchVal: val => handleJobSearch(val),
        onPressBack: () => [
            setAppliedFilters({location: undefined, department: undefined}),
            setSelectedLoc(0),
            setSelectedDepart(0),
            setSearchJobByTitle(''),
        ],
    };

    const handlePillClick = (index, name) => {
        setActiveDepart(index);
        const data = jobsRaw;
        if (name !== undefined && name === 'All') {
            setJobs(data);
        } else {
            const newDataArr = data.filter(
                item => item?.post_terms[0]?.name === name,
            );
            setJobs([...newDataArr]);
        }
    };

    //Handle Job search
    const handleJobSearch = val => {
        const arr = filteredJobs.filter(item => {
            if (item.post_title.toLowerCase().includes(val.toLowerCase())) {
                return true;
            }
        });
        setSearchJobByTitle(val);
        setJobs([...arr]);
    };

    //Handle Applied Filters
    const setAppliedFilters = val => {
        setLoading(true);
        if (
            (!val.location || val.location === 'All') &&
            (!val.department || val.department === 'All')
        ) {
            clearFilter();
        } else {
            var filteredArr = jobsRaw.filter(jobObj => {
                if (
                    val.location &&
                    (!val.department || val.department === 'All')
                ) {
                    if (
                        jobObj.metadata.crx_location.some(
                            el => el.name === val.location,
                        )
                    ) {
                        return true;
                    }
                } else if (
                    (!val.location || val.location === 'All') &&
                    val.department
                ) {
                    if (jobObj.post_terms[0].name === val.department) {
                        return true;
                    }
                } else if (val.location && val.department) {
                    if (
                        jobObj.metadata.crx_location.some(
                            el => el.name === val.location,
                        ) &&
                        jobObj.post_terms[0].name === val.department
                    ) {
                        return true;
                    }
                } else {
                    return false;
                }
            });
            setFilterApplied(true);
            setJobs(filteredArr);
            setFilteredJobs(filteredArr);
        }
        setLoading(false);
    };

    //Handle Clear Filter
    const clearFilter = () => {
        setFilterApplied(false);
        setJobs(jobsRaw);
        setFilteredJobs(jobsRaw);
        setSelectedDepart(0);
        setSelectedLoc(0);
        setSearchJobByTitle('');
    };

    const jobTeams = [];
    jobsCat.map(d => {
        jobTeams.push({
            label: d,
            value: d,
        });
    });
    return (
        <>
            <MainHeader headerOptions={headerOptions} />

            <JobsCategoryWrap>
                {params?.previousPage === 'home' && params?.search_term && (
                    <FilterByDepart>
                        <FilterPill bgColor={params?.department_bg_color}>
                            <PillText color={color.white}>
                                {params.search_term}
                            </PillText>
                            <CloseButton
                                onPress={() => [
                                    [
                                        setJobs([]),
                                        setJobsRaw([]),
                                        setFilteredJobs([]),
                                        setPageParams({
                                            previousPage: undefined,
                                            department_bg_color: undefined,
                                            search_term: undefined,
                                            department_id: undefined,
                                            searchByVal: undefined,
                                        }),
                                        refetch(),
                                    ],
                                ]}>
                                <Icon
                                    name="xmark"
                                    color={color.white}
                                    size={Iconsizes.size20}
                                />
                            </CloseButton>
                        </FilterPill>
                    </FilterByDepart>
                )}
                {!isjobFetching &&
                    !isSearching &&
                    !(params?.previousPage === 'home') && (
                        <TeamsWrapper>
                            <ScrollView
                                contentContainerStyle={{
                                    flexGrow: 1,
                                    paddingLeft: wp('6%'),
                                }}
                                horizontal
                                showsHorizontalScrollIndicator={false}>
                                {jobsCat &&
                                    jobsCat.length > 0 &&
                                    jobsCat.map((team, index) => {
                                        return (
                                            <DepartPill
                                                key={index}
                                                active={activeDepart === index}
                                                onPress={() =>
                                                    handlePillClick(index, team)
                                                }>
                                                <PillText
                                                    active={
                                                        activeDepart === index
                                                    }>
                                                    {team}
                                                </PillText>
                                            </DepartPill>
                                        );
                                    })}
                            </ScrollView>
                        </TeamsWrapper>
                    )}
                {(isjobFetching || loading) &&
                    !(params?.previousPage === 'home') && (
                        <View
                            style={{
                                paddingLeft: wp('6%'),
                                flexDirection: 'row',
                                marginTop: wp('5%'),
                            }}>
                            {[...Array(3).keys()].map((item, index) => {
                                return (
                                    <SkeletonPlaceholder
                                        key={index}
                                        highlightColor={color.inputBorder}
                                        backgroundColor={color.white}>
                                        <SkeletonPlaceholder.Item
                                            width={80}
                                            height={30}
                                            borderRadius={20}
                                            marginRight={5}
                                        />
                                    </SkeletonPlaceholder>
                                );
                            })}
                        </View>
                    )}
                <ListingWrapper>
                    {isSearching && (
                        <JobsFoundCount>
                            {jobs &&
                                jobs.length > 0 &&
                                jobs.length + ' Jobs Found'}
                        </JobsFoundCount>
                    )}
                </ListingWrapper>
            </JobsCategoryWrap>
            <Layout
                bgColor={'transparent'}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                <JobsWrapper>
                    {(isjobFetching || loading) &&
                        [...Array(7).keys()].map(i => {
                            return <JobCardPlaceHolder />;
                        })}
                    {!isjobFetching && jobs && jobs.length > 0
                        ? jobs.map((job, index) => {
                              return (
                                  <JobCard
                                      key={index}
                                      title={job?.post_title}
                                      locations={job?.metadata?.crx_location.map(
                                          i => i.name,
                                      )}
                                      depart={job?.post_terms[0]?.name}
                                      departBg={
                                          job?.post_terms[0]?.metadata
                                              ?.select_color
                                      }
                                      onPress={() =>
                                          navigation.navigate('JobDetail', {
                                              job_id: job.ID,
                                          })
                                      }
                                      noShadow
                                  />
                              );
                          })
                        : !refreshing &&
                          !isjobFetching &&
                          jobs.length === 0 && (
                              <NotFound
                                  title="No Job Found"
                                  para="There is no job found based on the details
                                you have entered. Please try again with
                                another keywords or may be use generic
                                term."
                              />
                          )}
                </JobsWrapper>
            </Layout>
            <FilterModal
                jobs={jobsRaw}
                filterVals={{
                    selectedLoc,
                    selectedDepart,
                    setSelectedLoc: val => setSelectedLoc(val),
                    setSelectedDepart: val => setSelectedDepart(val),
                }}
                isVisible={filterModal}
                onClose={() => setFilterModal(false)}
                onApplyFilter={filters => setAppliedFilters(filters)}
                onClearFilter={() => clearFilter()}
            />
            {/* {(isjobFetching || loading) && (
                <LoaderWrapper>
                    <Loader size={wp('12%')} />
                </LoaderWrapper>
            )} */}
        </>
    );
};

const JobsCategoryWrap = styled.View``;

const TeamsWrapper = styled.View`
    flex-direction: row;
    justify-content: center;
    margin-top: ${wp('5%')}px;
`;

const DepartPill = styled.TouchableOpacity`
    padding: ${wp('2%')}px ${wp('6%')}px;
    border: ${props => (props.noBorder ? 'none' : '1px solid')};
    border-color: ${color.primary};
    margin-horizontal: ${wp('1%')}px;
    border-radius: ${wp('7%')}px;
    ${props => {
        if (props.active) {
            return `
                background-color: ${color.primary};
            `;
        }
    }};
`;

const CloseButton = styled.TouchableOpacity`
    margin-right: ${wp('3%')}px;
    margin-left: ${wp('4%')}px;
    padding: ${wp('2%')}px;
`;

const FilterByDepart = styled.View`
    padding: 0 ${wp('5%')}px;
    margin-top: ${wp('5%')}px;
    flex-direction: row;
`;

const FilterPill = styled.View`
    padding-left: ${wp('6%')}px;
    border-radius: ${wp('7%')}px;
    background-color: ${props =>
        props.bgColor ? props.bgColor : color.primary};
    flex-direction: row;
    align-items: center;
`;

const ListingWrapper = styled.View`
    padding: 0 ${wp('7%')}px;
    margin-bottom: ${wp('2%')}px;
`;

const PillText = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyMedium};
    color: ${props =>
        props.active ? color.white : props.color ? props.color : color.black};
`;

const JobsWrapper = styled.View`
    padding: 0 ${wp('7%')}px;
`;

const JobsFoundCount = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroySemiBold};
    color: ${color.gray_text};
    margin-top: ${wp('5%')}px;
`;

export default JobsListing;
