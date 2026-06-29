'use client';

import React, { useState, useEffect } from 'react';
import styles from './BookingForm.module.css';

interface Slot {
  time: string;
  available: boolean;
}

export default function BookingForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    branchId: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    complaint: '',
  });

  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState('');

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Client validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const branches = [
    { id: 'jaripatka-main', name: 'Jaripatka Clinic', address: 'Sai Vasanshah Chowk, Jaripatka Bazar' },
    { id: 'sadar-suite', name: 'Sadar Clinic', address: 'Shop No. 7, SJTI Complex, Sadar' },
    { id: 'indora-laser', name: 'Indora Clinic', address: 'Dr. Ambedkar Road, Indora' },
  ];

  const getBranchLabel = (id: string) => {
    return branches.find((b) => b.id === id)?.name || id;
  };

  const getBranchAddress = (id: string) => {
    return branches.find((b) => b.id === id)?.address || '';
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Fetch available slots when branch or date changes
  useEffect(() => {
    if (!formData.branchId || !formData.date) {
      const timer = setTimeout(() => {
        setSlots((prev) => (prev.length > 0 ? [] : prev));
      }, 0);
      return () => clearTimeout(timer);
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSlotsError('');
      try {
        const res = await fetch(`/api/v1/appointments/slots?branchId=${formData.branchId}&date=${formData.date}`);
        if (!res.ok) {
          throw new Error('Failed to retrieve available slots');
        }
        const data = await res.json();
        const newSlots = data.slots || [];
        setSlots(newSlots);
        // Reset selected time if it's no longer in the retrieved list or unavailable
        setFormData((prev) => {
          if (!prev.time) return prev;
          const matchedSlot = newSlots.find((s: Slot) => s.time === prev.time);
          if (!matchedSlot || !matchedSlot.available) {
            return { ...prev, time: '' };
          }
          return prev;
        });
      } catch (err) {
        const error = err as Error;
        setSlotsError(error.message || 'Error checking availability');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [formData.branchId, formData.date]);

  // Client-side validations for step 3
  const validateStep3 = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name: alpha-spaces only, length >= 2
    const nameTrimmed = formData.name.trim();
    if (!nameTrimmed) {
      newErrors.name = 'Full name is required.';
    } else if (!/^[a-zA-Z\s]{2,}$/.test(nameTrimmed)) {
      newErrors.name = 'Name must be at least 2 characters and contain only letters and spaces.';
    }

    // Phone: Indian phone number
    const phoneClean = formData.phone.replace(/\s+/g, '');
    if (!phoneClean) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(phoneClean)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    // Email: RFC 5322 regex validation (optional)
    if (formData.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address format.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (step === 1 && !formData.branchId) return;
    if (step === 2 && (!formData.date || !formData.time)) return;
    if (step === 3) {
      if (!validateStep3()) return;
    }
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.time) return;

    setLoadingSubmit(true);
    setSubmitError('');

    try {
      // Map properties to new POST schema
      const payload = {
        branchId: formData.branchId,
        dateTimeSlot: convertToISO(formData.date, formData.time),
        name: formData.name.trim(),
        phone: formData.phone.replace(/\s+/g, ''),
        email: formData.email,
        complaint: formData.complaint,
      };

      const response = await fetch('/api/v1/appointments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to confirm reservation.');
      }

      // Save to localStorage for demo persistence in serverless previews
      try {
        const localBookings = JSON.parse(localStorage.getItem('das_dental_bookings') || '[]');
        localBookings.unshift(data.booking);
        localStorage.setItem('das_dental_bookings', JSON.stringify(localBookings));
      } catch (e) {
        console.error('Failed to save booking to localStorage:', e);
      }

      setSubmitted(true);
    } catch (err) {
      const error = err as Error;
      console.error('Submission error:', error);
      setSubmitError(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Helper to convert date and 12h time back to ISO for post payload
  const convertToISO = (dateStr: string, timeStr: string) => {
    const match = timeStr.match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return '';
    let hour = parseInt(match[1]);
    const minute = parseInt(match[2]);
    const ampm = match[3].toUpperCase();

    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    return `${dateStr}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00+05:30`;
  };

  const formatDateFriendly = (dateStr: string) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getAddToCalendarLink = () => {
    const { date, time, branchId, name, complaint } = formData;
    if (!date || !time || !branchId) return '';
    
    const isoStr = convertToISO(date, time);
    if (!isoStr) return '';
    
    try {
      const startDate = new Date(isoStr);
      const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
      
      const formatUTC = (d: Date) => {
        return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };
      
      const dates = `${formatUTC(startDate)}/${formatUTC(endDate)}`;
      const branchLabel = getBranchLabel(branchId);
      const branchAddress = getBranchAddress(branchId);
      
      const summary = encodeURIComponent(`${name} — Dental Appointment (${branchLabel})`);
      const details = encodeURIComponent(
        `Your dental appointment at Das Dental Clinic is confirmed.\n\nClinic Location: ${branchLabel}\nAddress: ${branchAddress}\nDate: ${formatDateFriendly(date)}\nTime: ${time}\nChief Complaint: ${complaint || 'None'}\n\nWe look forward to seeing you!`
      );
      const location = encodeURIComponent(branchAddress);
      
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${summary}&dates=${dates}&details=${details}&location=${location}`;
    } catch (e) {
      console.error('Error generating Google Calendar template link:', e);
      return '';
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
        <h3 className={styles.successTitle}>Booking Confirmed!</h3>
        <p className={styles.successMessage}>
          Thank you, <strong>{formData.name}</strong>. Your appointment at our <strong>{getBranchLabel(formData.branchId)}</strong> has been successfully booked for <strong>{formatDateFriendly(formData.date)}</strong> at <strong>{formData.time}</strong>.
        </p>
        <p className={styles.successSubtext}>
          A calendar invite and details have been registered. Our clinical team will reach out to you shortly at <strong>{formData.phone}</strong>.
        </p>
        <div className={styles.successActions}>
          <a 
            href={getAddToCalendarLink()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.calendarButton}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px', verticalAlign: 'middle' }}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            Add to Google Calendar
          </a>
          <button className={styles.resetButton} onClick={() => {
            setStep(1);
            setFormData({
              branchId: '',
              date: '',
              time: '',
              name: '',
              phone: '',
              email: '',
              complaint: '',
            });
            setSubmitted(false);
            setSubmitError('');
            setErrors({});
          }}>
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer} id="book">
      {/* 4-Step minimal luxury progress tracker */}
      <div className={styles.stepsBar}>
        {[1, 2, 3, 4].map((s) => (
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
        {/* Step 1: Select Clinic Branch */}
        {step === 1 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Select Clinic Location</h3>
            <div className={styles.optionsGrid}>
              {branches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className={`${styles.optionButton} ${formData.branchId === b.id ? styles.selected : ''}`}
                  onClick={() => handleChange('branchId', b.id)}
                >
                  <span className={styles.optionName}>{b.name}</span>
                  <span className={styles.optionSub}>{b.address}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date & Time Picker */}
        {step === 2 && (
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

              {formData.date && (
                <div className={styles.timeGroup}>
                  <label className={styles.label}>Available Slots</label>
                  
                  {loadingSlots ? (
                    <div className={styles.skeletonGrid}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className={styles.skeletonSlot} />
                      ))}
                    </div>
                  ) : slotsError ? (
                    <div className={styles.errorText}>{slotsError}</div>
                  ) : slots.length === 0 ? (
                    <div className={styles.infoText}>Please select a clinic location and a valid date.</div>
                  ) : (
                    <div className={styles.timeGrid}>
                      {slots.map((s) => (
                        <button
                          key={s.time}
                          type="button"
                          disabled={!s.available}
                          className={`${styles.timeButton} ${
                            formData.time === s.time 
                              ? styles.timeSelected 
                              : ''
                          } ${!s.available ? styles.timeDisabled : ''}`}
                          onClick={() => handleChange('time', s.time)}
                        >
                          {s.time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Patient Intake Form */}
        {step === 3 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Patient Information</h3>
            <div className={styles.inputGrid}>
              <div className={styles.inputGroup}>
                <label htmlFor="name" className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter full name (alphabets only)"
                  className={`${styles.textInput} ${errors.name ? styles.inputError : ''}`}
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
                {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="phone" className={styles.label}>Phone Number (WhatsApp) *</label>
                <input
                  type="tel"
                  id="phone"
                  placeholder="Enter 10-digit Indian number"
                  className={`${styles.textInput} ${errors.phone ? styles.inputError : ''}`}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                />
                {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email Address (Optional)</label>
                <input
                  type="email"
                  id="email"
                  placeholder="name@example.com"
                  className={`${styles.textInput} ${errors.email ? styles.inputError : ''}`}
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
                {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="complaint" className={styles.label}>Chief Complaint / Remarks (Optional)</label>
                <textarea
                  id="complaint"
                  placeholder="Describe your dental symptoms or preferences..."
                  rows={4}
                  className={styles.textareaInput}
                  value={formData.complaint}
                  onChange={(e) => handleChange('complaint', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Reservation Confirmation State */}
        {step === 4 && (
          <div className={styles.stepContent}>
            <h3 className={styles.stepTitle}>Confirm Your Appointment</h3>
            <div className={styles.briefCard}>
              <div className={styles.briefHeader}>Appointment Summary</div>
              
              <div className={styles.briefRow}>
                <span className={styles.briefLabel}>Clinic Location</span>
                <span className={styles.briefValue}>
                  <strong>{getBranchLabel(formData.branchId)}</strong>
                  <br />
                  <small>{getBranchAddress(formData.branchId)}</small>
                </span>
              </div>

              <div className={styles.briefRow}>
                <span className={styles.briefLabel}>Date & Time</span>
                <span className={styles.briefValue}>
                  {formatDateFriendly(formData.date)} at <strong>{formData.time}</strong>
                </span>
              </div>

              <div className={styles.briefRow}>
                <span className={styles.briefLabel}>Patient Name</span>
                <span className={styles.briefValue}>{formData.name}</span>
              </div>

              <div className={styles.briefRow}>
                <span className={styles.briefLabel}>Contact Details</span>
                <span className={styles.briefValue}>
                  {formData.phone}
                  {formData.email && <><br />{formData.email}</>}
                </span>
              </div>

              {formData.complaint && (
                <div className={styles.briefRow}>
                  <span className={styles.briefLabel}>Chief Complaint</span>
                  <span className={styles.briefValue} style={{ whiteSpace: 'pre-wrap', fontStyle: 'italic' }}>
                    &ldquo;{formData.complaint}&rdquo;
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {submitError && (
          <div className={styles.submitErrorBlock}>
            {submitError}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className={styles.formActions}>
          {step > 1 && (
            <button 
              type="button" 
              onClick={prevStep} 
              className={styles.backButton} 
              disabled={loadingSubmit}
            >
              Back
            </button>
          )}
          {step < 4 ? (
            <button 
              type="button" 
              onClick={nextStep} 
              className={styles.nextButton}
              disabled={
                (step === 1 && !formData.branchId) ||
                (step === 2 && (!formData.date || !formData.time))
              }
            >
              Continue
            </button>
          ) : (
            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={loadingSubmit}
            >
              {loadingSubmit ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
