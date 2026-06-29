'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Info */}
          <div className={styles.brandCol}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoBadge}>D</span>
              <div className={styles.logoText}>
                <span className={styles.mainTitle}>DAS DENTAL</span>
                <span className={styles.subTitle}>CLINIC</span>
              </div>
            </Link>
            <p className={styles.tagline}>
              Providing luxurious, high-end dental treatments with advanced painless tech in Nagpur.
            </p>
            <div className={styles.socials}>
              <a href="https://facebook.com/dasdentalclinic" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                <span className={styles.socialIcon}>F</span>
              </a>
              <a href="https://instagram.com/dasdentalclinic" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <span className={styles.socialIcon}>I</span>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="YouTube">
                <span className={styles.socialIcon}>Y</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About Team</Link></li>
              <li><Link href="/services">Treatments</Link></li>
              <li><Link href="/gallery">Smile Gallery</Link></li>
              <li><Link href="/contact">Our Locations</Link></li>
            </ul>
          </div>

          {/* Nagpur Branches */}
          <div className={styles.branchesCol}>
            <h4 className={styles.colTitle}>Nagpur Clinics</h4>
            <div className={styles.branchItem}>
              <span className={styles.branchName}>Jaripatka Branch (Main)</span>
              <span className={styles.branchDetail}>Sai Vasanshah Chowk, Near Ganesh Mandir, Jaripatka Bazar - 440014</span>
              <a href="tel:+919730303606" className={styles.branchPhone}>Ph: +91 9730303606</a>
            </div>
            <div className={styles.branchItem}>
              <span className={styles.branchName}>Sadar Branch</span>
              <span className={styles.branchDetail}>Shop No. 7, SJTI Complex, Below IDBI Bank, Sadar</span>
              <a href="tel:+919130812537" className={styles.branchPhone}>Ph: +91 9130812537</a>
            </div>
            <div className={styles.branchItem}>
              <span className={styles.branchName}>Indora / Kamal Chowk Branch</span>
              <span className={styles.branchDetail}>Dr. Ambedkar Road, Near Rajput Rest., Indora</span>
              <a href="tel:+918554939853" className={styles.branchPhone}>Ph: +91 8554939853</a>
            </div>
          </div>

          {/* Timings */}
          <div className={styles.timingsCol}>
            <h4 className={styles.colTitle}>Working Hours</h4>
            <p className={styles.timingDetail}>
              <strong>Monday - Saturday:</strong><br />
              10:00 AM - 8:00 PM
            </p>
            <p className={styles.timingDetail}>
              <strong>Sunday:</strong><br />
              11:00 AM - 2:00 PM
            </p>
            <p className={styles.emailText}>
              <strong>Email:</strong><br />
              <a href="mailto:ddsclinic@gmail.com">ddsclinic@gmail.com</a>
            </p>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className={styles.bottomBar}>
          <p className={styles.copyright}>
            &copy; {currentYear} Das Dental Clinic. All Rights Reserved. | This website is designed by{' '}
            <a
              href="https://welurikmedia.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.creditLink}
            >
              Welurik Media
            </a>
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
