import { render, screen } from '@testing-library/react';
import { SetStateAction } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Navigation from '.';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    lng: 'ko',
  }),
  useLocation: () => ({
    pathname: '/ko',
    hash: '',
    search: '',
    state: '',
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('Navigation component test', () => {
  test('navigation render', () => {
    render(
      <BrowserRouter>
        <Route>
          <Navigation
            hamburgerBar={false}
            setHamburgerBar={(value: SetStateAction<boolean>): void => {}}
          />
        </Route>
      </BrowserRouter>,
    );
    expect(screen.getByText('NAVIGATION.DASHBOARD')).toBeInTheDocument();
    expect(screen.getByText('NAVIGATION.GOVERNANCE')).toBeInTheDocument();
    expect(screen.getByText('NAVIGATION.STAKING')).toBeInTheDocument();
    expect(screen.getByText('NAVIGATION.ELYFI_DOCS')).toBeInTheDocument();
  });
});
