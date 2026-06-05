'use client';

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import MobileBottomNav from '../../components/MobileBottomNav';
import Footer from '../../components/Footer';
import BeforeAfter from '../../components/BeforeAfter';
import styles from './page.module.css';

export default function Gallery() {
  const [filter, setFilter] = useState('all');

  const cases = [
    {
      id: 'case1',
      category: 'implants',
      title: 'Full Arch Fixed Implants',
      before: '/images/smile_before.png',
      after: '/images/smile_after.png',
      description: 'Patient had severe tooth wear and multiple missing teeth. Restored using full mouth zirconia fixed bridges on implants.'
    },
    {
      id: 'case2',
      category: 'aligners',
      title: 'Invisalign Treatment',
      before: '/images/smile_before.png',
      after: '/images/smile_after.png',
      description: 'Patient had moderate crowding and deep bite. Corrected in 11 months using clear transparent aligners.'
    },
    {
      id: 'case3',
      category: 'veneers',
      title: 'Premium Ceramic Veneers',
      before: '/images/smile_before.png',
      after: '/images/smile_after.png',
      description: 'Stained, chipped front teeth restored using ultra-thin porcelain veneers matching natural tooth translucency.'
    }
  ];

  const filteredCases = filter === 'all' ? cases : cases.filter(c => c.category === filter);

  return (
    <>
      <Navbar />
      
      {/* 1. Gallery Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerContainer}>
          <span className={styles.bannerSub}>Smile Transformations</span>
          <h1 className={styles.bannerTitle}>Smile Gallery</h1>
          <p className={styles.bannerDesc}>
            Explore actual clinical outcomes showing the precision and artistry of our specialists.
          </p>
        </div>
      </section>

      {/* 2. Filters & Transformations */}
      <section className={styles.gallerySection}>
        <div className={styles.container}>
          {/* Filters */}
          <div className={styles.filtersBar}>
            {['all', 'implants', 'aligners', 'veneers'].map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat === 'all' ? 'All Treatments' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Cases grid */}
          <div className={styles.casesList}>
            {filteredCases.map((c) => (
              <div key={c.id} className={styles.caseCard}>
                <div className={styles.sliderContainer}>
                  <BeforeAfter 
                    beforeImage={c.before} 
                    afterImage={c.after} 
                    title={c.title}
                  />
                </div>
                <div className={styles.caseInfo}>
                  <p className={styles.caseDesc}>{c.description}</p>
                  <a href="/#book" className={styles.caseBookBtn}>
                    Achieve Similar Results
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
