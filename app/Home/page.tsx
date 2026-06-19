'use client'

import React from 'react'
import Link from 'next/link'
import styles from './home.module.css'

export default function HomePage() {
  return (
    <main className={styles.pageContainer}>
      <section className={styles.cardContainer}>
        {/* Left artwork panel */}
        <aside
          aria-label="Nova Bank shell artwork"
          className={styles.artworkSide}
        >
          <img
            src="/loginshellbg.png"
            alt=""
            className={styles.artworkBg}
            aria-hidden="true"
          />

          <div className={styles.logoCenter}>
            <img
              src="/loginlogo.png"
              alt="Nova Bank"
              className={styles.logoImg}
            />
          </div>
        </aside>

        {/* Right content panel */}
        <div className={styles.contentSide}>
          <div className={styles.contentInner}>
            <h1 className={styles.title}>SMART SPEND</h1>
            <p className={styles.subtitle}>Manage your finances effortlessly</p>

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
              <Link
                href="/pay-bills"
                className={`${styles.btn} ${styles.btnBills}`}
              >
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
        </div>
      </section>
    </main>
  )
}
