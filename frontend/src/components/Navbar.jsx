import { Link } from 'react-router-dom';

function Navbar() {
  return (

      <nav className="navbar">
        <h1 className="navbar-title">Miss Akinator</h1>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">Главная</Link>
          <Link to="/game" className="navbar-link">Игра</Link>
          <Link to="/about" className="navbar-link">О игре</Link>
        </div>
      </nav>

  );
}

export default Navbar; 