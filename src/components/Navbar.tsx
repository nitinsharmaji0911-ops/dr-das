'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/das_logo.png" alt="DAS Dental Clinic" className={styles.logoImg} />
        </Link>

        {/* Desktop pill nav */}
        <div className={styles.pill}>
          <Link href="/services" className={`${styles.pillLink} ${pathname === '/services' ? styles.pillActive : ''}`}>Services</Link>
          <Link href="/timing" className={`${styles.pillLink} ${pathname === '/timing' ? styles.pillActive : ''}`}>Timing</Link>
          <Link href="/contact" className={`${styles.pillLink} ${pathname === '/contact' ? styles.pillActive : ''}`}>Contact</Link>
        </div>

        {/* Mobile hamburger */}
        <button className={styles.hamburger} onClick={() => setIsOpen(!isOpen)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className={styles.drawer}>
          <Link href="/services" className={styles.drawerLink} onClick={() => setIsOpen(false)}>Services</Link>
          <Link href="/timing" className={styles.drawerLink} onClick={() => setIsOpen(false)}>Timing</Link>
          <Link href="/contact" className={styles.drawerLink} onClick={() => setIsOpen(false)}>Contact</Link>
          <Link href="/#book" className={styles.drawerLink} onClick={() => setIsOpen(false)}>Book Appointment</Link>
        </div>
      )}
    </nav>
  );
}
