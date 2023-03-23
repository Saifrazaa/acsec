import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {color, fonts, sizes} from '../../shared-components/helper';

const BlogCard = ({onPressCard, featureImg, title, publishDate}) => {
    return (
        <Card onPress={onPressCard}>
            <CardBody>
                <CardImage>
                    <BlogImg
                        source={{
                            uri: featureImg,
                        }}
                    />
                </CardImage>
                <CardInfo>
                    <CardHeading numberOfLines={3}>{title}</CardHeading>
                    <PublishDate>
                        {moment(publishDate).format('MMM DD, YYYY')}
                    </PublishDate>
                </CardInfo>
            </CardBody>
        </Card>
    );
};

const Card = styled.TouchableOpacity`
    margin-bottom: ${wp('3%')}px;
    background-color: ${color.white};
    border-radius: ${wp('2%')}px;
    border-width: 1px;
    border-color: ${color.black}1A;
`;

const CardBody = styled.View`
    flex-direction: row;
    padding: ${wp('2.5%')}px;
`;

const CardImage = styled.View`
    height: ${wp('23%')}px;
    width: ${wp('23%')}px;
`;

const BlogImg = styled.Image`
    height: 100%;
    width: 100%;
    resize-mode: cover;
    border-radius: ${wp('2%')}px;
`;

const CardInfo = styled.View`
    margin-left: ${wp('5%')}px;
    justify-content: space-between;
    flex: 1 0;
    padding-right: ${wp('4%')}px;
`;

const CardHeading = styled.Text`
    font-size: ${sizes.font14};
    font-family: ${fonts.GilroyBold};
    line-height: 20px;
    color: ${color.black};
`;

const PublishDate = styled.Text`
    font-size: ${sizes.font13};
    font-family: ${fonts.GilroyRegular};
    color: ${color.black};
`;

export default BlogCard;
