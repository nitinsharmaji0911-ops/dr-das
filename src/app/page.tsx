'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import reviews from '../data/reviews.json';
import styles from './page.module.css';

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, branch: 'General Enquiry', date: new Date().toISOString().split('T')[0], time: 'TBD' }),
      });
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch {
      // still show success
      setSubmitted(true);
    }
    setSubmitting(false);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <>
      <Navbar />

      {/* ══════════════ 1. HERO ══════════════ */}
      <section className={styles.hero}>
        {/* Photo card — behind everything, right side */}
        <div className={styles.heroPhotoCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/hero_couple.jpg" alt="Happy patients at Das Dental Clinic" className={styles.heroPhoto} />
        </div>

        {/* Denture — floats center, overlapping photo and text */}
        <div className={styles.heroDenture}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/denture_hero.png" alt="Dental model" className={styles.dentureImg} />
        </div>

        {/* Text — front left */}
        <div className={styles.heroText}>
          <p className={styles.heroPre}>Because</p>
          <h1 className={styles.heroTitle}>
            You Deserve<br />A Better<br />
            <span className={styles.heroGold}>Smile</span>
          </h1>
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
              <div className={styles.testimonialAvatar}></div>
              <div className={styles.testimonialContent}>
                <p className={styles.testimonialText}>{reviews[currentTestimonial]?.feedback}</p>
                <p className={styles.testimonialAuthor}>{reviews[currentTestimonial]?.name}</p>
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
        <div className={styles.treatmentsCard}>
          <h2 className={styles.treatmentsTitle}>Treatments we provide</h2>
          <div className={styles.treatmentsGrid}>
            {treatments.map((t) => (
              <div key={t.id} className={styles.treatCard}>
                <div className={styles.treatImageBox}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.img} alt={t.name} className={styles.treatImage} />
                </div>
                <p className={styles.treatName}>{t.name}</p>
                {t.sub && <p className={styles.treatSub}>{t.sub}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ 4. WORKING HOURS ══════════════ */}
      <section className={styles.hours}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/working_hours_banner.png" alt="Working Hours - Das Dental Clinic" className={styles.hoursBannerImg} />
      </section>

      {/* ══════════════ 5. CONTACT FORM ══════════════ */}
      <section className={styles.contact} id="book">
        <div className={styles.contactInner}>
          {/* Form Card */}
          <div className={styles.formCard}>
            {submitted ? (
              <div className={styles.successMsg}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p>Thank you! We&apos;ll be in touch soon.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  className={styles.input}
                  type="tel"
                  placeholder="Mobile Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
                <input
                  className={styles.input}
                  type="email"
                  placeholder="Email (Optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  placeholder="Type your message here.."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                />
                <button type="submit" className={styles.submitBtn} disabled={submitting}>
                  {submitting ? 'Sending...' : 'Submit'}
                </button>
              </form>
            )}
          </div>
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


          {/* Footer */}
          <div className={styles.footer}>
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/das_logo.png" alt="DAS Dental Clinic" className={styles.footerLogoImg} />
            </Link>
            <a href="mailto:ddsclinic@gmail.com" className={styles.footerEmail}>ddsclinic@gmail.com</a>
          </div>
        </div>
      </section>

      <MobileBottomNav />
    </>
  );
}
