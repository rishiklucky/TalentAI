import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiShield, FiZap, FiActivity, FiChevronDown, FiBookOpen } from 'react-icons/fi';
import Footer from '../components/Footer';

const LandingPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { number: '98%', label: 'ATS Accuracy', desc: 'Industry-standard precision in parsing and identifying complex technical skill clusters.' },
    { number: '10x', label: 'Faster Hiring', desc: 'Instantly isolate top-scoring candidates without weeding through hundreds of keyword-stuffed files.' },
    { number: '15k+', label: 'Successful Matchings', desc: 'AI-driven discovery engine mapping resumes to customized corporate technical profiles.' },
  ];

  const features = [
    {
      icon: <FiZap className="text-3xl text-primary" />,
      title: 'AI Resume Indexing',
      desc: 'Our engine extracts years of experience, primary education background, and real capability sets directly from your PDF.'
    },
    {
      icon: <FiActivity className="text-3xl text-secondary" />,
      title: 'Skill Gap Metrics',
      desc: 'Interactive visual benchmarks showing candidate strengths and exact target experience deficiencies.'
    },
    {
      icon: <FiBookOpen className="text-3xl text-tertiary" />,
      title: 'AI Interview Prep Guide',
      desc: 'Customized behavioral and technical questions based on the candidate\'s parsed experience with precise answer hints.'
    }
  ];

  const faqs = [
    {
      q: 'How does the AI Match Score work?',
      a: 'Our AI engine parses the textual data from uploaded resume PDFs, analyzing project descriptions, listed skills, and work history. It evaluates these against standard recruitment parameters and generates a percentage score based on technical depth and consistency.'
    },
    {
      q: 'Is my resume data encrypted and secure?',
      a: 'Yes, privacy is our top priority. All uploaded resumes are processed over fully encrypted channels and stored securely. Recruiters can only access profiles when searching specifically within our platform.'
    },
    {
      q: 'What is the role of the Recruiter vs. Student portals?',
      a: 'Students upload their resumes to instantly generate their AI profiles, track their skill gaps, and review AI-crafted interview prep guides. Recruiters use the platform to search, filter (by skill, location, score), shortlist candidates, and review analytics.'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="bg-background text-on-background dark:bg-slate-950 dark:text-slate-100 min-h-screen transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto space-y-8 relative z-10"
        >
          <span className="bg-primary/10 text-primary dark:bg-primary-container/20 dark:text-primary-fixed-dim px-4 py-1.5 rounded-full font-label-caps text-xs tracking-wider font-semibold uppercase">
            🚀 The Future of Technical Hiring
          </span>
          <h1 className="font-display-hero text-headline-lg-mobile md:text-display-hero font-extrabold tracking-tight leading-tight">
            Discover Talent <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Beyond Resumes
            </span>
          </h1>
          <p className="font-body-lg text-lg md:text-xl text-on-surface-variant dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            TalentAI uses advanced AI parsing and structured skill mapping to evaluate candidates by their actual project experience, skills, and technical capability.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto bg-gradient-primary text-on-primary px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-xl hover:shadow-primary/30 transition-all hover:scale-95 duration-150"
            >
              Get Started Free <FiArrowRight />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-outline-variant text-on-surface dark:text-white px-8 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-surface-container-low dark:hover:bg-slate-700 transition-all hover:scale-95 duration-150"
            >
              Sign In
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Bento Grid Metrics */}
      <section className="py-20 bg-surface-container-low/30 dark:bg-slate-900/30 border-y border-outline-variant/20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-gutter"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              className="glass-card rounded-3xl p-8 hover:shadow-lg transition-all border border-outline-variant/30 flex flex-col justify-between"
            >
              <div>
                <span className="font-stats-number text-stats-number text-primary dark:text-inverse-primary block mb-2">
                  {stat.number}
                </span>
                <h3 className="font-headline-sm text-lg font-bold text-on-background dark:text-white mb-3">
                  {stat.label}
                </h3>
              </div>
              <p className="font-body-sm text-sm text-on-surface-variant dark:text-slate-400 leading-relaxed">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Product Features */}
      <section className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="font-headline-lg text-3xl md:text-4xl text-on-background dark:text-white font-bold">
            Features Designed for Impact
          </h2>
          <p className="font-body-lg text-on-surface-variant dark:text-slate-400">
            Skip keyword stuffing and discover high-signal candidates through deep technical diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {features.map((feature, i) => (
            <div key={i} className="bg-white dark:bg-slate-800/80 p-8 rounded-3xl border border-outline-variant/30 hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="font-headline-sm text-xl font-bold mb-3">{feature.title}</h3>
              <p className="font-body-md text-on-surface-variant dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive FAQ accordion */}
      <section className="py-24 bg-surface-container-low/20 dark:bg-slate-900/20 border-t border-outline-variant/20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-headline-lg text-3xl text-center text-on-background dark:text-white font-bold mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass-card rounded-2xl overflow-hidden border border-outline-variant/30">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-surface-container-low dark:hover:bg-slate-800 transition-all focus:outline-none"
                >
                  <span className="font-body-md font-semibold dark:text-slate-200">{faq.q}</span>
                  <FiChevronDown className={`text-xl text-outline transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>
                
                {activeFaq === i && (
                  <div className="p-6 border-t border-outline-variant/20 bg-surface-container-lowest/50 dark:bg-slate-900/50">
                    <p className="font-body-md text-on-surface-variant dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
