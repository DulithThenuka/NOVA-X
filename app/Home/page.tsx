'use client'

import React from 'react'
import Link from 'next/link'
import styles from './home.module.css'

const WalletIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
    <path d="M16 11h.01M22 10v4" />
  </svg>
)

const TransferIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 3L21 7L17 11M4 7H21M7 21L3 17L7 13M20 17H3" />
  </svg>
)

const BillIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="2" />
    <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 6v12" />
  </svg>
)

const StatementIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
)

const RocketIcon = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5M12 2C7.58 2 4 5.58 4 10c0 4.75 3.5 8.5 8 8.5s8-3.75 8-8.5c0-4.42-3.58-8-8-8z" />
    <path d="M12 6v4M9 12h6" />
  </svg>
)

export default function HomePage() {
  return (
    <div className={styles.homeWrapper}>
      <section className={styles.mainCard}>
        <div className={styles.brandHeader}>
          <h1 className={styles.title}>Smart Spend</h1>
          <p className={styles.subtitle}>
            Nova Bank Integrated Financial Ecosystem
          </p>
        </div>

        <div className={styles.buttonGrid}>
          <Link href="/bank-accounts" className={styles.navCard}>
            <div className={`${styles.iconWrapper} ${styles.bgAccounts}`}>
              <WalletIcon />
            </div>
            <h2 className={styles.cardLabel}>Accounts</h2>
          </Link>

          <Link href="/bank-transfer" className={styles.navCard}>
            <div className={`${styles.iconWrapper} ${styles.bgTransfer}`}>
              <TransferIcon />
            </div>
            <h2 className={styles.cardLabel}>Bank Transfer</h2>
          </Link>

          <Link href="/pay-bills" className={styles.navCard}>
            <div className={`${styles.iconWrapper} ${styles.bgBills}`}>
              <BillIcon />
            </div>
            <h2 className={styles.cardLabel}>Pay Bills</h2>
          </Link>

          <Link href="/e-statement" className={styles.navCard}>
            <div className={`${styles.iconWrapper} ${styles.bgStatement}`}>
              <StatementIcon />
            </div>
            <h2 className={styles.cardLabel}>E-Statement</h2>
          </Link>
        </div>

        <div className={styles.highlightRow}>
          <Link href="/smart-spend" className={styles.smartSpendCard}>
            <div className={`${styles.iconWrapper} ${styles.bgSmart}`}>
              <RocketIcon />
            </div>
            <h2 className={styles.cardLabel}>Launch Smart Spend Dashboard</h2>
          </Link>
        </div>
      </section>
    </div>
  )
}
