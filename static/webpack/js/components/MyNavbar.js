import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/js/dist/dropdown';
import { ROOT_URL, FISH_IDENTIFICATION_URL } from '../consts';

const MyNavbar = () => (
  <nav className="navbar navbar-expand navbar-dark bg-dark sticky-top">
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link className="nav-link" to={ROOT_URL}>Home</Link>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="http://leozhu.org/">My Portfolio</a>
      </li>
      <li className="nav-item dropdown">
        <a
          className="nav-link dropdown-toggle"
          href="#"
          id="navbarDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
        Projects
        </a>
        <div className="dropdown-menu" aria-labelledby="navbarDropdown">
          <Link className="dropdown-item" to={FISH_IDENTIFICATION_URL}>
            Fish Identification
          </Link>
        </div>
      </li>
    </ul>
  </nav>
);

export default MyNavbar;
