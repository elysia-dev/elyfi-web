import { useEffect, useState, useContext } from 'react';
import PageContext, { initialPageContext, IPageContext } from '../contexts/PageContext';
import WalletContext from '../contexts/WalletContext';
import { ServicePage } from '../enums/pageEnum';
import UserType from '../enums/UserType';

const PageProvider: React.FC = (props) => {
  const [state, setState] = useState<IPageContext>(initialPageContext);
  const { userType } = useContext(WalletContext);
  
  const setPage = (navigation: ServicePage) => {
    setState({ ...state, page: navigation })
  }

  const InitialRoutePage = () => {
    switch (userType) {
      case UserType.Borrowers:
        setState({ ...state, page: ServicePage.Borrow })
        break;
      case UserType.Collateral:
        setState({ ...state, page: ServicePage.Deposit })
        break;
      
      case UserType.User:
      case UserType.Guest:
      default:

        setState({ ...state, page: ServicePage.Dashboard })
        break;
    }
  }

  useEffect(() => {
    InitialRoutePage()
  }, [userType]);


  return (
    <PageContext.Provider value={{
      ...state,
      setPage
    }}>
      {props.children}
    </PageContext.Provider>
  );
}

export default PageProvider;