import '../../css/style.scss';
import Navigation from '../../component/Navigation';
import ServiceBackground from '../../../../shared/images/service-background.png'
import { useTranslation } from 'react-i18next';
import { FunctionComponent, useEffect } from 'react';
import { withRouter, RouteComponentProps, useHistory } from "react-router";

interface MatchParams {
  value: string;
}


const RepayDetail: FunctionComponent<RouteComponentProps<MatchParams>> = ({ match }) => {
  // isExact false면 밖으로.
  let history = useHistory();
  const { t } = useTranslation();
  console.log(match.params.value)
  useEffect(() => {
    if (match.params.value === undefined) {
      history.push('/');
      alert("잘못된 접근입니다.");
    }
  }, [])
  return (
      <>
        <div>
          <p>{match.params.value}</p>
        </div>
      </>
  );
}

export default withRouter(RepayDetail);