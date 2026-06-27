'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface Booking {
  id: string;
  created_at: string;
  branch: string;
  service: string;
  doctor: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

// Date formatter for non-tech people
function formatFriendlyDate(dateStr: string): string {
  try {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return dateStr;
    
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (dateObj.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dateObj.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}

export default function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; booking: Booking | null; newStatus: string }>({ show: false, booking: null, newStatus: '' });

  // Mapping codes to human names
  const branchMap: Record<string, string> = {
    jaripatka: 'Jaripatka Branch',
    sadar: 'Sadar Branch',
    indora: 'Indora Branch',
  };

  const serviceMap: Record<string, string> = {
    implants: 'Implants (Fixed Teeth)',
    aligners: 'Aligners / Invisalign',
    makeover: 'Smile Makeover',
    braces: 'Braces Alignment',
    rct: 'Root Canal (RCT)',
    general: 'General Checkup',
  };

  const doctorMap: Record<string, string> = {
    any: 'First Available Specialist',
    lokesh: 'Dr. Lokesh Daswani',
    shraddha: 'Dr. Shraddha Daswani',
    badal: 'Dr. Badal Daswani',
    mishti: 'Dr. Mishti Daswani',
    om: 'Dr. Om Prakash Daswani',
  };

  // ─── WhatsApp Message Templates ───
  const buildWhatsAppMessage = useCallback((booking: Booking, status: string): string => {
    const branchName = branchMap[booking.branch] || booking.branch;
    const serviceName = serviceMap[booking.service] || booking.service;
    const doctorName = doctorMap[booking.doctor] || booking.doctor;
    const friendlyDate = formatFriendlyDate(booking.date);

    const greeting = `Namaste ${booking.name} 🙏`;
    const clinicName = 'Das Dental Clinic, Nagpur';

    switch (status) {
      case 'Confirmed':
        return (
          `${greeting}\n\n` +
          `✅ *Your appointment is CONFIRMED!*\n\n` +
          `📋 *Booking Details:*\n` +
          `🏥 Branch: ${branchName}\n` +
          `🦷 Treatment: ${serviceName}\n` +
          `👨‍⚕️ Doctor: ${doctorName}\n` +
          `📅 Date: ${friendlyDate}\n` +
          `⏰ Time: ${booking.time}\n\n` +
          `Please arrive 10 minutes early. Carry any previous dental records if available.\n\n` +
          `For any changes, call us or reply to this message.\n\n` +
          `Thank you for choosing ${clinicName}! 😊`
        );
      case 'Cancelled':
        return (
          `${greeting}\n\n` +
          `❌ *Your appointment has been cancelled.*\n\n` +
          `📅 Date: ${friendlyDate}\n` +
          `⏰ Time: ${booking.time}\n` +
          `🦷 Treatment: ${serviceName}\n\n` +
          `We understand plans change. You can rebook anytime through our website or by calling us.\n\n` +
          `~ ${clinicName}`
        );
      case 'Completed':
        return (
          `${greeting}\n\n` +
          `🎉 *Thank you for visiting ${clinicName}!*\n\n` +
          `Your ${serviceName} session with ${doctorName} at ${branchName} has been completed.\n\n` +
          `We hope you had a great experience! If you have any post-treatment queries, feel free to reach out.\n\n` +
          `⭐ We'd love your feedback — it helps us serve you better!\n\n` +
          `See you soon! 😊`
        );
      case 'Pending':
        return (
          `${greeting}\n\n` +
          `⏳ *Your appointment request is being reviewed.*\n\n` +
          `📋 *Booking Details:*\n` +
          `🏥 Branch: ${branchName}\n` +
          `🦷 Treatment: ${serviceName}\n` +
          `📅 Date: ${friendlyDate}\n` +
          `⏰ Time: ${booking.time}\n\n` +
          `Our team will confirm your slot shortly. We'll notify you once it's confirmed.\n\n` +
          `~ ${clinicName}`
        );
      default:
        return `${greeting}\n\nUpdate regarding your appointment at ${clinicName}: Status changed to *${status}*.\n\nPlease contact us for details.`;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to build WhatsApp link URL
  const getWhatsAppUrl = useCallback((booking: Booking, status: string) => {
    const message = buildWhatsAppMessage(booking, status);
    // Format phone: ensure it starts with country code (India = 91)
    let phone = booking.phone.replace(/\D/g, '');
    if (phone.length === 10) phone = '91' + phone;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }, [buildWhatsAppMessage]);

  // Dismiss toast
  const dismissToast = useCallback(() => {
    setToast({ show: false, booking: null, newStatus: '' });
  }, []);

  // Fetch bookings from backend
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error('Could not fetch appointments');
      let data = await res.json();

      // Merge with localStorage bookings to support serverless preview persistence
      try {
        const localBookings = JSON.parse(localStorage.getItem('das_dental_bookings') || '[]');
        const dbIds = new Set((data || []).map((b: Booking) => b.id));
        const uniqueLocal = localBookings.filter((b: Booking) => !dbIds.has(b.id));
        data = [...uniqueLocal, ...(data || [])];
      } catch (e) {
        console.error('Failed to load localStorage bookings:', e);
      }

      setBookings(data);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Update status + trigger WhatsApp toast
  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    let updatedLocalOnly = false;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          updatedLocalOnly = true;
        } else {
          throw new Error('Failed to update status on server');
        }
      }
      
      // Update local state
      const updatedBooking = bookings.find((b) => b.id === id);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: newStatus as Booking['status'] } : b))
      );

      // Update in localStorage as well for demo persistence
      try {
        const localBookings = JSON.parse(localStorage.getItem('das_dental_bookings') || '[]');
        const updatedLocal = localBookings.map((b: Booking) =>
          b.id === id ? { ...b, status: newStatus } : b
        );
        localStorage.setItem('das_dental_bookings', JSON.stringify(updatedLocal));
      } catch (e) {
        console.error('Failed to update localStorage:', e);
      }

      // Show WhatsApp notification toast
      if (updatedBooking) {
        setToast({
          show: true,
          booking: { ...updatedBooking, status: newStatus as Booking['status'] },
          newStatus,
        });

        // Auto-dismiss after 12 seconds
        setTimeout(() => dismissToast(), 12000);
      }
    } catch (err) {
      const error = err as Error;

      // Local-only update fallback (e.g. for demo bookings not on the server)
      try {
        const localBookings = JSON.parse(localStorage.getItem('das_dental_bookings') || '[]');
        const existsLocally = localBookings.some((b: Booking) => b.id === id);
        
        if (existsLocally) {
          setBookings((prev) =>
            prev.map((b) => (b.id === id ? { ...b, status: newStatus as Booking['status'] } : b))
          );
          
          const updatedLocal = localBookings.map((b: Booking) =>
            b.id === id ? { ...b, status: newStatus } : b
          );
          localStorage.setItem('das_dental_bookings', JSON.stringify(updatedLocal));
          
          const updatedBooking = bookings.find((b) => b.id === id);
          if (updatedBooking) {
            setToast({
              show: true,
              booking: { ...updatedBooking, status: newStatus as Booking['status'] },
              newStatus,
            });
            setTimeout(() => dismissToast(), 12000);
          }
          return;
        }
      } catch (localErr) {
        console.error('Local-only fallback failed:', localErr);
      }

      alert(error.message || 'Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (bookings.length === 0) return;
    
    // Header Row
    const headers = ['Booking ID', 'Booking Date', 'Time Slot', 'Patient Name', 'Phone', 'Email', 'Clinic Branch', 'Treatment Service', 'Doctor Assigned', 'Booking Status', 'Date Created'];
    
    // Data Rows
    const rows = bookings.map((b) => [
      b.id,
      b.date,
      b.time,
      b.name.replace(/,/g, ' '),
      b.phone,
      b.email || 'N/A',
      branchMap[b.branch] || b.branch,
      serviceMap[b.service] || b.service,
      doctorMap[b.doctor] || b.doctor,
      b.status,
      b.created_at,
    ]);

    // Construct CSV String
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    // Trigger Download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Das_Dental_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  // Filters logic
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      (b.email && b.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBranch = selectedBranch === 'all' || b.branch === selectedBranch;
    const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;

    return matchesSearch && matchesBranch && matchesStatus;
  });

  // Simple statistics count
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const completedCount = bookings.filter((b) => b.status === 'Completed').length;

  return (
    <div className={styles.dashboardLayout}>
      {/* Header bar */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerContainer}>
          <div className={styles.logoCol}>
            <Link href="/" className={styles.backBtn}>
              ← Back to Website
            </Link>
            <h1 className={styles.dashTitle}>Das Dental Clinic — Appointment Panel</h1>
            <p className={styles.dashSubtitle}>Easy booking manager for receptionist staff</p>
          </div>
          <div className={styles.headerActions}>
            <button 
              onClick={fetchBookings} 
              className={styles.refreshBtn}
              title="Reload data"
            >
              🔄 Refresh List
            </button>
            <button 
              onClick={handleExportCSV} 
              className={styles.exportBtn}
              disabled={filteredBookings.length === 0}
            >
              📥 Download Excel/CSV
            </button>
          </div>
        </div>
      </header>

      {/* Main container */}
      <main className={styles.container}>
        
        {/* Simple count cards */}
        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statLabel}>📋 Total Booking Requests</span>
            <span className={styles.statValue}>{totalCount}</span>
          </div>
          <div className={`${styles.statCard} ${styles.pendingCard}`}>
            <span className={styles.statLabel}>⏳ Waiting to Confirm</span>
            <span className={styles.statValue}>{pendingCount}</span>
          </div>
          <div className={`${styles.statCard} ${styles.confirmedCard}`}>
            <span className={styles.statLabel}>✅ Confirmed Bookings</span>
            <span className={styles.statValue}>{confirmedCount}</span>
          </div>
          <div className={`${styles.statCard} ${styles.completedCard}`}>
            <span className={styles.statLabel}>🎉 Visited / Completed</span>
            <span className={styles.statValue}>{completedCount}</span>
          </div>
        </section>

        {/* Filter Toolbar */}
        <section className={styles.toolbarCard}>
          <div className={styles.searchBlock}>
            <label className={styles.fieldLabel}>🔍 Search Patient</label>
            <input
              type="text"
              placeholder="Type patient's name or phone number..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className={styles.filterBlocks}>
            <div className={styles.filterGroup}>
              <label className={styles.fieldLabel}>📍 Clinic Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className={styles.selectInput}
              >
                <option value="all">All Branches</option>
                <option value="jaripatka">Jaripatka Branch</option>
                <option value="sadar">Sadar Branch</option>
                <option value="indora">Indora Branch</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.fieldLabel}>⚡ Booking Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className={styles.selectInput}
              >
                <option value="all">All Bookings</option>
                <option value="Pending">⏳ Waiting (Pending)</option>
                <option value="Confirmed">✅ Confirmed</option>
                <option value="Completed">🎉 Completed / Visited</option>
                <option value="Cancelled">❌ Cancelled</option>
              </select>
            </div>
          </div>
        </section>

        {/* Bookings List Display */}
        {loading ? (
          <div className={styles.loaderArea}>
            <span className={styles.spinner}></span>
            <p>Loading appointments list...</p>
          </div>
        ) : error ? (
          <div className={styles.errorArea}>
            <h3>⚠️ Error Loading Data</h3>
            <p>{error}</p>
            <button onClick={fetchBookings} className={styles.refreshBtn}>Try Again</button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className={styles.emptyArea}>
            <h2>📭 No appointments found</h2>
            <p>Try clearing your search query or changing filters above.</p>
          </div>
        ) : (
          <div className={styles.bookingsList}>
            <div className={styles.listHeader}>
              Showing {filteredBookings.length} appointments
            </div>
            
            {filteredBookings.map((b) => (
              <div 
                key={b.id} 
                className={`${styles.bookingCard} ${updatingId === b.id ? styles.cardUpdating : ''}`}
              >
                {/* Details Section */}
                <div className={styles.patientMainCol}>
                  <div className={styles.patientHeader}>
                    <h3 className={styles.patientName}>{b.name}</h3>
                    <a href={`tel:${b.phone}`} className={styles.patientPhone}>
                      📞 {b.phone}
                    </a>
                  </div>
                  
                  {b.email && <div className={styles.patientEmail}>✉️ {b.email}</div>}

                  <div className={styles.appointmentTags}>
                    <span className={`${styles.badge} ${styles.branchBadge}`}>
                      📍 {branchMap[b.branch] || b.branch}
                    </span>
                    <span className={`${styles.badge} ${styles.serviceBadge}`}>
                      🦷 {serviceMap[b.service] || b.service}
                    </span>
                    <span className={`${styles.badge} ${styles.doctorBadge}`}>
                      👨‍⚕️ {doctorMap[b.doctor] || b.doctor}
                    </span>
                  </div>
                </div>

                {/* Date & Time Section */}
                <div className={styles.dateTimeCol}>
                  <div className={styles.appointmentDate}>
                    {formatFriendlyDate(b.date)}
                  </div>
                  <div className={styles.appointmentTime}>
                    ⏰ {b.time}
                  </div>
                </div>

                {/* Status Selection Row (Super simple layout for non-tech folks) */}
                <div className={styles.statusCol}>
                  <div className={styles.statusRow}>
                    <div>
                      <span className={styles.statusLabel}>Change Status:</span>
                      <div className={styles.statusButtonGroup}>
                        <button
                          onClick={() => handleStatusChange(b.id, 'Pending')}
                          className={`${styles.statusBtn} ${styles.btnPending} ${b.status === 'Pending' ? styles.activeStatus : ''}`}
                          disabled={updatingId === b.id}
                        >
                          ⏳ Waiting
                        </button>
                        <button
                          onClick={() => handleStatusChange(b.id, 'Confirmed')}
                          className={`${styles.statusBtn} ${styles.btnConfirmed} ${b.status === 'Confirmed' ? styles.activeStatus : ''}`}
                          disabled={updatingId === b.id}
                        >
                          ✅ Confirm
                        </button>
                        <button
                          onClick={() => handleStatusChange(b.id, 'Completed')}
                          className={`${styles.statusBtn} ${styles.btnCompleted} ${b.status === 'Completed' ? styles.activeStatus : ''}`}
                          disabled={updatingId === b.id}
                        >
                          🎉 Done
                        </button>
                        <button
                          onClick={() => handleStatusChange(b.id, 'Cancelled')}
                          className={`${styles.statusBtn} ${styles.btnCancelled} ${b.status === 'Cancelled' ? styles.activeStatus : ''}`}
                          disabled={updatingId === b.id}
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                    <a
                      href={getWhatsAppUrl(b, b.status)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappBtn}
                      title="Send current status update to patient on WhatsApp"
                    >
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Notify on WhatsApp
                    </a>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>

      {/* WhatsApp Toast Notification */}
      {toast.show && toast.booking && (
        <div className={styles.toastOverlay}>
          <div className={styles.toastCard}>
            <div className={styles.toastHeader}>
              <div className={styles.toastIcon}>
                <svg viewBox="0 0 24 24" width="28" height="28" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <h4 className={styles.toastTitle}>Status Updated! Notify Patient?</h4>
                <p className={styles.toastSubtitle}>
                  {toast.booking.name} &bull; {toast.booking.phone}
                </p>
              </div>
              <button className={styles.toastClose} onClick={dismissToast}>✕</button>
            </div>
            <p className={styles.toastBody}>
              Appointment status changed to <strong>{toast.newStatus}</strong>. 
              Click below to send a WhatsApp message to the patient with all the details.
            </p>
            <div className={styles.toastActions}>
              <a
                href={toast.booking ? getWhatsAppUrl(toast.booking, toast.newStatus) : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.toastWhatsappBtn}
                onClick={dismissToast}
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Send WhatsApp Update
              </a>
              <button className={styles.toastDismissBtn} onClick={dismissToast}>
                Skip / Don&apos;t Notify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
