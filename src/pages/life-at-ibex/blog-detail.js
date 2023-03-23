import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import RenderHtml, {defaultSystemFonts} from 'react-native-render-html';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {useQuery} from 'react-query';
import {useRoute} from '@react-navigation/native';

import Layout from '../../components/layout';
import {
    capitalizeFirstLetter,
    color,
    fonts,
    sizes,
} from '../../shared-components/helper';
import SkewWrapper from '../../shared-components/skew-wrapper/skew-wrapper';
import {getSpecificBlogs} from '../../hooks/useBlogsData';
import BlogCard from '../../components/blog-card/blog-card';

const BlogDetail = ({navigation}) => {
    const [otherBlogs, setOtherBlogs] = useState([]);
    const route = useRoute();
    const blog = route?.params?.blog;

    const {isFetching} = useQuery(
        ['other-blogs', blog?.ID],
        () => {
            const searchVal = `per_page=3&category_slug=${blog?.post_terms[0]?.slug}&exclude=${blog?.ID}`;
            return getSpecificBlogs(searchVal);
        },
        {
            retry: false,
            enabled: !!blog?.ID,
            onSuccess: data => {
                const res = data?.data?.data?.details;
                setOtherBlogs(res);
            },
            onError: () => {},
        },
    );

    const headerOptions = {
        heading:
            blog &&
            blog.post_terms[0]?.slug &&
            capitalizeFirstLetter(blog.post_terms[0]?.slug),
        subHeading: blog && blog.post_title && blog.post_title,
        imgSrc: blog && blog.featured_image && {uri: blog.featured_image},
        publishDate: blog?.post_date,
        backBtn: true,
        noBorder: true,
        noSkew: true,
    };

    const systemFonts = [
        ...defaultSystemFonts,
        'Gilroy-Regular',
        'Gilroy-Medium',
        'Gilroy-Bold',
        'Gilroy-ExtraBold',
    ];

    return (
        <>
            <Layout headerOptions={headerOptions} withHeader noPadding>
                <SkewWrapper bgColor={color.white} noSidePadding>
                    <BlogDetailWrapper>
                        <RenderHtml
                            contentWidth={wp('100%')}
                            source={{html: blog?.post_content || ''}}
                            tagsStyles={styles}
                            systemFonts={systemFonts}
                            customListStyleSpecs={{
                                color: color.primary,
                            }}
                        />
                    </BlogDetailWrapper>
                    {!isFetching && otherBlogs && otherBlogs.length > 0 && (
                        <OtherBlogs>
                            <SectionHeader>
                                <SectionHeading>Our Community</SectionHeading>
                                <SectionAction
                                    onPress={() => navigation.goBack()}>
                                    <ViewAllText>View all</ViewAllText>
                                </SectionAction>
                            </SectionHeader>

                            {otherBlogs.map((item, index) => {
                                return (
                                    <BlogCard
                                        key={index}
                                        featureImg={item.featured_image}
                                        title={item.post_title}
                                        publishDate={item.post_date}
                                        onPressCard={() =>
                                            navigation.push('BlogDetail', {
                                                blog: item,
                                            })
                                        }
                                    />
                                );
                            })}
                        </OtherBlogs>
                    )}
                </SkewWrapper>
            </Layout>
        </>
    );
};

const BlogDetailWrapper = styled.View`
    padding: 0 ${wp('5%')}px;
    padding-top: ${wp('10%')}px;
`;

const OtherBlogs = styled.View`
    padding: 0 ${wp('8%')}px;
    margin-top: ${wp('10%')}px;
    margin-bottom: ${wp('10%')}px;
`;

const SectionHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    margin: ${wp('5%')}px 0;
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

const styles = StyleSheet.create({
    ul: {
        fontFamily: fonts.GilroyMedium,
        color: color.gray_text,
        paddingLeft: wp('3.4%'),
        margin: 0,
        lineHeight: parseInt(sizes.font16) * 1.5,
    },
    li: {
        fontSize: sizes.font16,
        paddingLeft: 10,
        color: color.gray_text,
    },
    Headers: {fontFamily: fonts.GilroyMedium},
    body: {
        fontFamily: fonts.GilroyMedium,
    },
    p: {
        fontFamily: fonts.GilroyMedium,
        color: color.gray_text,
        fontSize: sizes.font14,
        lineHeight: parseInt(sizes.font16) * 1.5,
        padding: wp('3%'),
    },
    h3: {
        fontFamily: fonts.GilroyBold,
        color: color.gray_text,
        fontSize: sizes.font18,
        padding: wp('3%'),
    },
    h2: {
        fontFamily: fonts.GilroyBold,
        color: color.gray_text,
        fontSize: sizes.font20,
        paddingLeft: wp('3%'),
        paddingRight: wp('3%'),
    },
    img: {
        margin: `0 ${wp('5%')}`,
        width: wp('80%'),
        height: 250,
        objectFit: 'contain',
    },
    a: {
        color: color.primary,
        textDecorationLine: 'none',
    },
});

export default BlogDetail;
