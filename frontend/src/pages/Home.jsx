import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import heroImage from '../assets/noodles.jpg'; // Your image

const Home = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      
      {/* Hero Section Only */}
      <motion.section 
        style={styles.heroSection}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div style={styles.heroContent}>
          <motion.h1 
            style={styles.heroTitle}
            initial={{ y: -50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Cook Like a <span style={styles.highlight}>Pro Chef</span> <br />With Easy-to-Follow Recipes
          </motion.h1>
          
          <motion.p 
            style={styles.heroSubtitle}
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Join our community of food enthusiasts and elevate your cooking skills
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link to="/displayrecipe" style={styles.ctaButton}>
              Explore Recipes <FaArrowRight style={{ marginLeft: '8px' }} />
            </Link>
          </motion.div>
        </div>
        
        <div style={styles.heroImageContainer}>
          <motion.img 
            src={heroImage} 
            alt="Delicious food"
            style={styles.heroImage}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          />
          <motion.div 
            style={styles.heroBadge}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 }}
          >
            <FaStar style={{ color: '#FFD700', marginRight: '5px' }} />
            Chef's Choice
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

// Simplified styles object
const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    color: '#333',
    maxWidth: '100%',
    overflowX: 'hidden',
  },
  heroSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4rem 6rem',
    backgroundColor: '#FFF9F9',
    minHeight: '80vh',
  },
  heroContent: {
    flex: 1,
    maxWidth: '600px',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: '700',
    lineHeight: '1.2',
    marginBottom: '1.5rem',
    color: '#222',
  },
  highlight: {
    background: 'linear-gradient(45deg, #FF6B6B, #FF8E53)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  heroSubtitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '2rem',
    lineHeight: '1.6',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.8rem 1.8rem',
    backgroundColor: '#FF6B6B',
    color: 'white',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
    },
  },
  heroImageContainer: {
    flex: 1,
    position: 'relative',
    maxWidth: '600px',
  },
  heroImage: {
    width: '100%',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
  },
  heroBadge: {
    position: 'absolute',
    top: '-15px',
    right: '-15px',
    backgroundColor: 'white',
    padding: '0.8rem 1.2rem',
    borderRadius: '30px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '600',
  },
};

export default Home;