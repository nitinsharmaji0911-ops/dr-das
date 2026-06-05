'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import MobileBottomNav from '../components/MobileBottomNav';
import Footer from '../components/Footer';
import BeforeAfter from '../components/BeforeAfter';
import BookingForm from '../components/BookingForm';
import reviews from '../data/reviews.json';
import styles from './page.module.css';

export default function Home() {
  const slides = [
    {
      tag: 'Advanced Dental Care',
      title: (
        <>
          Designed for Beautiful{' '}
          <span style={{ color: 'var(--primary)' }}>Smiles</span>
        </>
      ),
      subtitle: 'Advanced care. Modern technology. A gentle touch for real results. All in one trusted dental clinic in Nagpur.',
      bgImage: '/images/hero_bg.png'
    },
    {
      tag: 'Precision Implant Surgery',
      title: (
        <>
          Restore Your Smile with{' '}
          <span style={{ color: 'var(--primary)' }}>Precision Implants.</span>
        </>
      ),
      subtitle: 'Pain-free dental implants and premium porcelain veneers from MDS Gold Medalist surgeons.',
      bgImage: '/images/clinic_interior_1.png'
    },
    {
      tag: 'Modern Orthodontics',
      title: (
        <>
          Get the Perfect Smile with{' '}
          <span style={{ color: 'var(--primary)' }}>Clear Aligners.</span>
        </>
      ),
      subtitle: 'Discreet, wireless orthodontic alignment for children, teens, and adults in Nagpur.',
      bgImage: '/images/clinic_interior_2.png'
    }
  ];

  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const services = [
    {
      id: 'implants',
      title: 'Dental Implants',
      description: 'Fixed Teeth solutions for missing teeth. Restores complete function, feel, and natural aesthetics.',
      cta: 'Explore Implants',
      featured: true,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 5c0-1.66 1.34-3 3-3h6c1.66 0 3 1.34 3 3v3H6V5zm3 4h6v1H9V9zm1 2h4v2h-4zm-1 3h6v1.5H9V14zm1 2.5h4v1.5h-4v-1.5zm1 2.5h2v3c0 .55-.45 1-1 1s-1-.45-1-1v-3z" />
        </svg>
      )
    },
    {
      id: 'braces',
      title: 'Braces Treatment',
      description: 'Orthodontic correction including modern Tooth Coloured Braces and advanced ceramic brackets for all ages.',
      cta: 'About Braces',
      featured: false,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 2c-1.66 0-3 1.34-3 3v14c0 1.66 1.34 3 3 3h14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3H5zm2 5h10v2H7V7zm0 4h10v2H7v-2zm0 4h10v2H7v-2z"/>
        </svg>
      )
    },
    {
      id: 'aligners',
      title: 'ALLINERS / INVISALIGN',
      description: 'Invisible, comfortable, and accurate clear aligners. Transform your smile discreetly without wires.',
      cta: 'About Aligners',
      featured: true,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2 11h20v2H2z" />
          <rect x="5" y="8" width="4" height="8" rx="1" />
          <rect x="15" y="8" width="4" height="8" rx="1" />
        </svg>
      )
    },
    {
      id: 'fillings',
      title: 'Composite Fillings',
      description: 'Tooth Coloured Fillings for seamless, natural-looking restorations that blend perfectly with your smile.',
      cta: 'About Fillings',
      featured: false,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l2.4 7.2 7.2 2.4-7.2 2.4-2.4 7.2-2.4-7.2-7.2-2.4 7.2-2.4L12 2z" />
        </svg>
      )
    },
    {
      id: 'extraction',
      title: 'Tooth Extraction',
      description: 'Gentle, expert care for teeth requiring extraction, ensuring minimal discomfort and rapid healing.',
      cta: 'About Gentle Extraction',
      featured: false,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2c-5.52 0-10 4.48-10 10s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
        </svg>
      )
    },
    {
      id: 'rct',
      title: 'Root Canal Treatment (RCT)',
      description: 'Endodontic procedure to save natural teeth. Executed by expert endodontists using automated rotary technology.',
      cta: 'Learn About RCT',
      featured: false,
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.33 6.04c-.38-1.52-1.69-2.5-3.13-2.5-1.12 0-2.13.6-2.68 1.5-.23.38-.45.79-.65 1.2a18.3 18.3 0 00-.74-1.39C11.58 3.95 10.57 3.54 9.47 3.54c-1.44 0-2.75.98-3.13 2.5a6.6 6.6 0 00-.09 2.51c.32 2.93 2.06 5.86 3.19 7.76.25.43.37.89.37 1.37v2.09c0 .73.6 1.33 1.33 1.33.6 0 1.13-.39 1.28-.97.16-.62.74-1.03 1.38-1.03.64 0 1.22.41 1.38 1.03.15.58.68.97 1.28.97.73 0 1.33-.6 1.33-1.33v-2.09c0-.48.12-.94.37-1.37 1.13-1.9 2.87-4.83 3.19-7.76.12-.86.09-1.7-.09-2.51z"/>
        </svg>
      )
    }
  ];

  const branches = [
    {
      id: 'jaripatka',
      name: 'Jaripatka Clinic',
      tag: 'Advanced Implant Hub',
      address: 'Sai Vasanshah Chowk, Near Ganesh Mandir, Jaripatka Bazar - 440014',
      phone: '+91 9730303606'
    },
    {
      id: 'sadar',
      name: 'Sadar Clinic',
      tag: 'Cosmetic & Veneer Suite',
      address: 'Shop No. 7, SJTI Complex, Below IDBI Bank, Sadar',
      phone: '+91 9130812537'
    },
    {
      id: 'indora',
      name: 'Indora Clinic',
      tag: 'Laser & Family Dentistry',
      address: 'Dr. Ambedkar Road, Near Rajput Rest., Indora',
      phone: '+91 8554939853'
    }
  ];

  return (
    <>
      <Navbar />

      {/* 1. Hero — Side by Side Layout */}
      <section className={styles.hero}>
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`${styles.heroSlide} ${isActive ? styles.heroSlideActive : ''}`}
            >
              <div className={styles.heroInner}>
                <div className={styles.heroTextSide}>
                  <span className={styles.heroTag}>{slide.tag}</span>
                  <h1 className={styles.heroTitle}>{slide.title}</h1>
                  <p className={styles.heroSubtitle}>{slide.subtitle}</p>
                  <div className={styles.heroActions}>
                    <Link href="/#book" className={styles.heroBtn}>
                      Book Appointment &rarr;
                    </Link>
                    <Link href="/services" className={styles.heroBtnOutline}>
                      Learn More &rarr;
                    </Link>
                  </div>
                </div>
                <div className={styles.heroImageSide}>
                  <div
                    className={styles.heroImage}
                    style={{ backgroundImage: `url('${slide.bgImage}')` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        <div className={styles.slideIndicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === currentSlide ? styles.indicatorActive : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. Stats Row */}
      <section className={styles.statsRow}>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className={styles.statNumber}>15+</div>
            <div className={styles.statLabel}>Years of Excellence</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div className={styles.statNumber}>15,000+</div>
            <div className={styles.statLabel}>Happy Patients</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <div className={styles.statNumber}>3 Clinics</div>
            <div className={styles.statLabel}>Across Nagpur</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className={styles.statNumber}>5 MDS</div>
            <div className={styles.statLabel}>Specialist Dentists</div>
          </div>
        </div>
      </section>

      {/* 3. Our Services */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSub}>Our Services</span>
            <h2 className={styles.sectionTitle}>
              Comprehensive Care for Every <span style={{ color: 'var(--primary)' }}>Smile</span>
            </h2>
            <p className={styles.sectionDesc}>
              Care tailored to you. From general hygiene to complex implant surgeries, our focus is always on your comfort and long-term health.
            </p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map((s, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3 className={styles.serviceTitle}>{s.title}</h3>
                <p className={styles.serviceDesc}>{s.description}</p>
                <Link href="/services" className={styles.serviceLearnLink}>
                  {s.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. About Section — 3 Panel Layout */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContainer}>
          <div className={styles.aboutImageLeft}>
            <img src="/images/clinic_interior_1.png" alt="Das Dental Clinic Interior" />
          </div>
          <div className={styles.aboutContent}>
            <span className={styles.aboutTag}>About Us</span>
            <h2 className={styles.aboutHeading}>
              Where Artistry Meets <span style={{ color: 'var(--primary)' }}>Dentistry</span>
            </h2>
            <p className={styles.aboutDesc}>
              At Das Dental Clinic, we blend artistry, technology, and compassion to deliver life-changing smiles in a comfortable, clinical yet spa-like environment.
            </p>
            <ul className={styles.aboutBullets}>
              <li className={styles.aboutBulletItem}>
                <span className={styles.aboutBulletIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Advanced Technology & 3D Diagnostics
              </li>
              <li className={styles.aboutBulletItem}>
                <span className={styles.aboutBulletIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                MDS Gold Medalist Specialists
              </li>
              <li className={styles.aboutBulletItem}>
                <span className={styles.aboutBulletIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Painless & Comfortable Experience
              </li>
              <li className={styles.aboutBulletItem}>
                <span className={styles.aboutBulletIcon}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Natural & Long-Lasting Results
              </li>
            </ul>
            <Link href="/about" className={styles.aboutCta}>
              Meet Our Team &rarr;
            </Link>
          </div>
          <div className={styles.aboutImageRight} style={{ backgroundImage: "url('/images/clinic_interior_2.png')" }}>
            <div className={styles.aboutOverlay}>
              <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#FFFFFF', opacity: 0.9 }}>
                <path d="M19.33 6.04c-.38-1.52-1.69-2.5-3.13-2.5-1.12 0-2.13.6-2.68 1.5-.23.38-.45.79-.65 1.2a18.3 18.3 0 00-.74-1.39C11.58 3.95 10.57 3.54 9.47 3.54c-1.44 0-2.75.98-3.13 2.5a6.6 6.6 0 00-.09 2.51c.32 2.93 2.06 5.86 3.19 7.76.25.43.37.89.37 1.37v2.09c0 .73.6 1.33 1.33 1.33.6 0 1.13-.39 1.28-.97.16-.62.74-1.03 1.38-1.03.64 0 1.22.41 1.38 1.03.15.58.68.97 1.28.97.73 0 1.33-.6 1.33-1.33v-2.09c0-.48.12-.94.37-1.37 1.13-1.9 2.87-4.83 3.19-7.76.12-.86.09-1.7-.09-2.51z"/>
              </svg>
              <span className={styles.aboutOverlayText}>Your Smile Is Our Art</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Before/After — Side by Side */}
      <section className={styles.sliderSection}>
        <div className={styles.sliderLayout}>
          <div className={styles.sliderTextSide}>
            <span className={styles.sliderTag}>Real Results</span>
            <h2 className={styles.sliderHeading}>
              Real Results.<br />
              Real <span style={{ color: 'var(--primary)' }}>Confidence.</span>
            </h2>
            <p className={styles.sliderSubtext}>Swipe to see the transformation</p>
          </div>
          <div className={styles.sliderImageSide}>
            <BeforeAfter 
              beforeImage="/images/smile_before.png" 
              afterImage="/images/smile_after.png"
              title="Smile Restoration & Realignment"
            />
          </div>
        </div>
      </section>

      {/* 6. Patient Reviews — Split layout */}
      <section className={styles.reviewsSection}>
        <div className={styles.reviewsLayout}>
          <div className={styles.reviewsLeft}>
            <span className={styles.reviewsLeftTag}>Patient Love</span>
            <h2 className={styles.reviewsLeftHeading}>
              Trusted By<br />
              <span style={{ color: 'var(--primary)' }}>Thousands</span>
            </h2>
          </div>
          <div className={styles.reviewsRight}>
            <div className={styles.reviewsGrid}>
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className={styles.reviewCard}>
                  <span className={styles.reviewQuoteIcon}>&ldquo;</span>
                  <div className={styles.reviewStars}>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className={styles.star}>★</span>
                    ))}
                  </div>
                  <p className={styles.reviewFeedback}>{review.feedback}</p>
                  <div className={styles.reviewAuthor}>
                    <div className={styles.reviewAvatar}>
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className={styles.reviewName}>{review.name}</div>
                      <div className={styles.reviewDate}>Verified Patient</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. Nagpur Branches */}
      <section className={styles.branchesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSub}>Find a Clinic Near You</span>
            <h2 className={styles.sectionTitle}>Our Nagpur Branches</h2>
            <p className={styles.sectionDesc}>Book a consultation at any of our three convenient clinics.</p>
          </div>
          <div className={styles.branchesGrid}>
            {branches.map((b) => (
              <div key={b.id} className={styles.branchCard}>
                <div className={styles.branchCardBadge}>{b.tag}</div>
                <h3 className={styles.branchName}>{b.name}</h3>
                <p className={styles.branchAddress}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {b.address}
                </p>
                <a href={`tel:${b.phone.replace(/\s+/g, '')}`} className={styles.branchPhone}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  {b.phone}
                </a>
                <Link href="/#book" className={styles.branchBookBtn}>
                  Book Now ({b.name.split(' ')[0]})
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Digital Treatment Planning */}
      <section className={styles.digitalSection}>
        <div className={styles.digitalContainer}>
          <div className={styles.digitalVisual}>
            <div className={styles.xrayFrame}>
              <svg viewBox="0 0 100 100" className={styles.skullSvg}>
                <path d="M50,15 C33,15 25,25 25,45 C25,55 28,62 33,68 L33,80 C33,83 37,85 41,85 L59,85 C63,85 67,83 67,80 L67,68 C72,62 75,55 75,45 C75,25 67,15 50,15 Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                <path d="M35,45 C35,40 38,38 42,38 C46,38 48,40 48,45 C48,50 44,52 42,52 C38,52 35,50 35,45 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M65,45 C65,40 62,38 58,38 C54,38 52,40 52,45 C52,50 56,52 58,52 C62,52 65,50 65,45 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M40,72 L60,72 M42,75 L58,75 M44,78 L56,78" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="50" cy="45" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
              </svg>
              <div className={styles.scannerLine} />
            </div>
          </div>
          <div className={styles.digitalText}>
            <span className={styles.digitalTag}>Precision Technology</span>
            <h2 className={styles.digitalTitle}>Advanced Digital Treatment Planning</h2>
            <p className={styles.digitalDesc}>
              We use 3D intraoral scanners and digital panoramic diagnostics to create highly accurate treatment guides. This eliminates guesswork, reduces treatment times, and ensures a painless experience.
            </p>
            <ul className={styles.digitalList}>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--primary-light)' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                99.8% precision mapping for custom implants
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--primary-light)' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                No sticky molds — fully digital 3D scans
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'var(--primary-light)' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Instant simulation of your final smile
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 9. Meet Our Experts */}
      <section className={styles.expertsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSub}>Our Specialist Team</span>
            <h2 className={styles.sectionTitle}>Meet Our Experts</h2>
            <p className={styles.sectionDesc}>The family of specialists dedicated to your care and comfort.</p>
          </div>
          <div className={styles.expertsGrid}>
            <div className={styles.expertCard}>
              <div className={styles.expertImageFrame}>
                <div className={styles.expertImage} style={{ backgroundImage: 'url(/images/dr_shraddha.jpg)' }} />
                <div className={styles.expertGoldBorder} />
              </div>
              <h3 className={styles.expertName}>Dr. Shraddha Daswani</h3>
              <span className={styles.expertDegree}>M.D.S. Prosthodontics & Implantology</span>
              <blockquote className={styles.expertQuote}>
                &ldquo;Every smile we restore changes how someone sees themselves.&rdquo;
              </blockquote>
              <p className={styles.expertDesc}>
                Specializes in fixed cosmetic teeth, full mouth rehabilitation, crown & bridge designs, and aesthetic porcelain restorations.
              </p>
            </div>
            <div className={styles.expertCard}>
              <div className={styles.expertImageFrame}>
                <div className={styles.expertImage} style={{ backgroundImage: 'url(/images/dr_badal.jpg)' }} />
                <div className={styles.expertGoldBorder} />
              </div>
              <h3 className={styles.expertName}>Dr. Badal Daswani</h3>
              <span className={styles.expertDegree}>M.D.S. Orthodontics & Dentofacial Orthopedics</span>
              <blockquote className={styles.expertQuote}>
                &ldquo;Straight teeth aren&apos;t just cosmetic — they&apos;re life-changing confidence.&rdquo;
              </blockquote>
              <p className={styles.expertDesc}>
                Specialist in digital aligners, Invisalign, tooth-colored ceramic braces, and child jaw orthopedics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Online Booking */}
      <section className={styles.bookingSection} id="book">
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSub}>Book an Appointment</span>
            <h2 className={styles.sectionTitle}>Schedule Your Visit Online</h2>
            <p className={styles.sectionDesc}>Choose your closest Nagpur branch and preferred doctor in seconds.</p>
          </div>
          <BookingForm />
        </div>
      </section>

      {/* 11. CTA Bar */}
      <section className={styles.ctaBar}>
        <div className={styles.ctaBarInner}>
          <div className={styles.ctaBarLeft}>
            <div className={styles.ctaBarIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.33 6.04c-.38-1.52-1.69-2.5-3.13-2.5-1.12 0-2.13.6-2.68 1.5-.23.38-.45.79-.65 1.2a18.3 18.3 0 00-.74-1.39C11.58 3.95 10.57 3.54 9.47 3.54c-1.44 0-2.75.98-3.13 2.5a6.6 6.6 0 00-.09 2.51c.32 2.93 2.06 5.86 3.19 7.76.25.43.37.89.37 1.37v2.09c0 .73.6 1.33 1.33 1.33.6 0 1.13-.39 1.28-.97.16-.62.74-1.03 1.38-1.03.64 0 1.22.41 1.38 1.03.15.58.68.97 1.28.97.73 0 1.33-.6 1.33-1.33v-2.09c0-.48.12-.94.37-1.37 1.13-1.9 2.87-4.83 3.19-7.76.12-.86.09-1.7-.09-2.51z"/>
              </svg>
            </div>
            <div>
              <div className={styles.ctaBarHeading}>Ready for Your Best Smile?</div>
              <div className={styles.ctaBarSub}>Book your consultation today and take the first step towards a healthier, more confident you.</div>
            </div>
          </div>
          <div className={styles.ctaBarRight}>
            <Link href="/#book" className={styles.ctaBarBtn}>
              Book Appointment &rarr;
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
