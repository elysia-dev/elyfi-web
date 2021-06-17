import '../../css/style.scss';
import Navigation from '../../component/Navigation';
import ServiceBackground from '../../../../shared/images/service-background.png'
import { useTranslation } from 'react-i18next';

const Borrowers = () => {
  // const { tokenlist } = useContext(TokenContext);
  const { t } = useTranslation();
  // const { userType } = useContext(WalletContext)

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
              <tr>
                <th>
                  <p>
                    01
                  </p>
                </th>
                <th>
                  <p>
                    {"{xxxxxx….xxxxxxxx}"}
                  </p>
                </th>
                <th>
                  <p>
                    2021-05-21
                  </p>
                </th>
                <th>
                  <p>
                    2021-06-21
                  </p>
                </th>
                <th>
                  <div className="borrowers__repay__table__button">
                    <p>
                      D-12
                    </p>
                  </div>
                </th>
              </tr>
              <tr>
                <th>
                  <p>
                    01
                  </p>
                </th>
                <th>
                  <p>
                    {"{xxxxxx….xxxxxxxx}"}
                  </p>
                </th>
                <th>
                  <p>
                    2021-05-21
                  </p>
                </th>
                <th>
                  <p>
                    2021-06-21
                  </p>
                </th>
                <th>
                  <div className="borrowers__repay__table__button--disable">
                    <p>
                      D-12
                    </p>
                  </div>
                </th>
              </tr>
              <tr>
                <th>
                  <p>
                    01
                  </p>
                </th>
                <th>
                  <p>
                    {"{xxxxxx….xxxxxxxx}"}
                  </p>
                </th>
                <th>
                  <p>
                    2021-05-21
                  </p>
                </th>
                <th>
                  <p>
                    2021-06-21
                  </p>
                </th>
                <th>
                  <div className="borrowers__repay__table__button">
                    <p>
                      D-12
                    </p>
                  </div>
                </th>
              </tr>
            </tbody>
          </table>
        </section>  
      </>
  );
}

export default Borrowers;