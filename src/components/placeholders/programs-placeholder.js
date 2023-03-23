import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {color} from '../../shared-components/helper';

const ProgramPlaceHolder = () => {
    return (
        <SkeletonPlaceholder
            highlightColor={color.inputBorder}
            backgroundColor={color.white}>
            <SkeletonPlaceholder.Item
                width={'100%'}
                height={100}
                borderRadius={10}
                marginBottom={20}
            />
        </SkeletonPlaceholder>
    );
};
export default ProgramPlaceHolder;
