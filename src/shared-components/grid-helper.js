import styled from 'styled-components';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const MinHeight = styled.View`
  min-height: ${hp('25%')}px;
`;
