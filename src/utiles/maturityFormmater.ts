import moment from 'moment';
import { GetAllAssetBonds_assetBondTokens } from 'src/queries/__generated__/GetAllAssetBonds';

const maturityFormmater = (
  abToken: GetAllAssetBonds_assetBondTokens | null | undefined,
): string => {
  if (!abToken?.maturityTimestamp) return '-';
  if (
    [
      '115792089237316195422007842550160057480242544124026915590235438085798243682305',
      '115792089237316195422003246560115133569889959670500140029773979402763407280130',
      '115792089237316195422003243566959781407826596536939727611378482858659319728131',
    ].includes(abToken.id)
  ) {
    return moment(abToken.maturityTimestamp * 1000)
      .subtract(1, 'days')
      .format('YYYY.MM.DD');
  }

  return moment(abToken.maturityTimestamp * 1000).format('YYYY.MM.DD');
};

export default maturityFormmater;
