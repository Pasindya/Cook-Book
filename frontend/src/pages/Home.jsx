import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaArrowRight, FaStar } from 'react-icons/fa';
import heroImage from '../assets/noodles.jpg'; // Make sure you have this image in your assets

const Home = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      
      {/* Hero Section */}
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
            Join our community of food enthusiasts and elevate your cooking skills with our carefully curated recipes
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={styles.buttonContainer}
          >
            <Link to="/displayrecipe" style={styles.ctaButton}>
              Explore Recipes <FaArrowRight style={{ marginLeft: '8px' }} />
            </Link>
            <button style={styles.secondaryButton}>
              Watch Tutorials
            </button>
          </motion.div>

          <motion.div 
            style={styles.ratingContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} style={{ color: '#FFD700', fontSize: '1.2rem' }} />
              ))}
            </div>
            <p style={styles.ratingText}>Rated 4.9 by 10,000+ home cooks</p>
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

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Why Choose Our Recipes</h2>
        <div style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              style={styles.featureCard}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div style={styles.featureIcon}>{feature.icon}</div>
              <h3 style={styles.featureTitle}>{feature.title}</h3>
              <p style={styles.featureText}>{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Features data
const features = [
  {
    icon: '👨‍🍳',
    title: 'Professional Guidance',
    text: 'Recipes crafted by professional chefs with detailed instructions'
  },
  {
    icon: '⏱️',
    title: 'Quick Meals',
    text: '30-minute recipes for busy weeknights'
  },
  {
    icon: '🥗',
    title: 'Healthy Options',
    text: 'Nutritionist-approved meals for every diet'
  },
  {
    icon: '📱',
    title: 'Interactive Cooking',
    text: 'Step-by-step photos and video tutorials'
  }
];

// Styles
const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    color: '#333',
    maxWidth: '100%',
    overflowX: 'hidden',
    backgroundColor: '#fff'
  },
  heroSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4rem 6rem',
    backgroundColor: '#FFF9F9',
    minHeight: '80vh',
    flexWrap: 'wrap'
  },
  heroContent: {
    flex: 1,
    maxWidth: '600px',
    minWidth: '300px',
    padding: '1rem'
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
  buttonContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem'
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
    cursor: 'pointer',
    border: 'none'
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.8rem 1.8rem',
    backgroundColor: 'transparent',
    color: '#FF6B6B',
    borderRadius: '30px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    border: '2px solid #FF6B6B',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  heroImageContainer: {
    flex: 1,
    position: 'relative',
    maxWidth: '600px',
    minWidth: '300px',
    padding: '1rem'
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
    fontSize: '0.9rem'
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  stars: {
    display: 'flex',
    gap: '2px'
  },
  ratingText: {
    fontSize: '0.9rem',
    color: '#666'
  },
  featuresSection: {
    padding: '5rem 6rem',
    backgroundColor: 'white',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    marginBottom: '3rem',
    color: '#222'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  featureCard: {
    backgroundColor: '#FFF9F9',
    borderRadius: '15px',
    padding: '2rem',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease'
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '1rem'
  },
  featureTitle: {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '1rem',
    color: '#222'
  },
  featureText: {
    color: '#666',
    lineHeight: '1.6'
  }
};

export default Home;