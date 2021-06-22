import '../../css/style.scss';
import Navigation from '../../component/Navigation';
import ServiceBackground from 'src/shared/images/service-background.png'
import ContractInformation from '../component/ContractInformation';
import { useHistory } from 'react-router-dom';

const Repay = () => {
  let history = useHistory();
  const TempAbToken = "0xB91e9f737B2227E92A373fb071b66B10eC6770d0"
  return (
    <>
      <section className="borrowers main" style={{ backgroundImage: `url(${ServiceBackground})` }}>
        <Navigation />
        <div className="main__title-wrapper">
          <h2 className="main__title-text">Repay</h2>
        </div>
      </section>
      <section className="borrowers__repay">
        <div className="borrowers__repay__title__wrapper">
          <p className="borrowers__repay__title bold">
            CONTRACT INFORMATION
          </p>
          <hr />
        </div>
        <table className="borrowers__repay__table">
          <thead>
            <td>
              <p>
                No.
              </p>
            </td>
            <td>
              <p>
                ABToken ID
              </p>
            </td>
            <td>
              <p>
                Borrowing Date
              </p>
            </td>
            <td>
              <p>
                Maturity Date
              </p>
            </td>
            <td />
          </thead>
          <tbody>
            <ContractInformation
              id={1}
              ABToken={TempAbToken}
              borrowDate={1607110465663}
              maturityDate={1623982671403}
              isLiquidation={false}
              onClick={() => {
                history.push(`/repay_detail/${TempAbToken}`)
              }}
            />
            <ContractInformation
              id={2}
              ABToken={TempAbToken}
              borrowDate={1607110465663}
              maturityDate={1607110465663}
              isLiquidation={false}
              onClick={() => {
                history.push(`/repay_detail/${TempAbToken}`)
              }}
            />
            <ContractInformation
              id={3}
              ABToken={"0xB91e9f737B2227E92A373fb071b66B10eC6770d0"}
              borrowDate={1607110465663}
              maturityDate={1673982671403}
              isLiquidation={false}
              onClick={() => {
                history.push(`/repay_detail/${TempAbToken}`)
              }}
            />
            <ContractInformation
              id={4}
              ABToken={"0xB91e9f737B2227E92A373fb071b66B10eC6770d0"}
              borrowDate={1607110465663}
              maturityDate={1673982671403}
              isLiquidation={true}
              onClick={() => {
                history.push(`/repay_detail/${TempAbToken}`)
              }}
            />
            <ContractInformation
              id={5}
              ABToken={"0xB91e9f737B2227E92A373fb071b66B10eC6770d0"}
              borrowDate={1507110465663}
              maturityDate={1673982671403}
              isLiquidation={false}
              onClick={() => {
                history.push(`/repay_detail/${TempAbToken}`)
              }}
            />
          </tbody>
        </table>
      </section>
    </>
  );
}

export default Repay;