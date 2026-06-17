'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import MobileBottomNav from '../../components/MobileBottomNav';
import Footer from '../../components/Footer';
import styles from './page.module.css';

export default function Contact() {
  const branches = [
    {
      name: 'Jaripatka Clinic (Main Branch)',
      image: '/images/jaripatka_clinic.png',
      address: 'Sai Vasanshah Chowk, Main Bazaar Road, Opposite Indore Namkeen, Near Ganesh Mandir, Jaripatka, Nagpur - 440014',
      phone: '+91 9730303606',
      hours: 'Mon - Sat: 10:00 AM - 8:00 PM | Sun: 11:00 AM - 2:00 PM',
      mapUrl: 'https://maps.google.com/?q=Sai+Vasanshah+Chowk,+Jaripatka,+Nagpur'
    },
    {
      name: 'Sadar Clinic',
      image: '/images/sadar_clinic.png',
      address: 'Shop No. 7, SJTI Complex, Below IDBI Bank, Sadar, Nagpur - 440001',
      phone: '+91 9130812537',
      hours: 'Mon - Sat: 10:00 AM - 8:00 PM | Sun: Closed',
      mapUrl: 'https://maps.google.com/?q=SJTI+Complex,+Sadar,+Nagpur'
    },
    {
      name: 'Indora / Kamal Chowk Clinic',
      image: '/images/indora_clinic.png',
      address: 'Dr. Ambedkar Road, Opposite Rajput Restaurant, Kamal Chowk, Nagpur - 440017',
      phone: '+91 8554939853',
      hours: 'Mon - Sat: 10:00 AM - 8:00 PM | Sun: Closed',
      mapUrl: 'https://maps.google.com/?q=Kamal+Chowk,+Nagpur'
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* 1. Header Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerContainer}>
          <span className={styles.bannerSub}>Find Our Clinics</span>
          <h1 className={styles.bannerTitle}>Our Nagpur Locations</h1>
          <p className={styles.bannerDesc}>
            Visit any of our three premium clinics or contact our central concierge desk.
          </p>
        </div>
      </section>

      {/* 2. Contact Details & Map links */}
      <section className={styles.contactDetailsSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {branches.map((b, idx) => (
              <div key={idx} className={styles.contactCard}>
                <div className={styles.cardImageWrapper}>
                  <Image 
                    src={b.image} 
                    alt={b.name} 
                    fill
                    className={styles.cardImage}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h2 className={styles.cardTitle}>{b.name}</h2>
                <div className={styles.infoBlock}>
                  <h4 className={styles.infoLabel}>Address</h4>
                  <p className={styles.infoText}>{b.address}</p>
                </div>
                <div className={styles.infoBlock}>
                  <h4 className={styles.infoLabel}>Contact Number</h4>
                  <a href={`tel:${b.phone.replace(/\s+/g, '')}`} className={styles.phoneLink}>
                    {b.phone}
                  </a>
                </div>
                <div className={styles.infoBlock}>
                  <h4 className={styles.infoLabel}>Timings</h4>
                  <p className={styles.infoText}>{b.hours}</p>
                </div>
                <div className={styles.cardActions}>
                  <a href={b.mapUrl} target="_blank" rel="noopener noreferrer" className={styles.mapBtn}>
                    Get Directions (Google Maps)
                  </a>
                  <Link href="/#book" className={styles.bookBtn}>
                    Book Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Central Helpline */}
      <section className={styles.helplineSection}>
        <div className={styles.helplineContainer}>
          <h2 className={styles.helplineTitle}>Have Questions or Need Help?</h2>
          <p className={styles.helplineDesc}>
            Call our central helpline for general enquiries, dental tourism planning, or emergency visits.
          </p>
          <a href="tel:+919730303606" className={styles.helplinePhone}>
            +91 9730303606
          </a>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
