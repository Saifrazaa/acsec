import React, {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import styled from 'styled-components';
import Icon from 'react-native-fontawesome-pro';
import {useRoute} from '@react-navigation/native';
import {useQuery} from 'react-query';

import {
    capitalizeFirstLetter,
    color,
    fonts,
    Iconsizes,
    sizes,
} from '../../shared-components/helper';
import MainHeader from '../../components/header';
import {getSpecificBlogs, useBlogsListing} from '../../hooks/useBlogsData';
import BlogCardPlaceholder from '../../components/placeholders/blog-card-placeholder';
import Layout from '../../components/layout';
import BlogCard from '../../components/blog-card/blog-card';
import NotFound from '../../components/not-found/not-found';

const LifeAtIbexListing = ({navigation}) => {
    const [activeDepart, setActiveDepart] = useState(0);
    const [rawBlogs, setRawBlogs] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [blogsCat, setBlogsCat] = useState([]);
    const [loading, setLoading] = useState(false);

    const route = useRoute();
    const slugParam = route?.params?.category_slug || '';

    const [slug, setSlug] = useState(slugParam);

    const {isFetching, refetch} = useQuery(
        ['get-blogs', slug],
        () => {
            const searchVal = `category_slug=${slug}`;
            return getSpecificBlogs(searchVal);
        },
        {
            retry: false,
            onSuccess: data => {
                if (data?.data?.data?.status === 200) {
                    const res = data?.data?.data?.details;
                    setBlogs(res);
                    setRawBlogs(res);
                    var catData = ['All'];
                    res?.map(item => {
                        const name = capitalizeFirstLetter(
                            item?.post_terms[0]?.slug,
                        );
                        return catData.push(name);
                    });
                    const catFinalData = catData.filter((item, index) => {
                        return catData.indexOf(item) === index;
                    });
                    setBlogsCat(catFinalData);
                }
            },
            onError: () => {},
        },
    );

    const handlePillClick = (index, name) => {
        setActiveDepart(index);
        setLoading(true);
        const data = rawBlogs;
        if (name !== undefined && name === 'All') {
            setBlogs(data);
            setLoading(false);
        } else {
            const newDataArr = data.filter(
                item =>
                    item?.post_terms[0]?.slug.toLowerCase() ===
                    name.toLowerCase(),
            );
            setBlogs([...newDataArr]);
            setLoading(false);
        }
    };

    const headerOptions = {
        centerHeading: 'Our Community',
        drawerBtn: true,
        noPaddingBottom: true,
    };
    return (
        <>
            <MainHeader headerOptions={headerOptions} />
            {slug !== '' && (
                <FilterByDepart>
                    <FilterPill bgColor={color.primary}>
                        <PillText active>{slug}</PillText>
                        <CloseButton onPress={() => [setSlug(''), refetch()]}>
                            <Icon
                                name="xmark"
                                color={color.white}
                                size={Iconsizes.size20}
                            />
                        </CloseButton>
                    </FilterPill>
                </FilterByDepart>
            )}
            {!isFetching && slug === '' && (
                <TeamsWrapper>
                    <ScrollView
                        contentContainerStyle={{
                            flexGrow: 1,
                            paddingLeft: wp('6%'),
                        }}
                        horizontal
                        showsHorizontalScrollIndicator={false}>
                        {blogsCat?.map((team, index) => {
                            if (team && team !== '') {
                                return (
                                    <DepartPill
                                        key={index}
                                        active={activeDepart === index}
                                        onPress={() =>
                                            handlePillClick(index, team)
                                        }>
                                        <PillText
                                            active={activeDepart === index}>
                                            {team}
                                        </PillText>
                                    </DepartPill>
                                );
                            }
                        })}
                    </ScrollView>
                </TeamsWrapper>
            )}
            {(isFetching || loading) && (slug === undefined || slug === '') && (
                <View
                    style={{
                        paddingLeft: wp('6%'),
                        flexDirection: 'row',
                        marginTop: wp('5%'),
                        paddingBottom: wp('5%'),
                    }}>
                    {[...Array(3).keys()].map(i => {
                        return (
                            <SkeletonPlaceholder
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

            <Layout bgColor={'transparent'}>
                <BlogsWrapper>
                    {isFetching &&
                        [...Array(7).keys()].map(i => {
                            return <BlogCardPlaceholder />;
                        })}
                    {!isFetching &&
                        blogs &&
                        blogs.length > 0 &&
                        blogs.map((item, index) => {
                            return (
                                <BlogCard
                                    key={index}
                                    featureImg={item.featured_image}
                                    title={item.post_title}
                                    publishDate={item.post_date}
                                    onPressCard={() =>
                                        navigation.navigate('BlogDetail', {
                                            blog: item,
                                        })
                                    }
                                />
                            );
                        })}
                    {!isFetching && blogs && !blogs.length && (
                        <NotFound
                            title="No Blog Found"
                            para="No blog found related to the selected category."
                        />
                    )}
                </BlogsWrapper>
            </Layout>
        </>
    );
};

const TeamsWrapper = styled.View`
    flex-direction: row;
    justify-content: center;
    padding-top: ${wp('5%')}px;
    padding-bottom: ${wp('5%')}px;
`;

const DepartPill = styled.TouchableOpacity`
    padding: ${wp('2%')}px ${wp('6%')}px;
    border: 1px solid;
    border-color: ${color.primary};
    margin-horizontal: ${wp('1%')}px;
    border-radius: ${wp('7%')}px;
    ${props => {
        if (props.active) {
            return `
                background-color: ${color.primary};
            `;
        }
    }}
`;

const PillText = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyMedium};
    color: ${props => (props.active ? color.white : color.black)};
`;

const BlogsWrapper = styled.View`
    padding: 0 ${wp('5%')}px;
`;

const CloseButton = styled.TouchableOpacity`
    margin-right: ${wp('3%')}px;
    margin-left: ${wp('4%')}px;
    padding: ${wp('2%')}px;
`;

const FilterByDepart = styled.View`
    padding: 0 ${wp('5%')}px;
    padding-top: ${wp('5%')}px;
    padding-bottom: ${wp('5%')}px;
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

export default LifeAtIbexListing;
