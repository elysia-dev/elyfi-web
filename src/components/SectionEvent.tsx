
import MainContent from 'src/components/MainContent';
import MainAnimation from 'src/components/MainAnimation';
import reactGA from 'react-ga';
import PageEventType from 'src/enums/PageEventType';
import ButtonEventType from 'src/enums/ButtonEventType';
import { useParams } from 'react-router-dom';

const SectionEvent = (): JSX.Element => {
  const { lng } = useParams<{ lng: string }>();
  
  const eventList = [
    {
      image: MainAnimation(0),
      link: `/${lng}/rewardplan/deposit`,
      ga: () => {
        reactGA.event({
          category: PageEventType.MoveToInternalPage,
          action: ButtonEventType.CheckInterestRateButton,
        });
      },
    },
    {
      image: MainAnimation(1),
      link: `/${lng}/deposit`,
      ga: () => {
        reactGA.event({
          category: PageEventType.MoveToInternalPage,
          action: ButtonEventType.CheckCollateralButton,
        });
      },
    },
    {
      image: MainAnimation(2),
      link: `/${lng}/governance`,
      ga: () => {
        reactGA.event({
          category: PageEventType.MoveToInternalPage,
          action: ButtonEventType.CheckGovernanceButton,
        });
      },
    },
  ];
  return <>
  {
    eventList.map((_data, _index) => {
      return (
        <MainContent
          key={`sectionEvent_${_index}`}
          index={_index}
          data={_data}
        />
      );
    })
  }
  </>
}

export default SectionEvent;