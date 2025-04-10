import React from 'react';
import { Link } from 'react-router-dom';
import { FaUtensils, FaTrophy, FaUsers, FaUserCircle, FaSearch } from 'react-icons/fa';

function Navbar() {
  return (
    <nav className="navbar" style={styles.navbar}>
      <div className="navbar-brand" style={styles.brand}>
        <Link to="/" style={styles.brandLink}>
          <FaUtensils style={styles.logo} />
          <span style={styles.brandName}>SkillChef</span>
        </Link>
      </div>
      
      <div className="search-bar" style={styles.searchBar}>
        <input 
          type="text" 
          placeholder="Search recipes or challenges..." 
          style={styles.searchInput}
        />
        <button style={styles.searchButton}>
          <FaSearch />
        </button>
      </div>
      
      <div className="nav-links" style={styles.navLinks}>
        <Link to="/recipes" style={styles.link}>
          <span style={styles.linkText}>Recipes</span>
        </Link>
        <Link to="/challenges" style={styles.link}>
          <span style={styles.linkText}>Challenges</span>
          <FaTrophy style={styles.challengeIcon} />
        </Link>
        <Link to="/community" style={styles.link}>
          <span style={styles.linkText}>Community</span>
          <FaUsers style={styles.communityIcon} />
        </Link>
      </div>
      
      <div className="user-section" style={styles.userSection}>
        <Link to="/profile" style={styles.profileLink}>
          <FaUserCircle style={styles.profileIcon} />
        </Link>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
  },
  brandLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#333',
  },
  logo: {
    fontSize: '2rem',
    color: '#ff6b6b',
    marginRight: '0.5rem',
  },
  brandName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    fontFamily: "'Pacifico', cursive",
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    flexGrow: 1,
    maxWidth: '500px',
    margin: '0 2rem',
  },
  searchInput: {
    width: '100%',
    padding: '0.6rem 1rem',
    border: '1px solid #ddd',
    borderRadius: '25px 0 0 25px',
    outline: 'none',
    fontSize: '1rem',
  },
  searchButton: {
    padding: '0.6rem 1rem',
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    borderRadius: '0 25px 25px 0',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  navLinks: {
    display: 'flex',
    gap: '2rem',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    display: 'flex',
    alignItems: 'center',
    gap: '0.3rem',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'color 0.3s',
  },
  linkText: {
    position: 'relative',
  },
  challengeIcon: {
    color: '#ffb347',
  },
  communityIcon: {
    color: '#4ecdc4',
  },
  userSection: {
    marginLeft: '1rem',
  },
  profileLink: {
    color: '#333',
    textDecoration: 'none',
  },
  profileIcon: {
    fontSize: '1.8rem',
    transition: 'transform 0.3s',
  },
};

// Add this to your index.css or App.css:
// @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

export default Navbar;