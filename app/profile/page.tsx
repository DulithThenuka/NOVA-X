'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar'
import { Bell, Search, Settings } from '@/components/Icons'

type UserData = {
  id: number
  username: string
  full_name: string
  nic: string
  email: string
  role?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [nic, setNic] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Fetch user data
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch('/api/profile')
        const data = await res.json()
        if (data.ok && data.user) {
          setUser(data.user)
          setFullName(data.user.full_name || '')
          setEmail(data.user.email || '')
          setNic(data.user.nic || '')
        } else {
          setErrorMsg(data.message || 'Failed to load profile')
        }
      } catch (err) {
        setErrorMsg('Error loading profile information')
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!fullName.trim()) errs.fullName = 'Full Name is required'
    
    if (!email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address'
    }

    if (!nic.trim()) {
      errs.nic = 'NIC is required'
    } else if (nic.trim().length < 9) {
      errs.nic = 'NIC must be at least 9 characters long'
    }

    if (password) {
      if (password.length < 6) {
        errs.password = 'Password must be at least 6 characters'
      }
      if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match'
      }
    }

    setValidationErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccess(false)

    if (!validate()) return

    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || '1',
          fullName,
          email,
          nic,
          password
        })
      })
      const data = await res.json()
      if (data.ok && data.user) {
        setUser(data.user)
        setSuccess(true)
        setPassword('')
        setConfirmPassword('')
        setTimeout(() => setSuccess(false), 4000)
      } else {
        setErrorMsg(data.message || 'Failed to update profile')
      }
    } catch (err) {
      setErrorMsg('Error connecting to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="profile-layout font-geist">
      <Sidebar />

      <main className="content">
        {/* Header */}
        <header className="content-header">
          <h1 className="page-title">Profile Settings</h1>
          <div className="header-actions">
            <button className="topbar-icon" aria-label="Search">
              <Search size={22} />
            </button>
            <button className="topbar-icon" aria-label="Notifications">
              <Bell size={22} />
            </button>
            <div className="avatar-wrapper">
              <img src="/person-logo.png" alt="Profile" className="avatar" />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="loading-container">
            <div className="loader"></div>
            <p>Retrieving secure credentials...</p>
          </div>
        ) : (
          <div className="profile-container">
            {/* Profile Overview Card (Left side/Top) */}
            <div className="overview-card">
              <div className="profile-badge-bg"></div>
              <div className="profile-avatar-large">
                <img src="/person-logo.png" alt="avatar" />
                <span className="role-tag">{user?.role?.toUpperCase() || 'CUSTOMER'}</span>
              </div>
              <h2 className="profile-name">{user?.full_name || 'Dilara Perera'}</h2>
              <p className="profile-username">@{user?.username || 'dilara'}</p>
              
              <div className="status-stats">
                <div className="stat-item">
                  <span className="stat-value">Active</span>
                  <span className="stat-label">Account Status</span>
                </div>
                <div className="stat-divider"></div>
                <div className="stat-item">
                  <span className="stat-value">Rs. 100K</span>
                  <span className="stat-label">Savings</span>
                </div>
              </div>

              <div className="member-since">
                <p>Member Since: June 2026</p>
              </div>
            </div>

            {/* Profile Form (Right side) */}
            <div className="form-card">
              <div className="form-header">
                <Settings size={20} />
                <h3>Personal Information</h3>
              </div>

              {errorMsg && <div className="error-alert">{errorMsg}</div>}
              {success && (
                <div className="success-alert">
                  <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Profile updated successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={validationErrors.fullName ? 'error-input' : ''}
                      placeholder="Dilara Perera"
                    />
                    {validationErrors.fullName && <span className="error-text">{validationErrors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label>NIC Number</label>
                    <input
                      type="text"
                      value={nic}
                      onChange={(e) => setNic(e.target.value)}
                      className={validationErrors.nic ? 'error-input' : ''}
                      placeholder="200112345678"
                    />
                    {validationErrors.nic && <span className="error-text">{validationErrors.nic}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={validationErrors.email ? 'error-input' : ''}
                      placeholder="dilara@example.com"
                    />
                    {validationErrors.email && <span className="error-text">{validationErrors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label>Username (Static)</label>
                    <input
                      type="text"
                      value={user?.username || ''}
                      disabled
                      className="disabled-input"
                    />
                  </div>
                </div>

                <hr className="form-divider" />
                <h4 className="section-subtitle">Security Settings</h4>

                <div className="form-row">
                  <div className="form-group">
                    <label>New Password (leave empty to keep current)</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={validationErrors.password ? 'error-input' : ''}
                      placeholder="••••••••"
                    />
                    {validationErrors.password && <span className="error-text">{validationErrors.password}</span>}
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={validationErrors.confirmPassword ? 'error-input' : ''}
                      placeholder="••••••••"
                    />
                    {validationErrors.confirmPassword && <span className="error-text">{validationErrors.confirmPassword}</span>}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="save-btn" disabled={saving}>
                    {saving ? (
                      <span className="spinner"></span>
                    ) : (
                      'SAVE CHANGES'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <style jsx>{`
        .profile-layout {
          width: 100vw;
          min-height: 100vh;
          background: #f1f1f1;
          display: flex;
          gap: 1.5rem;
          overflow: hidden;
        }

        .content {
          flex: 1;
          padding: 1.5rem 1.25rem;
          overflow-y: auto;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: black;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .topbar-icon {
          background: transparent;
          border: none;
          color: #4b5563;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .topbar-icon:hover {
          background: rgba(0, 0, 0, 0.05);
        }

        .avatar-wrapper {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          color: #4b5563;
          gap: 1rem;
        }

        .loader {
          border: 4px solid #f3f3f3;
          border-top: 4px solid #b886b6;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .profile-container {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          flex-wrap: wrap;
        }

        /* Overview Card styling */
        .overview-card {
          width: 320px;
          background: white;
          border-radius: 22px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 2rem;
          flex-shrink: 0;
          border: 1px solid rgba(0,0,0,0.02);
        }

        .profile-badge-bg {
          height: 100px;
          width: 100%;
          background: linear-gradient(135deg, #3A063B 0%, #762f77 100%);
        }

        .profile-avatar-large {
          margin-top: -50px;
          position: relative;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
          background: white;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .profile-avatar-large img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .role-tag {
          position: absolute;
          bottom: -8px;
          background: #3A063B;
          color: white;
          font-size: 9px;
          font-weight: 700;
          padding: 2px 10px;
          border-radius: 10px;
          letter-spacing: 0.5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .profile-name {
          font-size: 20px;
          font-weight: 700;
          color: #111827;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
        }

        .profile-username {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .status-stats {
          display: flex;
          width: 100%;
          padding: 0 1.5rem;
          justify-content: space-around;
          margin-bottom: 1.5rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 700;
          color: #3a063b;
        }

        .stat-label {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 2px;
        }

        .stat-divider {
          width: 1px;
          background: #e5e7eb;
          height: 35px;
          align-self: center;
        }

        .member-since {
          font-size: 12px;
          color: #9ca3af;
          border-top: 1px solid #f3f4f6;
          width: 100%;
          text-align: center;
          padding-top: 1rem;
        }

        /* Form Card styling */
        .form-card {
          flex: 1;
          min-width: 320px;
          background: white;
          border-radius: 22px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
          padding: 2rem;
          border: 1px solid rgba(0,0,0,0.02);
        }

        .form-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #3A063B;
          margin-bottom: 2rem;
          border-bottom: 2px solid #f3f4f6;
          padding-bottom: 1rem;
        }

        .form-header h3 {
          font-size: 18px;
          font-weight: 700;
          margin: 0;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .form-group {
          flex: 1;
          min-width: 240px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .form-group input {
          height: 48px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          padding: 0 1rem;
          font-size: 15px;
          outline: none;
          color: #111827;
          transition: all 0.2s;
        }

        .form-group input:focus {
          border-color: #b886b6;
          box-shadow: 0 0 0 3px rgba(184, 134, 182, 0.15);
        }

        .disabled-input {
          background: #f3f4f6;
          color: #9ca3af !important;
          cursor: not-allowed;
          border-color: #e5e7eb !important;
        }

        .error-input {
          border-color: #ef4444 !important;
        }

        .error-text {
          font-size: 12px;
          color: #ef4444;
          margin-top: 2px;
        }

        .form-divider {
          border: 0;
          height: 1px;
          background: #e5e7eb;
          margin: 1rem 0;
        }

        .section-subtitle {
          font-size: 15px;
          font-weight: 700;
          color: #374151;
          margin-top: -0.5rem;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        .save-btn {
          background: linear-gradient(180deg, #b886b6, #9b5f90);
          color: white;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 0.5px;
          padding: 0.75rem 2.5rem;
          border-radius: 25px;
          border: none;
          box-shadow: 0 8px 16px rgba(155, 95, 144, 0.25);
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 48px;
          min-width: 180px;
        }

        .save-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(155, 95, 144, 0.35);
        }

        .save-btn:active {
          transform: translateY(0);
        }

        .save-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid white;
          border-top-color: transparent;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Alert notifications */
        .error-alert {
          background: #fef2f2;
          border-left: 4px solid #ef4444;
          color: #991b1b;
          padding: 1rem;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        .success-alert {
          background: #ecfdf5;
          border-left: 4px solid #10b981;
          color: #065f46;
          padding: 1rem;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: fadeIn 0.3s ease-out;
        }

        .success-icon {
          width: 18px;
          height: 18px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Responsive adaptations */
        @media (max-width: 1024px) {
          .profile-container {
            flex-direction: column;
            align-items: stretch;
          }
          .overview-card {
            width: 100%;
          }
          .profile-badge-bg {
            height: 120px;
          }
        }

        @media (max-width: 768px) {
          .profile-layout {
            flex-direction: column;
            gap: 0;
          }
          .content {
            padding: 1rem;
          }
          .page-title {
            font-size: 22px;
          }
          .form-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
