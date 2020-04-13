import React from 'react';
// import { Link } from 'gatsby';

import Logo from '../assets/images/covid19-logo.png';

// import Container from 'components/Container';

const Header = () => {
  return (
    <header>
      <div className="logo-wrapper">
        <img src={Logo} alt="logo" />
      </div>
      <div className="title-wrapper">
        <p>Coronavirus COVID-19 Global Cases Dashboard by Liron Ezra</p>
      </div>
      {/* <Container type="content">
        <p>Coronavirus COVID-19 Global Cases</p>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2/">Page 2</Link>
          </li>
        </ul>
      </Container> */}
    </header>
  );
};

export default Header;
