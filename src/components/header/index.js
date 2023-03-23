import React from 'react';
import GradientHeader from '../../shared-components/gradient-elements/gradient-header';
import HeaderWithBg from './header-with-bg';
import HeaderWithText from './header-with-text';

const MainHeader = ({headerOptions}) => {
    const {
        noBorder,
        programmePage,
        featuredProgramme,
        noMarginBottom,
        noSkew,
        imgSrc,
    } = headerOptions;
    const featured_image =
        programmePage && featuredProgramme
            ? {uri: featuredProgramme.featured_image}
            : imgSrc;
    return (
        <GradientHeader
            noBorder={noBorder}
            noSkew={noSkew}
            imgSrc={featured_image}
            noMarginBottom={noMarginBottom}>
            {(programmePage && (
                <HeaderWithBg headerOptions={headerOptions} />
            )) || <HeaderWithText headerOptions={headerOptions} />}
        </GradientHeader>
    );
};

export default MainHeader;
