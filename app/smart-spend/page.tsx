'use client'

import React, { useState, useEffect } from 'react'
import styles from './spend.module.css'
import Link from 'next/link'
import Sidebar from '@/components/sidebar'
import { getCookie } from '@/lib/cookie'

interface Expense {
  id: number
  title: string
  amount: number
  category: string
  date: string
}

interface Account {
  id: number
  account_number: string
  account_name: string
  balance: string
}

export default function SmartSpendPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccount, setSelectedAccount] = useState('')
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [loading, setLoading] = useState(true)

  // Optimization states
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [activeOptimizations, setActiveOptimizations] = useState<any[]>([])
  const [appliedOptimizations, setAppliedOptimizations] = useState<number[]>([])

  const userId = getCookie('user_id') || '1'

  // Load user accounts and prefill selected account
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const res = await fetch(`/api/accounts?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          const userAccounts = data.accounts || []
          setAccounts(userAccounts)
          if (userAccounts.length > 0) {
            setSelectedAccount(userAccounts[0].account_number)
          }
        }
      } catch (err) {
        console.error('Failed to load accounts for spend tracking:', err)
      }
    }
    loadAccounts()
  }, [userId])

  // Fetch expenses (which are stored as transactions in the database)
  const fetchExpensesFromDb = async () => {
    if (!selectedAccount) return
    try {
      setLoading(true)
      const res = await fetch(`/api/transactions?account=${selectedAccount}`)
      if (res.ok) {
        const data = await res.json()
        const txns = data.transactions || []

        // Map database transactions to expense items
        const mappedExpenses = txns.map((t: any) => ({
          id: t.id,
          title: t.description || 'General Expense',
          amount: parseFloat(t.amount),
          category: ['Food', 'Tech', 'Utilities'].includes(t.to_account)
            ? t.to_account
            : 'Other',
          date: new Date(t.created_at).toISOString().split('T')[0]
        }))

        setExpenses(mappedExpenses)
      }
    } catch (err) {
      console.error('Failed to load expenses from transactions database:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load expenses when account is selected or changed
  useEffect(() => {
    if (selectedAccount) {
      fetchExpensesFromDb()
    }
  }, [selectedAccount])

  const totalSpend = expenses.reduce((sum, item) => sum + item.amount, 0)

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !amount.trim() || !selectedAccount) return

    try {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccount: selectedAccount,
          toAccount: category, // Category acts as destination account
          amount,
          description: title,
          userId
        })
      })

      if (!res.ok) {
        const data = await res.json()
        alert(data.message || 'Failed to record expense. Check balance.')
        return
      }

      setTitle('')
      setAmount('')
      await fetchExpensesFromDb()
    } catch (err) {
      alert('Network error recording expense.')
    }
  }

  const handleOptimize = () => {
    if (expenses.length === 0) {
      alert('Please add some expenses first to run optimization analysis!')
      return
    }

    setIsOptimizing(true)
    setTimeout(() => {
      setIsOptimizing(false)

      const recommendations = expenses.map((exp) => {
        let title = 'General Savings Plan'
        let desc = `Apply standard discount code for budget optimization on "${exp.title}"`
        let savings = Math.round(exp.amount * 0.05) // 5% default

        if (exp.category === 'Tech') {
          title = 'Cloud Tier Optimization'
          desc = `Downgrade idle node resources on "${exp.title}"`
          savings = Math.round(exp.amount * 0.15) // 15% for Tech
        } else if (exp.category === 'Food') {
          title = 'Vendor Discount Promo'
          desc = `Apply corporate meal coupons to "${exp.title}"`
          savings = Math.round(exp.amount * 0.1) // 10% for Food
        } else if (exp.category === 'Utilities') {
          title = 'Utility Plan Migration'
          desc = `Switch "${exp.title}" to standard business package`
          savings = Math.round(exp.amount * 0.08) // 8% for Utilities
        }

        return {
          id: exp.id,
          title,
          desc,
          savings: savings > 0 ? savings : 100
        }
      })

      setActiveOptimizations(recommendations)
      setShowModal(true)
    }, 1200)
  }

  const applySavings = (id: number, savings: number) => {
    setExpenses((prev) =>
      prev.map((exp) => {
        if (exp.id === id) {
          return {
            ...exp,
            amount: Math.max(0, exp.amount - savings)
          }
        }
        return exp
      })
    )
    setAppliedOptimizations((prev) => [...prev, id])
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
            <button
              className={styles.optimizeBtn}
              onClick={handleOptimize}
              disabled={isOptimizing}
            >
              {isOptimizing ? (
                <>
                  <span className={styles.spinner} />
                  Analyzing...
                </>
              ) : (
                'Track & Optimize'
              )}
            </button>
            <Link
              href="/profile"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'block',
                border: '2px solid white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <img
                src="/avatar.png"
                alt="Profile"
                className="bg-white"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
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
                {/* Account Selection */}
                <div className={styles.formGroup}>
                  <label htmlFor="account-select">Select Bank Account</label>
                  <select
                    id="account-select"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className={styles.inputField}
                    required
                  >
                    <option value="">Choose account</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.account_number}>
                        {acc.account_name} ({acc.account_number}) - Rs.{' '}
                        {parseFloat(acc.balance).toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="expense-title">Expense Title</label>
                  <input
                    id="expense-title"
                    type="text"
                    placeholder="e.g., Office Rent"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles.inputField}
                    required
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
                    required
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
              {loading ? (
                <p className="text-gray-500 py-4 text-center">
                  Loading expenses...
                </p>
              ) : expenses.length > 0 ? (
                expenses.map((item) => (
                  <div key={item.id} className={styles.transactionItem}>
                    <div>
                      <p className={styles.txTitle}>{item.title}</p>
                      <span className={styles.txCategory}>{item.category}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p className={styles.txAmount}>
                        - Rs.{' '}
                        {item.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        })}
                      </p>
                      <p className={styles.txDate}>{item.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 py-4 text-center">
                  No recorded expenses for this account.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* AI Optimizer Insights Modal */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2 className={styles.modalTitle}>💡 AI Spending Insights</h2>
                <button
                  className={styles.closeBtn}
                  onClick={() => setShowModal(false)}
                >
                  &times;
                </button>
              </div>

              <div className={styles.optimizationSummary}>
                <p>
                  Our AI analyzed your current transactions and identified{' '}
                  <strong>
                    {
                      activeOptimizations.filter(
                        (opt) => !appliedOptimizations.includes(opt.id)
                      ).length
                    }
                  </strong>{' '}
                  new ways to optimize your cash flow.
                </p>
              </div>

              <div className={styles.optimizationsList}>
                {activeOptimizations.map((opt) => {
                  const isApplied = appliedOptimizations.includes(opt.id)
                  return (
                    <div key={opt.id} className={styles.optimizationCard}>
                      <div className={styles.optimizationInfo}>
                        <h4 className={styles.optimizationTitle}>
                          {opt.title}
                        </h4>
                        <p className={styles.optimizationDesc}>{opt.desc}</p>
                        <span className={styles.savingsAmount}>
                          Save Rs. {opt.savings.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        {isApplied ? (
                          <span className={styles.appliedBadge}>✓ Applied</span>
                        ) : (
                          <button
                            className={styles.applyBtn}
                            onClick={() => applySavings(opt.id, opt.savings)}
                          >
                            Apply
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <button
                className={styles.submitBtn}
                onClick={() => setShowModal(false)}
                style={{ marginTop: '1rem' }}
              >
                Close Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
