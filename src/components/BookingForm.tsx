'use client';

import React, { useState } from 'react';
import styles from './BookingForm.module.css';

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    branch: '',
    service: '',
    doctor: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const branches = [
    { id: 'jaripatka', name: 'Jaripatka Branch', address: 'Sai Vasanshah Chowk' },
    { id: 'sadar', name: 'Sadar Branch', address: 'SJTI Complex, Sadar' },
    { id: 'indora', name: 'Indora Branch', address: 'Dr. Ambedkar Road, Indora' },
  ];

  const services = [
    { id: 'implants', name: 'Dental Implants (Fixed Teeth)' },
    { id: 'aligners', name: 'Aligners / Invisalign' },
    { id: 'makeover', name: 'Smile Makeover / Veneers' },
    { id: 'braces', name: 'Braces Treatment' },
    { id: 'rct', name: 'Root Canal Treatment (RCT)' },
    { id: 'general', name: 'General Dentistry / Checkup' },
  ];

  const doctors = [
    { id: 'any', name: 'First Available Specialist' },
    { id: 'lokesh', name: 'Dr. Lokesh Daswani (Implantologist)' },
    { id: 'shraddha', name: 'Dr. Shraddha Daswani (Prosthodontist)' },
    { id: 'badal', name: 'Dr. Badal Daswani (Orthodontist)' },
    { id: 'mishti', name: 'Dr. Mishti Daswani (Orthodontist)' },
    { id: 'om', name: 'Dr. Om Prakash Daswani (Cosmetic Dentist)' },
  ];

  const times = [
    '10:30 AM', '11:30 AM', '12:30 PM', '04:30 PM', '05:30 PM', '06:30 PM', '07:30 PM'
  ];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step === 1 && !formData.branch) return;
    if (step === 2 && !formData.service) return;
    if (step === 3 && !formData.doctor) return;
    if (step === 4 && (!formData.date || !formData.time)) return;
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to request appointment');
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className={styles.successTitle}>Booking Requested!</h3>
        <p className={styles.successMessage}>
          Thank you, <strong>{formData.name}</strong>. Your luxury appointment request at our <strong>{branches.find(b => b.id === formData.branch)?.name}</strong> has been submitted. Our concierge team will call you shortly on <strong>{formData.phone}</strong> to confirm your slot.
        </p>
        <button className={styles.resetButton} onClick={() => {
          setStep(1);
          setFormData({
            branch: '',
            service: '',
            doctor: '',
            date: '',
            time: '',
            name: '',
            phone: '',
            email: '',
          });
          setSubmitted(false);
        }}>
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className={styles.formContainer} id="book">
      <div className={styles.stepsBar}>
        {[1, 2, 3, 4, 5].map((s) => (
          <div 
            key={s} 
            className={`${styles.stepIndicator} ${
              s === step 
                ? styles.stepActive 
                : s < step 
                  ? styles.stepCompleted 
                  : styles.stepFuture
            }`}
          >
            {s < step ? '✓' : s}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Step 1: Select Branch */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Select Nearest Nagpur Branch</h3>
            <div className={styles.optionsGrid}>
              {branches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`${styles.optionButton} ${formData.branch === b.id ? styles.selected : ''}`}
                  onClick={() => handleChange('branch', b.id)}
                >
                  <span className={styles.optionName}>{b.name}</span>
                  <span className={styles.optionSub}>{b.address}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Service */}
        {step === 2 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Choose Dental Treatment</h3>
            <div className={styles.optionsGrid}>
              {services.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`${styles.optionButton} ${formData.service === s.id ? styles.selected : ''}`}
                  onClick={() => handleChange('service', s.id)}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Select Doctor */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Choose Doctor / Specialist</h3>
            <div className={styles.optionsGrid}>
              {doctors.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  className={`${styles.optionButton} ${formData.doctor === d.id ? styles.selected : ''}`}
                  onClick={() => handleChange('doctor', d.id)}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Date & Time */}
        {step === 4 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Choose Date & Time Slot</h3>
            <div className={styles.dateTimeContainer}>
              <div className={styles.inputGroup}>
                <label htmlFor="date" className={styles.label}>Select Date</label>
                <input
                  type="date"
                  id="date"
                  className={styles.dateInput}
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className={styles.timeGroup}>
                <label className={styles.label}>Select Time Slot</label>
                <div className={styles.timeGrid}>
                  {times.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`${styles.timeButton} ${formData.time === t ? styles.timeSelected : ''}`}
                      onClick={() => handleChange('time', t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Contact Details */}
        {step === 5 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Enter Contact Details</h3>
            <div className={styles.inputGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter your name"
                  className={styles.textInput}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="phone" className={styles.label}>Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter 10-digit number"
                  className={styles.textInput}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email Address (Optional)</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className={styles.textInput}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: '#d32f2f', fontSize: '0.9rem', textAlign: 'center', fontWeight: 600, marginTop: '0.5rem' }}>
            {error}
          </div>
        )}

        {/* Form Actions Navigation */}
        <div className={styles.formActions}>
          {step > 1 && (
            <button type="button" onClick={prevStep} className={styles.backButton} disabled={loading}>
              Back
            </button>
          )}
          {step < 5 ? (
            <button 
              type="button" 
              onClick={nextStep} 
              className={styles.nextButton}
              disabled={
                (step === 1 && !formData.branch) ||
                (step === 2 && !formData.service) ||
                (step === 3 && !formData.doctor) ||
                (step === 4 && (!formData.date || !formData.time))
              }
            >
              Continue
            </button>
          ) : (
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Requesting...' : 'Book Consultation'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
