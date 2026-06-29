'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import BookingForm from '../components/BookingForm';
import Footer from '../components/Footer';
import reviews from '../data/reviews.json';
import styles from './page.module.css';

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const treatments = [
    { id: 'implant', name: 'Dental Implant', sub: 'Fixed Teeth', img: '/images/treat_implant.png' },
    { id: 'braces', name: 'Braces Treatment', sub: 'Tooth Coloured Braces', img: '/images/treat_braces.png' },
    { id: 'aligner', name: 'Invisible Alliner', sub: 'Invisible Comfortable Accurate', img: '/images/treat_aligner.png' },
    { id: 'filling', name: 'Composit Filling', sub: 'Tooth Coloured Fillings', img: '/images/treat_filling.png' },
    { id: 'extraction', name: 'Tooth Extraction', sub: 'Painless Treatment', img: '/images/treat_extraction.png' },
    { id: 'rct', name: 'Root Canal Treatment', sub: '', img: '/images/treat_rct.png' },
  ];

  useEffect(() => {
    const t = setInterval(() => {
      setCurrentTestimonial((p) => (p + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(t);
  }, [reviews.length]);

  return (
    <>
      <Navbar />

      {/* ══════════════ 1. HERO ══════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          {/* Text — front left */}
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              <span className={styles.heroLight}>Because</span>
              <br />
              You Deserve
              <br />
              A Better
              <br />
              <span className={styles.heroGold}>Smile</span>
            </h1>
          </div>

          {/* Right side container: photo card and overlapping denture */}
          <div className={styles.heroRight}>
            <div className={styles.heroPhotoCard}>
              <Image src="/images/hero_couple.jpg" alt="Happy patients at Das Dental Clinic" className={styles.heroPhoto} width={500} height={450} priority sizes="(max-width: 640px) 100vw, 500px" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 2. PATIENT EXPERIENCE ══════════════ */}
      <section className={styles.experience}>
        <div className={styles.experienceInner}>
          {/* Left */}
          <div className={styles.expLeft}>
            <h2 className={styles.expTitle}>Patient Experience</h2>
            <p className={styles.expDesc}>
              We offer dental treatment services using top of the line equipment and
              technology to achieve <strong>highest level of patient satisfaction.</strong>
            </p>
          </div>

          {/* Right – testimonial card with carousel */}
          <div className={styles.expRight}>
            <div className={styles.testimonialCard}>

              {/* Row 1: Avatar + Name/Branch + Google Badge */}
              <div className={styles.testimonialHeader}>
                <div className={styles.testimonialAvatar}>
                  <span className={styles.avatarInitial}>
                    {reviews[currentTestimonial]?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className={styles.testimonialMeta}>
                  <p className={styles.testimonialAuthor}>{reviews[currentTestimonial]?.name}</p>
                  <span className={styles.branchTag}>{reviews[currentTestimonial]?.branch}</span>
                </div>
                <div className={styles.googleBadge}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className={styles.googleBadgeText}>Google</span>
                </div>
              </div>

              {/* Row 2: Stars */}
              <div className={styles.starRow}>
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className={styles.star} viewBox="0 0 20 20" fill="#FBBC05" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>

              {/* Row 3: Review text */}
              <p className={styles.testimonialText}>{reviews[currentTestimonial]?.feedback}</p>

              {/* Row 4: Date */}
              <div className={styles.reviewFooter}>
                <span className={styles.reviewDate}>{reviews[currentTestimonial]?.date}</span>
              </div>

            </div>
            {/* Dots */}
            <div className={styles.dots}>
              {reviews.map((_, i) => (
                <button
                  key={i}
                  className={`${styles.dot} ${i === currentTestimonial ? styles.dotActive : ''}`}
                  onClick={() => setCurrentTestimonial(i)}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ 3. TREATMENTS ══════════════ */}
      <section className={styles.treatments}>
        <div className={styles.desktopTreatments}>
          <div className={styles.treatmentsCard}>
            <h2 className={styles.treatmentsTitle}>Treatments we provide</h2>
            <div className={styles.treatmentsGrid}>
              {treatments.map((t) => (
                <div key={t.id} className={styles.treatCard}>
                  <div className={styles.treatImageBox}>
                    <Image src={t.img} alt={t.name} className={styles.treatImage} width={200} height={110} sizes="200px" />
                  </div>
                  <p className={styles.treatName}>{t.name}</p>
                  {t.sub && <p className={styles.treatSub}>{t.sub}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.mobileTreatments}>
          <Image 
            src="/images/Treatments we provide.png" 
            alt="Treatments we provide" 
            className={styles.mobileTreatmentsImg}
            width={720}
            height={1300}
            sizes="(max-width: 640px) 100vw, 720px"
          />
        </div>
      </section>

      {/* ══════════════ 4. WORKING HOURS ══════════════ */}
      <section className={styles.hours}>
        <div className={styles.desktopHours}>
          <Image src="/images/working_hours_banner.png" alt="Working Hours - Das Dental Clinic" className={styles.hoursBannerImg} width={760} height={200} sizes="(max-width: 760px) 100vw, 760px" />
        </div>
        
        <div className={styles.mobileHoursCard}>
          <Image 
            src="/images/Working Hours.png" 
            alt="Working Hours - Das Dental Clinic" 
            className={styles.mobileHoursImgOnly} 
            width={720} 
            height={1100}
            sizes="(max-width: 640px) 100vw, 720px"
          />
        </div>
      </section>

      {/* ══════════════ 5. CONTACT FORM ══════════════ */}
      <section className={styles.contact} id="book">
        <div className={styles.contactInner}>
          <BookingForm />
        </div>
      </section>

      {/* ══════════════ 6. REACH US ══════════════ */}
      <section className={styles.reach}>
        <div className={styles.reachInner}>
          <h2 className={styles.reachTitle}>Reach us</h2>
          <div className={styles.reachGrid}>
            <div className={styles.reachBranch}>
              <h3 className={styles.reachBranchName}>Jaripatka</h3>
              <p className={styles.reachAddr}>Sai Vasanshah Chowk, Near Ganesh Mandir, Jaripatka Bazar - 440014</p>
              <a href="tel:+919730303606" className={styles.reachContact}>Contact - 9730303606</a>
            </div>
            <div className={styles.reachDivider} />
            <div className={styles.reachBranch}>
              <h3 className={styles.reachBranchName}>Sadar</h3>
              <p className={styles.reachAddr}>Shop No. 7, SJTI Complex, Below IDBI Bank, Sadar.</p>
              <a href="tel:+919130812537" className={styles.reachContact}>Contact - 9130812537</a>
            </div>
            <div className={styles.reachDivider} />
            <div className={styles.reachBranch}>
              <h3 className={styles.reachBranchName}>Indora</h3>
              <p className={styles.reachAddr}>Dr. Ambedkar Road, Near Rajput Rest, Indora.</p>
              <a href="tel:+918554939853" className={styles.reachContact}>Contact - 8554939853</a>
            </div>
          </div>
          <div className={styles.reachSeparator} />

          {/* Map */}
          <div className={styles.mapBox}>
            <iframe
              src="https://maps.google.com/maps?q=Sai+Vasanshah+Chowk+Jaripatka+Nagpur&t=&z=15&ie=UTF8&iwloc=&output=embed"
              className={styles.mapFrame}
              title="Das Dental Clinic Jaripatka"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>


        </div>
      </section>

      <Footer />

      <MobileBottomNav />
    </>
  );
}
