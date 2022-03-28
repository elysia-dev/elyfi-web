import { render, screen } from '@testing-library/react';
import { SetStateAction } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import LanguageProvider from 'src/providers/LanguageProvider';
import Navigation from './Navigation';

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
  test('change network', () => {
    const navigation = render(
      <BrowserRouter>
        <Route>
          <Navigation
            hamburgerBar={false}
            setHamburgerBar={(value: SetStateAction<boolean>): void => {}}
          />
        </Route>
      </BrowserRouter>,
    );
  });
});
