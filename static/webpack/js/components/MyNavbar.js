import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/js/dist/dropdown';

class Nav extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand navbar-dark bg-dark sticky-top">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link" to="/ml">Home</Link>
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
              <Link className="dropdown-item" to="/ml/fish-identifier">Fish Identification</Link>
            </div>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
