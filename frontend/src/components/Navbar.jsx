import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaUtensils, 
  FaTrophy, 
  FaUsers, 
  FaUserCircle, 
  FaSearch, 
  FaPlus,
  FaChevronDown,
  FaSignOutAlt,
  FaBell,
  FaRegBell
} from 'react-icons/fa';
import { MdOutlinePostAdd, MdExplore } from 'react-icons/md';
import { RiLiveLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCreateDropdown, setShowCreateDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: "/all-recipes", icon: <MdExplore />, label: "Explore" },
    { path: "/challengers", icon: <FaTrophy />, label: "Challenges" },
    { path: "/community", icon: <RiLiveLine />, label: "Live" },
    { path: "/groups", icon: <FaUsers />, label: "Groups" }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        ...styles.navbar,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.98)' : '#ffffff',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
      }}
    >
      {/* Left Section - Brand */}
      <div style={styles.brandSection}>
        <Link to="/" style={styles.brandLink}>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUtensils style={styles.logo} />
          </motion.div>
          <motion.span 
            style={styles.brandName}
            whileHover={{ backgroundPosition: '100%' }}
          >
            SkillChef
          </motion.span>
        </Link>
      </div>
      
      {/* Middle Section - Search */}
      <div style={styles.searchSection}>
        <motion.div 
          style={styles.searchContainer}
          whileHover={{ boxShadow: '0 0 0 3px rgba(255, 107, 107, 0.2)' }}
        >
          <input 
            type="text" 
            placeholder="Search recipes, challenges, users..." 
            style={styles.searchInput}
          />
          <motion.button 
            style={styles.searchButton}
            whileHover={{ color: '#FF6B6B' }}
            whileTap={{ scale: 0.9 }}
          >
            <FaSearch style={styles.searchIcon} />
          </motion.button>
        </motion.div>
      </div>
      
      {/* Right Section - Navigation */}
      <div style={styles.navSection}>
        {/* Create Dropdown */}
        <div 
          style={styles.createContainer}
          onMouseEnter={() => setShowCreateDropdown(true)}
          onMouseLeave={() => setShowCreateDropdown(false)}
        >
          <motion.button 
            style={styles.createButton}
            whileHover={{ 
              backgroundColor: '#FF5252',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
            }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus style={styles.plusIcon} />
            <span style={styles.createText}>Create</span>
            <motion.div
              animate={{ rotate: showCreateDropdown ? 180 : 0 }}
            >
              <FaChevronDown style={styles.chevronIcon} />
            </motion.div>
          </motion.button>
          
          <AnimatePresence>
            {showCreateDropdown && (
              <motion.div
                style={styles.dropdownMenu}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  to="/recipeAdd" 
                  style={styles.dropdownItem}
                  onClick={() => setShowCreateDropdown(false)}
                >
                  <MdOutlinePostAdd style={styles.dropdownIcon} />
                  <span>Add Recipe</span>
                  <motion.span 
                    style={styles.dropdownBadge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    New
                  </motion.span>
                </Link>
                <Link 
                  to="/addchallengers" 
                  style={styles.dropdownItem}
                  onClick={() => setShowCreateDropdown(false)}
                >
                  <FaTrophy style={styles.dropdownIcon} />
                  <span>Add Challenge</span>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Notification Bell */}
        <div 
          style={styles.notificationContainer}
          onMouseEnter={() => setShowNotifications(true)}
          onMouseLeave={() => setShowNotifications(false)}
        >
          <motion.button 
            style={styles.notificationButton}
            whileTap={{ scale: 0.9 }}
          >
            {hasNotifications ? (
              <div style={{ position: 'relative' }}>
                <FaBell style={{ ...styles.notificationIcon, color: '#FF6B6B' }} />
                <motion.div
                  style={styles.notificationBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    scale: { type: 'spring', stiffness: 500, damping: 15 }
                  }}
                />
              </div>
            ) : (
              <FaRegBell style={styles.notificationIcon} />
            )}
          </motion.button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div
                style={styles.notificationDropdown}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div style={styles.notificationHeader}>
                  <h3>Notifications</h3>
                  <button 
                    style={styles.markAsReadButton}
                    onClick={() => setHasNotifications(false)}
                  >
                    Mark all as read
                  </button>
                </div>
                <div style={styles.notificationContent}>
                  {hasNotifications ? (
                    <>
                      <div style={styles.notificationItem}>
                        <div style={styles.notificationDot} />
                        <p>New recipe from Chef John matches your preferences</p>
                      </div>
                      <div style={styles.notificationItem}>
                        <div style={styles.notificationDot} />
                        <p>Your challenge submission got 15 new votes</p>
                      </div>
                    </>
                  ) : (
                    <p style={styles.noNotifications}>No new notifications</p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Main Nav Links */}
        <div style={styles.mainLinks}>
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path} 
              style={{
                ...styles.navLink,
                color: location.pathname.includes(link.path) ? '#FF6B6B' : '#555'
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.icon}
              </motion.div>
              {location.pathname.includes(link.path) && (
                <motion.div 
                  style={styles.activeIndicator}
                  layoutId="activeIndicator"
                />
              )}
            </Link>
          ))}
        </div>
        
        {/* User Dropdown */}
        <div 
          style={styles.userContainer}
          onMouseEnter={() => setShowUserDropdown(true)}
          onMouseLeave={() => setShowUserDropdown(false)}
        >
          <motion.button 
            style={styles.userButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUserCircle style={{
              ...styles.userIcon,
              color: showUserDropdown ? '#FF6B6B' : '#555'
            }} />
          </motion.button>
          
          <AnimatePresence>
            {showUserDropdown && (
              <motion.div
                style={styles.userDropdown}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div style={styles.userInfo}>
                  <FaUserCircle style={styles.userDropdownIcon} />
                  <div>
                    <h3 style={styles.userName}>John Doe</h3>
                    <p style={styles.userEmail}>john@example.com</p>
                  </div>
                </div>
                
                <Link to="/profile" style={styles.dropdownItem}>
                  <span>My Profile</span>
                </Link>
                <Link to="/displayrecipe" style={styles.dropdownItem}>
                  <span>My Recipes</span>
                </Link>
                <Link to="/saved" style={styles.dropdownItem}>
                  <span>Saved Items</span>
                </Link>
                
                <div style={styles.dropdownDivider}></div>
                
                <Link to="/displaychallengers" style={styles.dropdownItem}>
                  <span>My Challengers</span>
                </Link>
                
                <div style={styles.dropdownDivider}></div>
                
                <motion.button 
                  style={styles.logoutButton}
                  whileHover={{ backgroundColor: 'rgba(255, 68, 68, 0.1)' }}
                >
                  <FaSignOutAlt style={styles.logoutIcon} />
                  <span>Log Out</span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem 3rem',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
  },
  
  // Brand Section
  brandSection: {
    flex: '0 0 200px',
  },
  brandLink: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    gap: '0.6rem',
  },
  logo: {
    fontSize: '2.2rem',
    color: '#FF6B6B',
  },
  brandName: {
    fontSize: '1.7rem',
    fontWeight: 'bold',
    fontFamily: "'Pacifico', cursive",
    background: 'linear-gradient(45deg, #FF6B6B, #FF8E53, #FF6B6B)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    transition: 'background-position 0.5s ease',
  },
  
  // Search Section
  searchSection: {
    flex: 1,
    maxWidth: '600px',
    margin: '0 2rem',
  },
  searchContainer: {
    display: 'flex',
    width: '100%',
    position: 'relative',
    borderRadius: '30px',
    transition: 'all 0.3s ease',
  },
  searchInput: {
    width: '100%',
    padding: '0.7rem 1.2rem',
    paddingRight: '3rem',
    border: '1px solid #e0e0e0',
    borderRadius: '30px',
    outline: 'none',
    fontSize: '0.95rem',
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    transition: 'all 0.3s ease',
  },
  searchButton: {
    position: 'absolute',
    right: '0',
    top: '0',
    height: '100%',
    padding: '0 1.2rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0 30px 30px 0',
    cursor: 'pointer',
    color: '#777',
    transition: 'all 0.3s ease',
  },
  searchIcon: {
    fontSize: '1rem',
  },
  
  // Navigation Section
  navSection: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  
  // Create Dropdown
  createContainer: {
    position: 'relative',
  },
  createButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.2rem',
    backgroundColor: '#FF6B6B',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 10px rgba(255, 107, 107, 0.3)',
  },
  plusIcon: {
    fontSize: '0.9rem',
  },
  createText: {
    marginRight: '0.3rem',
  },
  chevronIcon: {
    fontSize: '0.8rem',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '0',
    width: '220px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: '0.5rem 0',
    marginTop: '0.5rem',
    zIndex: 100,
    border: '1px solid rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.8rem 1.2rem',
    textDecoration: 'none',
    color: '#333',
    fontSize: '0.9rem',
    transition: 'all 0.2s ease',
    position: 'relative',
    ':hover': {
      backgroundColor: 'rgba(255, 107, 107, 0.05)',
      color: '#FF6B6B',
    },
  },
  dropdownIcon: {
    fontSize: '1rem',
    color: '#777',
  },
  dropdownBadge: {
    position: 'absolute',
    right: '1rem',
    backgroundColor: '#FF6B6B',
    color: 'white',
    fontSize: '0.7rem',
    padding: '0.1rem 0.4rem',
    borderRadius: '10px',
  },
  
  // Notification
  notificationContainer: {
    position: 'relative',
  },
  notificationButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    position: 'relative',
  },
  notificationIcon: {
    fontSize: '1.3rem',
    color: '#555',
  },
  notificationBadge: {
    position: 'absolute',
    top: '0',
    right: '0',
    width: '8px',
    height: '8px',
    backgroundColor: '#FF6B6B',
    borderRadius: '50%',
  },
  notificationDropdown: {
    position: 'absolute',
    right: '0',
    top: '100%',
    width: '350px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: '0.8rem',
    marginTop: '0.8rem',
    zIndex: 100,
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  notificationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.8rem',
    h3: {
      margin: '0',
      fontSize: '1rem',
    },
  },
  markAsReadButton: {
    background: 'none',
    border: 'none',
    color: '#FF6B6B',
    fontSize: '0.8rem',
    cursor: 'pointer',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    ':hover': {
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
    },
  },
  notificationContent: {
    maxHeight: '300px',
    overflowY: 'auto',
  },
  notificationItem: {
    display: 'flex',
    gap: '0.8rem',
    padding: '0.8rem 0',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    p: {
      margin: '0',
      fontSize: '0.9rem',
      color: '#555',
    },
  },
  notificationDot: {
    minWidth: '8px',
    height: '8px',
    backgroundColor: '#FF6B6B',
    borderRadius: '50%',
    marginTop: '0.4rem',
  },
  noNotifications: {
    textAlign: 'center',
    color: '#888',
    padding: '1rem 0',
    margin: '0',
  },
  
  // Main Navigation Links
  mainLinks: {
    display: 'flex',
    gap: '1.5rem',
  },
  navLink: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.3rem',
    textDecoration: 'none',
    color: '#555',
    fontSize: '1.1rem',
    padding: '0.5rem',
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: '0',
    width: '20px',
    height: '3px',
    backgroundColor: '#FF6B6B',
    borderRadius: '3px',
  },
  
  // User Dropdown
  userContainer: {
    position: 'relative',
  },
  userButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
  },
  userIcon: {
    fontSize: '1.8rem',
    transition: 'all 0.3s ease',
  },
  userDropdown: {
    position: 'absolute',
    right: '0',
    top: '100%',
    width: '250px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    padding: '0.8rem',
    marginTop: '0.8rem',
    zIndex: 100,
    border: '1px solid rgba(0, 0, 0, 0.05)',
  },
  userInfo: {
    display: 'flex',
    gap: '0.8rem',
    alignItems: 'center',
    padding: '0.5rem 0.8rem',
    marginBottom: '0.5rem',
  },
  userDropdownIcon: {
    fontSize: '2rem',
    color: '#555',
  },
  userName: {
    margin: '0',
    fontSize: '0.95rem',
    fontWeight: '600',
  },
  userEmail: {
    margin: '0',
    fontSize: '0.8rem',
    color: '#888',
  },
  dropdownDivider: {
    height: '1px',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    margin: '0.5rem 0',
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    width: '100%',
    padding: '0.7rem 1.2rem',
    background: 'none',
    border: 'none',
    color: '#ff4444',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    borderRadius: '6px',
  },
  logoutIcon: {
    fontSize: '0.9rem',
  },
};

export default Navbar;