'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Footer from '../components/Footer';
import BookingForm from '../components/BookingForm';
import reviews from '../data/reviews.json';
import styles from './page.module.css';

export default function Home() {
  const services = [
    {
      id: 'implants',
      title: 'Dental Implants',
      description: 'Permanent fixed teeth solutions for missing teeth. Restores complete function, feel, and natural aesthetics using titanium posts.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 5c0-1.66 1.34-3 3-3h6c1.66 0 3 1.34 3 3v3H6V5zm3 4h6v1H9V9zm1 2h4v2h-4zm-1 3h6v1.5H9V14zm1 2.5h4v1.5h-4v-1.5zm1 2.5h2v3c0 .55-.45 1-1 1s-1-.45-1-1v-3z" />
        </svg>
      )
    },
    {
      id: 'braces',
      title: 'Braces Treatment',
      description: 'Orthodontic correction including modern tooth-coloured ceramic braces and advanced bracket systems for all ages.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
        </svg>
      )
    },
    {
      id: 'aligners',
      title: 'Invisalign Aligners',
      description: 'Invisible, comfortable, and accurate clear aligners. Transform your smile discreetly without wires or metal brackets.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
        </svg>
      )
    },
    {
      id: 'fillings',
      title: 'Composite Fillings',
      description: 'Tooth-coloured fillings for seamless, natural-looking restorations that blend perfectly with your existing teeth.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
        </svg>
      )
    },
    {
      id: 'extraction',
      title: 'Tooth Extraction',
      description: 'Gentle, expert care for teeth requiring extraction, ensuring minimal discomfort, rapid healing, and post-care guidance.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z" />
        </svg>
      )
    },
    {
      id: 'rct',
      title: 'Root Canal Treatment',
      description: 'Endodontic procedure to save natural teeth. Executed by expert endodontists using automated rotary technology.',
      icon: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.33 6.04c-.38-1.52-1.69-2.5-3.13-2.5-1.12 0-2.13.6-2.68 1.5-.23.38-.45.79-.65 1.2a18.3 18.3 0 00-.74-1.39C11.58 3.95 10.57 3.54 9.47 3.54c-1.44 0-2.75.98-3.13 2.5a6.6 6.6 0 00-.09 2.51c.32 2.93 2.06 5.86 3.19 7.76.25.43.37.89.37 1.37v2.09c0 .73.6 1.33 1.33 1.33.6 0 1.13-.39 1.28-.97.16-.62.74-1.03 1.38-1.03.64 0 1.22.41 1.38 1.03.15.58.68.97 1.28.97.73 0 1.33-.6 1.33-1.33v-2.09c0-.48.12-.94.37-1.37 1.13-1.9 2.87-4.83 3.19-7.76.12-.86.09-1.7-.09-2.51z" />
        </svg>
      )
    }
  ];

  const branches = [
    {
      id: 'jaripatka',
      name: 'Jaripatka Branch',
      tag: 'Main Clinic',
      address: 'Sai Vasanshah Chowk, Near Ganesh Mandir, Jaripatka Bazar – 440014',
      phone: '+91 9730303606',
      mapSrc: 'https://www.google.com/maps?q=DAS+Dental+Clinic+Jaripatka+Nagpur&output=embed'
    },
    {
      id: 'sadar',
      name: 'Sadar Branch',
      tag: 'Cosmetic Suite',
      address: 'Shop No. 7, SJTI Complex, Below IDBI Bank, Sadar, Nagpur',
      phone: '+91 9130812537',
      mapSrc: 'https://www.google.com/maps?q=DAS+Dental+Clinic+Sadar+Nagpur&output=embed'
    },
    {
      id: 'indora',
      name: 'Indora Branch',
      tag: 'Laser & Family',
      address: 'Dr. Ambedkar Road, Near Rajput Restaurant, Indora, Nagpur',
      phone: '+91 8554939853',
      mapSrc: 'https://www.google.com/maps?q=DAS+Dental+Clinic+Indora+Nagpur&output=embed'
    }
  ];

  return (
    <>
      <Navbar />

      {/* ===== 1. HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBg1} />
        <div className={styles.heroBg2} />
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <span className={styles.heroBadge}>
              <span className={styles.heroBadgeDot} />
              Trusted Dental Care in Nagpur
            </span>

            <h1 className={styles.heroTitle}>
              Because You Deserve<br />
              A Better{' '}
              <span className={styles.heroTitleGold}>Smile</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Advanced dental care by MDS Gold Medalist specialists. Pain-free treatments,
              modern technology, and 15,000+ happy patients across Nagpur.
            </p>

            <div className={styles.heroActions}>
              <Link href="/#book" className={styles.heroBtnPrimary}>
                Book Appointment
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link href="/services" className={styles.heroBtnSecondary}>
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>15+</span>
                <span className={styles.heroStatLabel}>Years</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>15K+</span>
                <span className={styles.heroStatLabel}>Patients</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>3</span>
                <span className={styles.heroStatLabel}>Clinics</span>
              </div>
              <div className={styles.heroStat}>
                <span className={styles.heroStatNum}>5 MDS</span>
                <span className={styles.heroStatLabel}>Specialists</span>
              </div>
            </div>
          </div>

          <div className={styles.heroRight}>
            <div className={styles.heroImageWrapper}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/hero_doctor_patient.png"
                alt="Das Dental Clinic Doctors"
                className={styles.heroImage}
              />
              <div className={styles.heroImageBadge}>
                <div className={styles.heroBadgeIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                  </svg>
                </div>
                <div className={styles.heroBadgeText}>
                  <span className={styles.heroBadgeNum}>5★ Rated</span>
                  <span className={styles.heroBadgeLabel}>By Our Patients</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 2. STATS BAR ===== */}
      <section className={styles.statsBar}>
        <div className={styles.statsBarInner}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className={styles.statText}>
              <span className={styles.statNumber}>15+</span>
              <span className={styles.statLabel}>Years of Excellence</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className={styles.statText}>
              <span className={styles.statNumber}>15,000+</span>
              <span className={styles.statLabel}>Happy Patients</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className={styles.statText}>
              <span className={styles.statNumber}>3 Clinics</span>
              <span className={styles.statLabel}>Across Nagpur</span>
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className={styles.statText}>
              <span className={styles.statNumber}>5 Star</span>
              <span className={styles.statLabel}>Patient Rated</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 3. TREATMENTS ===== */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>OUR SERVICES</span>
            <h2 className={styles.sectionTitle}>
              Treatments We <span className={styles.sectionTitleAccent}>Provide</span>
            </h2>
            <p className={styles.sectionDesc}>
              From general hygiene to complex implant surgeries, our focus is always on your
              comfort, precision, and long-term dental health.
            </p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map((s) => (
              <div key={s.id} className={styles.serviceCard}>
                <div className={styles.serviceIconBox}>{s.icon}</div>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <p className={styles.serviceDesc}>{s.description}</p>
                <Link href="/services" className={styles.serviceLink}>
                  Learn More
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 4. PATIENT EXPERIENCE ===== */}
      <section className={styles.experienceSection}>
        <div className={styles.container}>
          <div className={styles.experienceGrid}>
            {/* Left – dark card */}
            <div className={styles.experienceLeft}>
              <div>
                <span className={styles.expTag}>PATIENT EXPERIENCE</span>
                <h2 className={styles.expTitle}>
                  Your Comfort &amp; Care Is Our Priority
                </h2>
                <p className={styles.expDesc}>
                  At Das Dental Clinic, every patient receives personalised, pain-free treatment 
                  in a warm, modern environment. Our specialist team ensures you leave with 
                  confidence in your smile.
                </p>
              </div>
              <div className={styles.expStats}>
                <div className={styles.expStat}>
                  <span className={styles.expStatNum}>15K+</span>
                  <span className={styles.expStatLabel}>Patients Treated</span>
                </div>
                <div className={styles.expStat}>
                  <span className={styles.expStatNum}>98%</span>
                  <span className={styles.expStatLabel}>Satisfaction Rate</span>
                </div>
                <div className={styles.expStat}>
                  <span className={styles.expStatNum}>3</span>
                  <span className={styles.expStatLabel}>Clinic Locations</span>
                </div>
                <div className={styles.expStat}>
                  <span className={styles.expStatNum}>5★</span>
                  <span className={styles.expStatLabel}>Google Rating</span>
                </div>
              </div>
            </div>

            {/* Right – testimonials */}
            <div className={styles.experienceRight}>
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className={styles.testimonialCard}>
                  <div className={styles.testimonialStars}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className={styles.testimonialText}>&ldquo;{review.feedback}&rdquo;</p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.testimonialAvatar}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className={styles.testimonialName}>{review.name}</div>
                      <div className={styles.testimonialVerified}>Verified Patient</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== 5. WORKING HOURS ===== */}
      <section className={styles.hoursSection}>
        <div className={styles.container}>
          <div className={styles.hoursGrid}>
            {/* Left – hours banner */}
            <div className={styles.hoursBanner}>
              <p className={styles.hoursBannerTag}>CLINIC HOURS</p>
              <h2 className={styles.hoursBannerTitle}>When Can You Visit Us?</h2>
              <div className={styles.hoursRow}>
                <span className={styles.hoursDay}>Monday – Saturday</span>
                <span className={styles.hoursTime}>10:00 AM – 8:00 PM</span>
              </div>
              <div className={styles.hoursRow}>
                <span className={styles.hoursDay}>Sunday</span>
                <span className={styles.hoursTime}>11:00 AM – 2:00 PM</span>
              </div>
              <div className={styles.hoursCallout}>
                <div className={styles.hoursCalloutIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className={styles.hoursCalloutText}>
                  Call us for emergency appointments: <strong>+91 9730303606</strong>
                </div>
              </div>
            </div>

            {/* Right – doctors */}
            <div className={styles.hoursDoctors}>
              <div>
                <p className={styles.hoursSectionLabel}>MEET OUR SPECIALISTS</p>
                <h2 className={styles.hoursSectionTitle}>Our Expert Dental Team</h2>
              </div>
              <div className={styles.doctorsRow}>
                <div className={styles.doctorCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/dr_badal_photo.jpg"
                    alt="Dr. Badal Daswani"
                    className={styles.doctorImage}
                  />
                  <div className={styles.doctorInfo}>
                    <div className={styles.doctorName}>Dr. Badal Daswani</div>
                    <div className={styles.doctorSpec}>MDS Orthodontics</div>
                  </div>
                </div>
                <div className={styles.doctorCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/dr_shraddha_photo.jpg"
                    alt="Dr. Shraddha Daswani"
                    className={styles.doctorImage}
                  />
                  <div className={styles.doctorInfo}>
                    <div className={styles.doctorName}>Dr. Shraddha Daswani</div>
                    <div className={styles.doctorSpec}>MDS Prosthodontics</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 6. BOOK APPOINTMENT ===== */}
      <section className={styles.bookSection} id="book">
        <div className={styles.container}>
          <div className={styles.bookGrid}>
            {/* Left – info */}
            <div className={styles.bookLeft}>
              <span className={styles.bookTag}>BOOK AN APPOINTMENT</span>
              <h2 className={styles.bookTitle}>
                Schedule Your Visit Online
              </h2>
              <p className={styles.bookDesc}>
                Book a consultation at any of our three convenient Nagpur clinics.
                Choose your nearest branch, pick a time, and we&apos;ll confirm your slot.
              </p>
              <div className={styles.bookLocations}>
                {branches.map((b) => (
                  <div key={b.id} className={styles.bookLocation}>
                    <div className={styles.bookLocationIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className={styles.bookLocationInfo}>
                      <span className={styles.bookLocationName}>{b.name}</span>
                      <span className={styles.bookLocationAddr}>{b.address}</span>
                      <a href={`tel:${b.phone.replace(/\s+/g, '')}`} className={styles.bookLocationPhone}>
                        {b.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right – booking form */}
            <div className={styles.bookRight}>
              <BookingForm />
            </div>
          </div>
        </div>
      </section>

      {/* ===== 7. MAP ===== */}
      <section className={styles.mapSection}>
        <div className={styles.container}>
          <div className={styles.mapHeader}>
            <span className={styles.sectionTag}>OUR LOCATIONS</span>
            <h2 className={styles.sectionTitle}>
              Find Us in <span className={styles.sectionTitleAccent}>Nagpur</span>
            </h2>
          </div>
          <div className={styles.mapGrid}>
            {branches.map((b) => (
              <div key={b.id} className={styles.mapCard}>
                <iframe
                  className={styles.mapEmbed}
                  title={b.name}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(b.address + ' Nagpur')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <div className={styles.mapCardInfo}>
                  <div className={styles.mapCardName}>{b.name} <span style={{ color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 600, marginLeft: '0.4rem' }}>{b.tag}</span></div>
                  <p className={styles.mapCardAddr}>{b.address}</p>
                  <a href={`tel:${b.phone.replace(/\s+/g, '')}`} className={styles.mapCardPhone}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {b.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 8. CTA BAR ===== */}
      <section className={styles.ctaBar}>
        <div className={styles.ctaBarInner}>
          <div className={styles.ctaBarLeft}>
            <div className={styles.ctaBarIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.33 6.04c-.38-1.52-1.69-2.5-3.13-2.5-1.12 0-2.13.6-2.68 1.5-.23.38-.45.79-.65 1.2a18.3 18.3 0 00-.74-1.39C11.58 3.95 10.57 3.54 9.47 3.54c-1.44 0-2.75.98-3.13 2.5a6.6 6.6 0 00-.09 2.51c.32 2.93 2.06 5.86 3.19 7.76.25.43.37.89.37 1.37v2.09c0 .73.6 1.33 1.33 1.33.6 0 1.13-.39 1.28-.97.16-.62.74-1.03 1.38-1.03.64 0 1.22.41 1.38 1.03.15.58.68.97 1.28.97.73 0 1.33-.6 1.33-1.33v-2.09c0-.48.12-.94.37-1.37 1.13-1.9 2.87-4.83 3.19-7.76.12-.86.09-1.7-.09-2.51z" />
              </svg>
            </div>
            <div>
              <div className={styles.ctaBarHeading}>Ready for Your Best Smile?</div>
              <div className={styles.ctaBarSub}>Book your consultation today and take the first step towards a healthier, more confident you.</div>
            </div>
          </div>
          <div className={styles.ctaBarRight}>
            <Link href="/#book" className={styles.ctaBarBtn}>
              Book Appointment →
            </Link>
            <a href="tel:+919730303606" className={styles.ctaBarPhone}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              +91 9730303606
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <MobileBottomNav />
    </>
  );
}
