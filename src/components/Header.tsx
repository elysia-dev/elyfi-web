import ServiceBackground from 'src/assets/images/service-background.png';
import { FunctionComponent } from 'react';

interface Props {
  title: string;
}

const Header: FunctionComponent<Props> = ({ title }) => {
  return (
    <section
      className="header"
      style={{ backgroundImage: `url(${ServiceBackground})` }}
    >
      <div className="header__title__wrapper">
        <h2 className="header__title">{title}</h2>
      </div>
    </section>
  );
};

export default Header;
