import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { FaArrowRight, FaStar, FaUtensils, FaClock, FaHeart } from 'react-icons/fa';
import { GiCook } from 'react-icons/gi';
import heroImage from '../assets/noodles.jpg';
import foodPattern from '../assets/pizza.jpg'; // Add a subtle food pattern image

const Home = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const featureCards = [
    {
      icon: <GiCook size={32} />,
      title: "Professional Recipes",
      description: "Curated by top chefs around the world"
    },
    {
      icon: <FaClock size={28} />,
      title: "Quick Meals",
      description: "30-minute recipes for busy weeknights"
    },
    {
      icon: <FaHeart size={28} />,
      title: "Healthy Options",
      description: "Nutritionist-approved healthy meals"
    }
  ];

  return (
    <div style={styles.container}>
      {/* Background elements */}
      <div style={styles.backgroundPattern}></div>
      
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <motion.section 
          style={styles.heroSection}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div style={styles.heroContent}>
            <motion.div variants={itemVariants}>
              <div style={styles.badge}>
                <FaStar style={{ color: '#FFD700', marginRight: '5px' }} />
                Chef's Choice 2024
              </div>
            </motion.div>
            
            <motion.h1 
              style={styles.heroTitle}
              variants={itemVariants}
            >
              Transform Your <span style={styles.highlight}>Cooking</span> <br />
              With <span style={styles.highlight}>Pro</span> Guidance
            </motion.h1>
            
            <motion.p 
              style={styles.heroSubtitle}
              variants={itemVariants}
            >
              Discover thousands of chef-approved recipes with step-by-step video guides, 
              personalized recommendations, and a vibrant cooking community.
            </motion.p>
            
            <motion.div
              style={styles.buttonGroup}
              variants={itemVariants}
            >
              <Link to="/displayrecipe" style={styles.ctaButton}>
                Explore Recipes <FaArrowRight style={{ marginLeft: '8px' }} />
              </Link>
              <Link to="/about" style={styles.secondaryButton}>
                How It Works
              </Link>
            </motion.div>
            
            <motion.div 
              style={styles.statsContainer}
              variants={itemVariants}
            >
              <div style={styles.statItem}>
                <div style={styles.statNumber}>10K+</div>
                <div style={styles.statLabel}>Recipes</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>500+</div>
                <div style={styles.statLabel}>Chefs</div>
              </div>
              <div style={styles.statItem}>
                <div style={styles.statNumber}>1M+</div>
                <div style={styles.statLabel}>Community</div>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            style={styles.heroImageContainer}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: {
                opacity: 1,
                scale: 1,
                transition: { delay: 0.3, duration: 0.8 }
              }
            }}
          >
            <div style={styles.imageWrapper}>
              <img 
                src={heroImage} 
                alt="Delicious food"
                style={styles.heroImage}
              />
              <div style={styles.imageDecoration}></div>
            </div>
            
            <div style={styles.userTestimonial}>
              <div style={styles.userAvatar}></div>
              <div>
                <div style={styles.testimonialText}>
                  "This app changed my cooking forever!"
                </div>
                <div style={styles.userName}>- Sarah, Home Cook</div>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <section style={styles.featuresSection}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionSubtitle}>Why Choose Us</div>
            <h2 style={styles.sectionTitle}>Cook With Confidence</h2>
          </div>
          
          <div style={styles.featuresGrid}>
            {featureCards.map((feature, index) => (
              <motion.div 
                key={index}
                style={styles.featureCard}
                whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
                transition={{ duration: 0.3 }}
              >
                <div style={styles.featureIcon}>
                  {feature.icon}
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Poppins', sans-serif",
    color: '#2E2E2E',
    maxWidth: '100%',
    overflowX: 'hidden',
    position: 'relative',
    backgroundColor: '#FFFCFA',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${foodPattern})`,
    backgroundSize: '400px',
    opacity: 0.03,
    zIndex: 0,
  },
  heroSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6rem 8rem',
    minHeight: '90vh',
    position: 'relative',
    zIndex: 1,
    maxWidth: '1600px',
    margin: '0 auto',
  },
  heroContent: {
    flex: 1,
    maxWidth: '600px',
    position: 'relative',
    zIndex: 2,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: '0.6rem 1.2rem',
    borderRadius: '30px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
    fontWeight: '600',
    fontSize: '0.9rem',
    marginBottom: '1.5rem',
  },
  heroTitle: {
    fontSize: '3.8rem',
    fontWeight: '800',
    lineHeight: '1.2',
    marginBottom: '1.8rem',
    color: '#222',
    letterSpacing: '-0.5px',
  },
  highlight: {
    background: 'linear-gradient(90deg, #FF6B6B, #FF8E53)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#666',
    marginBottom: '2.5rem',
    lineHeight: '1.7',
    maxWidth: '90%',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '3rem',
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#FF6B6B',
    color: 'white',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    boxShadow: '0 4px 20px rgba(255, 107, 107, 0.3)',
    transition: 'all 0.3s ease',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
      backgroundColor: '#FF5A5A',
    },
  },
  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    color: '#666',
    border: '1px solid #DDD',
    borderRadius: '50px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    ':hover': {
      backgroundColor: '#F8F8F8',
      borderColor: '#CCC',
    },
  },
  statsContainer: {
    display: 'flex',
    gap: '2.5rem',
    marginTop: '1rem',
  },
  statItem: {
    textAlign: 'center',
  },
  statNumber: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: '0.3rem',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#888',
    fontWeight: '500',
  },
  heroImageContainer: {
    flex: 1,
    position: 'relative',
    maxWidth: '600px',
    zIndex: 1,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 30px 60px rgba(0, 0, 0, 0.12)',
    transform: 'perspective(1000px) rotateY(-10deg)',
  },
  heroImage: {
    width: '100%',
    display: 'block',
    transition: 'transform 0.5s ease',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },
  imageDecoration: {
    position: 'absolute',
    top: '-20px',
    left: '-20px',
    right: '-20px',
    bottom: '-20px',
    border: '2px dashed rgba(255, 107, 107, 0.3)',
    borderRadius: '30px',
    zIndex: -1,
  },
  userTestimonial: {
    position: 'absolute',
    bottom: '-40px',
    left: '40px',
    backgroundColor: 'white',
    padding: '1.2rem',
    borderRadius: '15px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    maxWidth: '300px',
    zIndex: 2,
  },
  userAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#F5F5F5',
    backgroundImage: 'linear-gradient(45deg, #FF9A9E, #FAD0C4)',
  },
  testimonialText: {
    fontWeight: '600',
    marginBottom: '0.3rem',
  },
  userName: {
    fontSize: '0.8rem',
    color: '#888',
  },
  featuresSection: {
    padding: '6rem 8rem',
    backgroundColor: '#FFF',
    position: 'relative',
    zIndex: 1,
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  sectionSubtitle: {
    color: '#FF6B6B',
    fontWeight: '600',
    letterSpacing: '1px',
    marginBottom: '0.8rem',
    textTransform: 'uppercase',
    fontSize: '0.9rem',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#222',
    marginBottom: '1rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  featureCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '2.5rem 2rem',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  },
  featureIcon: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    color: '#FF6B6B',
  },
  featureTitle: {
    fontSize: '1.4rem',
    fontWeight: '700',
    marginBottom: '1rem',
    color: '#333',
  },
  featureDescription: {
    color: '#777',
    lineHeight: '1.6',
    fontSize: '1rem',
  },
};

export default Home;