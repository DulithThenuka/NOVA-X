'use client'

import React from 'react'
import Link from 'next/link'
import styles from './home.module.css' // 💡 අලුත් CSS මොඩියුලය import කළා

export default function HomePage() {
  return (
    <div className={styles.homeContainer}>
      <h1 className={styles.title}>Smart Spend</h1>
      <p className={styles.subtitle}>Manage your finances effortlessly</p>

      {/* බටන් 5ක් තියෙන Layout එක */}
      <div className={styles.buttonGrid}>
        <Link
          href="/bank-accounts"
          className={`${styles.btn} ${styles.btnAccounts}`}
        >
          Accounts
        </Link>
        <Link
          href="/bank-transfer"
          className={`${styles.btn} ${styles.btnTransfer}`}
        >
          Bank Transfer
        </Link>
        <Link href="/pay-bills" className={`${styles.btn} ${styles.btnBills}`}>
          Pay Bills
        </Link>
        <Link
          href="/e-statement"
          className={`${styles.btn} ${styles.btnStatement}`}
        >
          E-Statement
        </Link>
      </div>

      <div className={styles.centerRow}>
        <Link href="/smart-spend" className={styles.btnSmartSpend}>
          Smart Spend
        </Link>
      </div>
    </div>
  )
}
