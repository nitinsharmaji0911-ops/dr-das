'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import MobileBottomNav from '../../components/MobileBottomNav';
import Footer from '../../components/Footer';
import styles from './page.module.css';

export default function Services() {
  const treatments = [
    {
      title: 'Dental Implants',
      tag: 'Fixed Teeth',
      image: '/images/treat_implant.png',
      description: 'Fixed Teeth solutions for missing teeth. We provide single-tooth implants, multiple-tooth implants, and full arch restorations using guided precision technologies.',
      benefits: ['Lifetime durability', 'Natural look and function', 'Prevents bone loss', '98% success rate']
    },
    {
      title: 'Braces Treatment',
      tag: 'Orthodontic Correction',
      image: '/images/treat_braces.png',
      description: 'Orthodontic correction for kids and adults, including modern ceramic and Tooth Coloured Braces for aesthetic alignment.',
      benefits: ['Aesthetic appearance', 'Corrects bite issues', 'Gentle realignment force', 'Improves smile confidence']
    },
    {
      title: 'ALLINERS / INVISALIGN Treatment',
      tag: 'Clear Aligners',
      image: '/images/treat_aligner.png',
      description: 'Invisible, comfortable, and accurate clear aligners. Transform your teeth discreetly without standard metal wires or brackets.',
      benefits: ['Virtually invisible', 'Removable for eating & brushing', 'No wire irritation', 'Precise digital modeling']
    },
    {
      title: 'Composite Fillings',
      tag: 'Tooth Coloured Fillings',
      image: '/images/treat_filling.png',
      description: 'Tooth Coloured Fillings for seamless, natural-looking restorations to repair cavities or teeth fractures.',
      benefits: ['Blends with natural teeth', 'Mercury-free materials', 'Bonds directly to tooth', 'Prevents further decay']
    },
    {
      title: 'Tooth Extraction',
      tag: 'Gentle Care',
      image: '/images/treat_extraction.png',
      description: 'Expert and gentle care for teeth requiring extraction, including complex or wisdom tooth extractions under standard sterile settings.',
      benefits: ['Minimal discomfort', 'Prevents infection spread', 'Trauma-free techniques', 'Expert post-op guidelines']
    },
    {
      title: 'ROOT CANAL TREATMENT (R.C.T.)',
      tag: 'Endodontic Care',
      image: '/images/treat_rct.png',
      description: 'Endodontic procedure to save natural teeth. Performed by our expert endodontists utilizing advanced painless technology and single-sitting files.',
      benefits: ['Saves the natural tooth', 'Eliminates active pain', 'Prevents bone infection', 'High precision root seal']
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* 1. Services Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerContainer}>
          <span className={styles.bannerSub}>Dental Treatments</span>
          <h1 className={styles.bannerTitle}>Premium Dental Services</h1>
          <p className={styles.bannerDesc}>
            We combine gentle, detailed care with precise digital imaging to make your treatments completely stress-free and reliable.
          </p>
        </div>
      </section>

      {/* 2. Treatments List Grid */}
      <section className={styles.servicesListSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {treatments.map((treat, idx) => (
              <div key={idx} className={styles.serviceCard}>
                <div className={styles.cardImageWrapper}>
                  <Image 
                    src={treat.image} 
                    alt={treat.title} 
                    fill
                    className={styles.cardImage}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className={styles.serviceHeader}>
                  <span className={styles.cardTag}>{treat.tag}</span>
                  <h2 className={styles.cardTitle}>{treat.title}</h2>
                </div>
                <p className={styles.cardDesc}>{treat.description}</p>
                <div className={styles.benefitsBox}>
                  <h4 className={styles.benefitsTitle}>Key Advantages</h4>
                  <ul className={styles.benefitsList}>
                    {treat.benefits.map((b, i) => (
                      <li key={i}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/#book" className={styles.cardBookBtn}>
                  Book Consultation
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Technology Highlight Banner */}
      <section className={styles.techSection}>
        <div className={styles.techContainer}>
          <h2 className={styles.techTitle}>State-of-the-Art Diagnostics</h2>
          <p className={styles.techDesc}>
            Our Nagpur branches are equipped with intraoral 3D scanners, low-radiation panoramic digital X-rays, and computer-guided implant systems to guarantee clinical precision.
          </p>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
