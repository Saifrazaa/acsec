import React from 'react';
import Header from '../../shared-components/gradient-elements/gradient-header';
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
        <Header
            noBorder={noBorder}
            noSkew={noSkew}
            imgSrc={featured_image}
            noMarginBottom={noMarginBottom}>
            <HeaderWithText headerOptions={headerOptions} />
        </Header>
    );
};

export default MainHeader;
