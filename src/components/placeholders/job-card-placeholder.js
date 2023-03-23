import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import {color} from '../../shared-components/helper';

const JobCardPlaceHolder = () => {
    return (
        <View style={styles.card}>
            <SkeletonPlaceholder
                highlightColor={color.inputBorder}
                backgroundColor={color.white}>
                <SkeletonPlaceholder.Item style={styles.top}>
                    <SkeletonPlaceholder.Item width={'60%'} height={20} />
                </SkeletonPlaceholder.Item>
                <SkeletonPlaceholder.Item style={styles.bottom}>
                    <SkeletonPlaceholder.Item width={'20%'} height={20} />
                    <SkeletonPlaceholder.Item
                        width={80}
                        height={30}
                        borderRadius={20}
                    />
                </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: color.white,
        marginVertical: wp('2%'),
        padding: wp('5%'),
        justifyContent: 'space-between',
        borderRadius: wp('2%'),
        borderWidth: 1,
        borderColor: `${color.black}1A`,
    },
    top: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    bottom: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: wp('3%'),
    },
});
export default JobCardPlaceHolder;
