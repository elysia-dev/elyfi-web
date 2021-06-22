import '../../css/style.scss';
// import { useTranslation } from 'react-i18next';
import { FunctionComponent, useEffect } from 'react';
import { withRouter, RouteComponentProps, useHistory } from "react-router";

interface MatchParams {
  value: string;
}


const RepayDetail: FunctionComponent<RouteComponentProps<MatchParams>> = ({ match }) => {
  // isExact false면 밖으로.
  // to do: 라우트 전송 방식 push로 변경하기
  let history = useHistory();
  // const { t } = useTranslation();
  console.log(match.params.value)
  useEffect(() => {
    if (match.params.value === undefined) {
      history.push('/');
      alert("잘못된 접근입니다.");
    }
  }, [history, match])
  return (
    <>
      <div>
        <p>{match.params.value}</p>
      </div>
    </>
  );
}

export default withRouter(RepayDetail);