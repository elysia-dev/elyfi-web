import 'src/stylesheets/style.scss';
import ServiceBackground from 'src/shared/images/service-background.png';
import { useQuery } from '@apollo/client';
import { GetReserve } from 'src/queries/__generated__/GetReserve';
import { GET_RESERVE } from 'src/queries/reserveQueries';
import { useParams } from 'react-router-dom';

const MarketDetail: React.FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const {
    loading,
    data,
    error,
  } = useQuery<GetReserve>(
    GET_RESERVE,
    {
      variables: { id },
    }
  )

  if (loading) return (<div> Loading </div>)
  if (error) return (<div> Error </div>)

  return (
    <>
      <section className="dashboard main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <div className="main__title-wrapper">
          <h4 className="main__title-text">Market Detail</h4>
        </div>
      </section>
      <div>
        {
          data?.reserve?.toatlDeposit
        }
      </div>
    </>
  );
}

export default MarketDetail;