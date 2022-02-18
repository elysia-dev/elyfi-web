import MediaQuery from 'src/enums/MediaQuery';

const isLeftTextOverFlowX = (x: number, tooltipPositionX: number) => {
  return tooltipPositionX < x;
};

const isRightTextOverFlowX = (x: number, tooltipPositionX: number) => {
  return tooltipPositionX > x;
};

const calculationPositionX = (x: number, tooltipPositionX: number) =>
  tooltipPositionX - x;

export const setTooltipBoxPositionX = (
  mediaQuery: MediaQuery,
  tooltipPositionX: number,
): number => {
  return isRightTextOverFlowX(1080, tooltipPositionX)
    ? calculationPositionX(210, tooltipPositionX)
    : isLeftTextOverFlowX(110, tooltipPositionX)
    ? calculationPositionX(20, tooltipPositionX)
    : mediaQuery === MediaQuery.Mobile &&
      isRightTextOverFlowX(250, tooltipPositionX)
    ? calculationPositionX(220, tooltipPositionX)
    : calculationPositionX(113, tooltipPositionX);
};

export const setDatePositionX = (
  mediaQuery: MediaQuery,
  tooltipPositionX: number,
): number => {
  return isLeftTextOverFlowX(25, tooltipPositionX)
    ? calculationPositionX(48, tooltipPositionX)
    : isRightTextOverFlowX(1150, tooltipPositionX)
    ? calculationPositionX(80, tooltipPositionX)
    : mediaQuery === MediaQuery.Mobile &&
      isRightTextOverFlowX(330, tooltipPositionX)
    ? calculationPositionX(80, tooltipPositionX)
    : calculationPositionX(60, tooltipPositionX);
};
