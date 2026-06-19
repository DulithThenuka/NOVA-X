'use client'

import React, { useState } from 'react'
import styles from './spend.module.css'
import Link from 'next/link'

// @ts-ignore
import Sidebar from '@/components/sidebar'

interface Expense {
  id: number
  title: string
  amount: number
  category: string
  date: string
}

export default function SmartSpendPage() {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      title: 'Server Hosting',
      amount: 4500,
      category: 'Tech',
      date: '2026-06-18'
    },
    {
      id: 2,
      title: 'Team Lunch',
      amount: 3800,
      category: 'Food',
      date: '2026-06-19'
    },
    {
      id: 3,
      title: 'Internet Bill',
      amount: 2500,
      category: 'Utilities',
      date: '2026-06-19'
    }
  ])

  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')

  const totalSpend = expenses.reduce((sum, item) => sum + item.amount, 0)

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !amount) return

    const newExpense: Expense = {
      id: Date.now(),
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString().split('T')[0]
    }

    setExpenses([newExpense, ...expenses])
    setTitle('')
    setAmount('')
  }

  return (
    <div
      style={{
        display: 'flex',
        width: '100vw',
        minHeight: '100vh',
        background: '#f1f1f1',
        overflow: 'hidden'
      }}
    >
      {/* Sidebar Section */}
      <Sidebar />

      {/* Main Content Section */}
      <div className={styles.spendPage} style={{ flex: 1, overflowY: 'auto' }}>
        {/* Header */}
        <div className={styles.headerContainer}>
          <h1 className={styles.pageTitle}>Smart Spend Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className={styles.badge}>Track & Optimize</span>
            <Link href="/profile" style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', display: 'block', border: '2px solid white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <img src="/person-logo.png" alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Link>
          </div>
        </div>

        {/* Grid Layout */}
        <div className={styles.gridContainer}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Total Box */}
            <div className={styles.totalBox}>
              <h3 className={styles.totalTitle}>Total Expenses</h3>
              <p className={styles.totalAmount}>
                Rs. {totalSpend.toLocaleString()}
              </p>
            </div>

            {/* Add Expense Form */}
            <div className={styles.formCard}>
              <h2 className={styles.formTitle}>Record New Expense</h2>
              <form onSubmit={handleAddExpense} className={styles.formElement}>
                <div className={styles.formGroup}>
                  <label htmlFor="expense-title">Expense Title</label>
                  <input
                    id="expense-title"
                    type="text"
                    placeholder="e.g., Office Rent"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="expense-amount">Amount (Rs.)</label>
                  <input
                    id="expense-amount"
                    type="number"
                    placeholder="e.g., 1500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={styles.inputField}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category-select">Category</label>
                  <select
                    id="category-select"
                    title="Select Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={styles.inputField}
                  >
                    <option value="Food">Food & Beverages</option>
                    <option value="Tech">Technology & Tools</option>
                    <option value="Utilities">Utilities & Bills</option>
                    <option value="Other">Other Expenses</option>
                  </select>
                </div>

                <button type="submit" className={styles.submitBtn}>
                  + Add Expense
                </button>
              </form>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <h2 className={styles.formTitle}>Recent Transactions</h2>

            <div className={styles.historyList}>
              {expenses.map((item) => (
                <div key={item.id} className={styles.transactionItem}>
                  <div>
                    <p className={styles.txTitle}>{item.title}</p>
                    <span className={styles.txCategory}>{item.category}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p className={styles.txAmount}>- Rs. {item.amount}</p>
                    <p className={styles.txDate}>{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
