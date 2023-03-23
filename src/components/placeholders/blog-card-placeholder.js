import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {color} from '../../shared-components/helper';

const BlogCardPlaceholder = () => {
    return (
        <View style={styles.card}>
            <SkeletonPlaceholder
                highlightColor={color.inputBorder}
                backgroundColor={color.white}>
                <SkeletonPlaceholder.Item style={{flexDirection: 'row'}}>
                    <SkeletonPlaceholder.Item>
                        <SkeletonPlaceholder.Item
                            width={wp('25%')}
                            height={wp('20%')}
                        />
                    </SkeletonPlaceholder.Item>
                    <SkeletonPlaceholder.Item style={styles.right}>
                        <SkeletonPlaceholder.Item width={'100%'} height={20} />
                        <SkeletonPlaceholder.Item width={'20%'} height={20} />
                    </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: color.white,
        marginVertical: wp('2%'),
        padding: wp('3%'),
        justifyContent: 'space-between',
        borderRadius: wp('2%'),
        borderWidth: 1,
        borderColor: `${color.black}1A`,
    },
    right: {
        justifyContent: 'space-between',
        flexDirection: 'column',
        marginLeft: wp('5%'),
        flex: 1,
    },
});
export default BlogCardPlaceholder;
