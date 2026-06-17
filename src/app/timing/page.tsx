'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import MobileBottomNav from '../../components/MobileBottomNav';
import Footer from '../../components/Footer';
import styles from './page.module.css';

export default function Timing() {
  const branchTimings = [
    {
      name: 'Jaripatka Clinic (Main Branch)',
      schedule: [
        { days: 'Monday - Saturday', hours: '10:00 AM - 8:00 PM' },
        { days: 'Sunday', hours: '11:00 AM - 2:00 PM' }
      ],
      description: 'Open throughout the week for comprehensive and emergency dental care.'
    },
    {
      name: 'Sadar Clinic',
      schedule: [
        { days: 'Monday - Saturday', hours: '10:00 AM - 8:00 PM' },
        { days: 'Sunday', hours: 'Closed' }
      ],
      description: 'Convenient weekday and Saturday timings for working professionals.'
    },
    {
      name: 'Indora / Kamal Chowk Clinic',
      schedule: [
        { days: 'Monday - Saturday', hours: '10:00 AM - 8:00 PM' },
        { days: 'Sunday', hours: 'Closed' }
      ],
      description: 'Providing premium specialist services from Monday to Saturday.'
    }
  ];

  const doctorAvailability = [
    {
      name: 'Dr. Lokesh Daswani',
      role: 'Periodontics & Implantology Specialist',
      clinics: [
        { name: 'Jaripatka Clinic', slots: 'Mon, Wed, Fri (10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM)' },
        { name: 'Sadar Clinic', slots: 'Tue, Thu, Sat (10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM)' }
      ]
    },
    {
      name: 'Dr. Shraddha Daswani',
      role: 'Prosthodontics & Implantology Specialist',
      clinics: [
        { name: 'Jaripatka Clinic', slots: 'Tue, Thu, Sat (10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM)' },
        { name: 'Sadar Clinic', slots: 'Mon, Wed, Fri (10:00 AM - 1:00 PM, 5:00 PM - 8:00 PM)' }
      ]
    },
    {
      name: 'Dr. Badal Daswani',
      role: 'Orthodontics & Invisalign Specialist',
      clinics: [
        { name: 'Jaripatka Clinic', slots: 'Mon - Sat (5:00 PM - 8:00 PM)' },
        { name: 'Indora Clinic', slots: 'Mon - Sat (10:00 AM - 1:00 PM)' }
      ]
    },
    {
      name: 'Dr. Mishti Daswani',
      role: 'Orthodontics & Clear Aligners',
      clinics: [
        { name: 'Jaripatka Clinic', slots: 'Mon - Sat (10:00 AM - 1:00 PM)' },
        { name: 'Indora Clinic', slots: 'Mon - Sat (5:00 PM - 8:00 PM)' }
      ]
    },
    {
      name: 'Dr. Om Prakash Daswani',
      role: 'Cosmetic & General Dentist',
      clinics: [
        { name: 'Jaripatka Clinic', slots: 'Mon - Sat (10:00 AM - 8:00 PM)' },
        { name: 'Indora Clinic', slots: 'Mon - Sat (10:00 AM - 8:00 PM)' }
      ]
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Header Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerContainer}>
          <span className={styles.bannerSub}>Clinical Schedules</span>
          <h1 className={styles.bannerTitle}>Clinic Timings & Availability</h1>
          <p className={styles.bannerDesc}>
            View clinic operational hours and doctor availability schedules to plan your next visit.
          </p>
        </div>
      </section>

      {/* Clinic Timings Grid */}
      <section className={styles.timingsGridSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSub}>Operational Hours</span>
            <h2 className={styles.sectionTitle}>Our Clinic Schedules</h2>
          </div>
          <div className={styles.grid}>
            {branchTimings.map((b, idx) => (
              <div key={idx} className={styles.timingCard}>
                <h3 className={styles.cardTitle}>{b.name}</h3>
                <p className={styles.cardDesc}>{b.description}</p>
                <div className={styles.scheduleList}>
                  {b.schedule.map((s, sIdx) => (
                    <div key={sIdx} className={styles.scheduleRow}>
                      <span className={styles.scheduleDays}>{s.days}</span>
                      <span className={styles.scheduleHours}>{s.hours}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.cardActions}>
                  <Link href="/#book" className={styles.bookBtn}>
                    Book an Appointment
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Availability Section */}
      <section className={styles.availabilitySection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSub}>Specialist Rotations</span>
            <h2 className={styles.sectionTitle}>Doctor Availability</h2>
            <p className={styles.sectionDesc}>
              Find when your preferred MDS specialist is available at each clinic branch.
            </p>
          </div>
          <div className={styles.availabilityList}>
            {doctorAvailability.map((doc, idx) => (
              <div key={idx} className={styles.docAvailabilityRow}>
                <div className={styles.docMeta}>
                  <h3 className={styles.docName}>{doc.name}</h3>
                  <span className={styles.docRole}>{doc.role}</span>
                </div>
                <div className={styles.docSlotsGrid}>
                  {doc.clinics.map((clinic, cIdx) => (
                    <div key={cIdx} className={styles.slotItem}>
                      <span className={styles.slotClinicName}>{clinic.name}</span>
                      <span className={styles.slotHours}>{clinic.slots}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <h2 className={styles.ctaTitle}>Schedule Your Consultation</h2>
          <p className={styles.ctaDesc}>
            Book your session online today to experience premium, painless oral care from our expert specialists.
          </p>
          <Link href="/#book" className={styles.ctaBtn}>
            Book Appointment Now
          </Link>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
