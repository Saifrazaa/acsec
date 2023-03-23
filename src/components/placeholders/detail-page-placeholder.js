import React from 'react';
import {StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {color} from '../../shared-components/helper';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const DetailPagePlaceholder = () => {
    return (
        <SkeletonPlaceholder
            highlightColor={color.inputBorder}
            backgroundColor={color.white}>
            {[...Array(2).keys()].map((item, index) => {
                return (
                    <SkeletonPlaceholder.Item
                        marginBottom={wp('12%')}
                        key={index}>
                        <SkeletonPlaceholder.Item width={'30%'} height={20} />
                        <SkeletonPlaceholder.Item
                            width={'100%'}
                            height={20}
                            marginTop={10}
                        />
                        <SkeletonPlaceholder.Item
                            width={'90%'}
                            height={20}
                            marginTop={10}
                        />
                        <SkeletonPlaceholder.Item
                            width={'50%'}
                            height={20}
                            marginTop={10}
                        />
                        <SkeletonPlaceholder.Item
                            width={'95%'}
                            height={20}
                            marginTop={10}
                        />
                        <SkeletonPlaceholder.Item
                            width={'80%'}
                            height={20}
                            marginTop={10}
                        />
                    </SkeletonPlaceholder.Item>
                );
            })}
        </SkeletonPlaceholder>
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
});
export default DetailPagePlaceholder;
