'use client';

import React from 'react';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import MobileBottomNav from '../../components/MobileBottomNav';
import Footer from '../../components/Footer';
import styles from './page.module.css';

export default function About() {
  const doctors = [
    {
      name: 'Dr. Lokesh Daswani',
      degree: 'M.D.S. (Gold Medalist) - Periodontics & Implantology',
      bio: 'Dr. Lokesh is a pioneer in computer-guided painless dental implants in Nagpur. Awarded a Gold Medal for academic and clinical excellence, he specializes in full mouth rehabilitation and advanced laser periodontics.',
      image: '/images/dr_badal.jpg'
    },
    {
      name: 'Dr. Shraddha Daswani',
      degree: 'M.D.S. - Prosthodontics & Implantology',
      quote: 'Every smile we restore changes how someone sees themselves.',
      bio: 'Dr. Shraddha specializes in restoring natural-looking, beautiful smiles. Her expertise lies in high-end porcelain veneers, dental crowns, fixed bridges, and advanced complete dentures.',
      image: '/images/dr_shraddha.jpg'
    },
    {
      name: 'Dr. Badal Daswani',
      degree: 'M.D.S. - Orthodontics & Dentofacial Orthopedics',
      quote: "Straight teeth aren't just cosmetic — they're life-changing confidence.",
      bio: 'Dr. Badal is a certified aligners and Invisalign provider. He has successfully realigned over 1,500 smiles in Nagpur, focusing on invisible orthodontic treatments and complex dentofacial alignment.',
      image: '/images/dr_badal.jpg'
    },
    {
      name: 'Dr. Mishti Daswani',
      degree: 'M.D.S. - Orthodontics & Smile Aesthetics',
      bio: 'Dr. Mishti is passionate about cosmetic alignment and modern digital orthodontic techniques. She focuses on custom clear aligners for children, teenagers, and adult aesthetic corrections.',
      image: '/images/dr_shraddha.jpg'
    },
    {
      name: 'Dr. Om Prakash Daswani',
      degree: 'B.D.S., GDC NGP - Cosmetic & General Dentist',
      bio: 'The visionary co-founder of Das Dental Clinic, Dr. Om Prakash has over 30 years of clinical experience in Nagpur. He is highly revered for general dentistry, extractions, and diagnostic perfection.',
      image: '/images/dr_badal.jpg'
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* 1. Header Banner */}
      <section className={styles.banner}>
        <div className={styles.bannerContainer}>
          <span className={styles.bannerSub}>A Family of Specialists</span>
          <h1 className={styles.bannerTitle}>Meet the Specialists</h1>
          <p className={styles.bannerDesc}>
            A family of MDS specialists providing Nagpur with world-class, premium dental treatments.
          </p>
        </div>
      </section>

      {/* 2. Brand Story / Philosophy */}
      <section className={styles.storySection}>
        <div className={styles.container}>
          <div className={styles.storyGrid}>
            <div className={styles.storyText}>
              <span className={styles.tag}>Our Philosophy</span>
              <h2 className={styles.title}>Dental Excellence Met With Luxury Comfort</h2>
              <p className={styles.desc}>
                Founded on the belief that dental visits should feel like a sanctuary rather than a chore, Das Dental Clinic has redefined oral care in Nagpur for over 15 years.
              </p>
              <p className={styles.desc}>
                We combine the clinical precision of Gold Medalist specialists with the tranquility of a high-end wellness retreat. Every detail of our three branches in Jaripatka, Sadar, and Indora is crafted to provide a relaxed, stress-free, and virtually pain-free dental experience.
              </p>
            </div>
            <div className={styles.philosophyBox}>
              <div className={styles.philoCard}>
                <h4 className={styles.philoTitle}>Painless Technology</h4>
                <p className={styles.philoText}>We use advanced digital scans and computer-guided implant systems to eliminate discomfort.</p>
              </div>
              <div className={styles.philoCard}>
                <h4 className={styles.philoTitle}>Aesthetic Perfection</h4>
                <p className={styles.philoText}>Every crown, veneer, and alignment is meticulously designed to fit your unique facial symmetry.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Doctors List */}
      <section className={styles.doctorsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSub}>Our Specialist Team</span>
            <h2 className={styles.sectionTitle}>Meet Our Doctors</h2>
          </div>
          <div className={styles.doctorsList}>
            {doctors.map((doc, idx) => (
              <div key={idx} className={styles.doctorRow}>
                <div className={styles.doctorImageCol}>
                  <div className={styles.imageFrame}>
                    <Image 
                      src={doc.image} 
                      alt={doc.name} 
                      fill
                      className={styles.docImage}
                      sizes="160px"
                    />
                  </div>
                </div>
                <div className={styles.doctorInfoCol}>
                  <h3 className={styles.docName}>{doc.name}</h3>
                  <span className={styles.docDegree}>{doc.degree}</span>
                  {doc.quote && (
                    <blockquote className={styles.docQuote}>
                      &ldquo;{doc.quote}&rdquo;
                    </blockquote>
                  )}
                  <p className={styles.docBio}>{doc.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Luxury Clinic Interiors */}
      <section className={styles.clinicSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSub}>A Tour of Our Facilities</span>
            <h2 className={styles.sectionTitle}>A Luxurious Sanctuary</h2>
            <p className={styles.sectionDesc}>Step inside our clinics designed to evoke calm, sterilization, and premium comfort.</p>
          </div>
          <div className={styles.galleryGrid}>
            <div className={styles.galleryCard} style={{ backgroundImage: 'url(/images/clinic_interior_1.png)' }}>
              <div className={styles.galleryOverlay}>
                <span>Advanced Operatory - Sadar</span>
              </div>
            </div>
            <div className={styles.galleryCard} style={{ backgroundImage: 'url(/images/clinic_interior_2.png)' }}>
              <div className={styles.galleryOverlay}>
                <span>Sterilization Suite - Jaripatka</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
