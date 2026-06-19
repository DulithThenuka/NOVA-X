'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/sidebar'
import { Bell, ChevronRight, Search } from '../../components/Icons'
import Link from 'next/link'
import { getCookie } from '@/lib/cookie'

interface Transaction {
  id: number
  from_account: string
  to_account: string
  amount: string
  description: string
  status: string
  created_at: string
}

interface Account {
  id: number
  account_number: string
  balance: string
  account_name: string
}

export default function Dashboard() {
  const [user, setUser] = useState<{ full_name: string } | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const userId = getCookie('user_id') || '1'

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // 1. Fetch Profile
        const profileRes = await fetch(`/api/profile?userId=${userId}`)
        let fullName = 'Customer'
        if (profileRes.ok) {
          const profileData = await profileRes.json()
          setUser(profileData.user)
          fullName = profileData.user?.full_name || 'Customer'
        }

        // 2. Fetch Accounts
        const accountsRes = await fetch(`/api/accounts?userId=${userId}`)
        let userAccounts: Account[] = []
        if (accountsRes.ok) {
          const accountsData = await accountsRes.json()
          userAccounts = accountsData.accounts || []
          setAccounts(userAccounts)
        }

        // 3. Fetch Transactions for all user accounts
        if (userAccounts.length > 0) {
          const transactionPromises = userAccounts.map((acc) =>
            fetch(`/api/transactions?account=${acc.account_number}`)
              .then((res) => (res.ok ? res.json() : { transactions: [] }))
              .catch(() => ({ transactions: [] }))
          )

          const results = await Promise.all(transactionPromises)
          const allTxns: Transaction[] = []

          // Combine all transactions
          results.forEach((res) => {
            if (res.transactions) {
              allTxns.push(...res.transactions)
            }
          })

          // Deduplicate transactions by ID
          const uniqueTxnsMap = new Map<number, Transaction>()
          allTxns.forEach((t) => uniqueTxnsMap.set(t.id, t))
          const sortedTxns = Array.from(uniqueTxnsMap.values()).sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )

          setTransactions(sortedTxns.slice(0, 5)) // show top 5
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [userId])

  // Aggregate total balance across accounts
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + parseFloat(acc.balance || '0'),
    0
  )

  return (
    <main className="dashboard">
      <Sidebar />

      <section className="content">
        {/* Header */}
        <header className="content-header">
          <h1 className="page-title">Dashboard</h1>
          <div className="header-actions">
            <Search size={24} />
            <Bell size={24} />
            <Link href="/profile" className="avatar-link">
              <img
                src="/avatar.png"
                alt="profile"
                className="avatar bg-white"
              />
            </Link>
          </div>
        </header>

        {/* Top Section */}
        <div className="top-section">
          <div className="welcome-card">
            <h2 className="welcome-title">
              Welcome back, {user ? user.full_name.split(' ')[0] : 'User'}!
            </h2>
            <div className="balance-card">
              <p className="balance-label">Current Balance</p>
              <p className="balance-amount">
                Rs.{' '}
                {totalBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2
                })}
              </p>
              <ChevronRight className="balance-chevron" size={30} />
            </div>
            <div className="carousel-dots">
              <span className="dot active" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <img
              src="/dashboard-logo.png"
              alt="woman"
              className="welcome-image"
            />
          </div>

          <div className="payees-card">
            <h3 className="payees-title">Connected Accounts</h3>
            <div
              className="payees-list"
              style={{ maxHeight: '140px', overflowY: 'auto' }}
            >
              {accounts.map((acc) => (
                <div key={acc.id} className="payee-item">
                  <img src="/account-logo.png" alt="user" className="avatar" />
                  <div className="payee-info">
                    <p className="font-semibold text-black">
                      {acc.account_name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      No. {acc.account_number}
                    </p>
                  </div>
                </div>
              ))}
              {accounts.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">
                  No accounts connected.
                </p>
              )}
            </div>
            <Link
              href="/bank-accounts"
              className="view-all text-purple-700 font-semibold no-underline"
            >
              Manage accounts
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>

        {/* Transactions */}
        <div className="transactions-section">
          <h2 className="transactions-title">Recent Transactions</h2>
          <div className="transactions-card">
            {loading ? (
              <p className="text-gray-500 p-4">Loading transactions...</p>
            ) : transactions.length > 0 ? (
              transactions.map((t, index) => {
                // Check if from user's account to format as positive/negative
                const userOwnedAccounts = accounts.map((a) => a.account_number)
                const isDebit = userOwnedAccounts.includes(t.from_account)
                const displayAmount = isDebit
                  ? `-Rs. ${parseFloat(t.amount).toFixed(2)}`
                  : `+Rs. ${parseFloat(t.amount).toFixed(2)}`
                const displayDate = new Date(t.created_at).toLocaleDateString(
                  'en-US',
                  {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }
                )

                return (
                  <div key={t.id || index} className="transaction-item">
                    <img
                      src="/account-logo.png"
                      alt="user"
                      className="avatar"
                    />
                    <span
                      className="transaction-date"
                      style={{ color: '#000' }}
                    >
                      {displayDate}
                    </span>
                    <span
                      className="transaction-account"
                      style={{ color: '#000' }}
                    >
                      {isDebit
                        ? `To: ${t.to_account}`
                        : `From: ${t.from_account}`}
                    </span>
                    <span
                      className="transaction-amount"
                      style={{
                        color: isDebit ? '#ef4444' : '#10b981',
                        fontWeight: '700'
                      }}
                    >
                      {displayAmount}
                    </span>
                    <span className="transaction-status">Success</span>
                  </div>
                )
              })
            ) : (
              <p className="text-gray-400 text-sm p-4 text-center">
                No recent transactions found.
              </p>
            )}
            <Link
              href="/e-statement"
              className="view-all text-purple-700 font-semibold no-underline"
            >
              View all
              <ChevronRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .dashboard {
          width: 100vw;
          min-height: 100vh;
          background: #f1f1f1;
          display: flex;
          gap: 1.5rem;
          overflow: hidden;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .content {
          flex: 1;
          padding: 1.5rem 1.25rem;
          overflow-y: auto;
          min-width: 0;
        }

        .content-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title {
          font-size: 28px;
          font-weight: 700;
          color: black;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          object-fit: cover;
        }

        .top-section {
          margin-top: 1rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .welcome-card {
          width: 640px;
          max-width: 100%;
          height: 230px;
          background: #e7e1e8;
          border-radius: 18px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        .welcome-title {
          font-size: 18px;
          padding: 0.75rem 1rem 0;
          color: black;
        }

        .balance-card {
          position: absolute;
          left: 5rem;
          top: 60px;
          width: 380px;
          max-width: calc(100% - 2rem);
          height: 120px;
          background: black;
          border-radius: 14px;
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 0 1rem;
        }

        .balance-label {
          font-size: 21px;
        }

        .balance-amount {
          color: #a7d93a;
          font-size: 20px;
          margin-top: 0.25rem;
        }

        .balance-chevron {
          position: absolute;
          right: 1rem;
        }

        .carousel-dots {
          position: absolute;
          bottom: 1.25rem;
          left: 160px;
          display: flex;
          gap: 0.5rem;
        }

        .dot {
          width: 6px;
          height: 3px;
          background: #9ca3af;
          border-radius: 2px;
        }
        .dot.active {
          width: 50px;
          background: #6060d5;
        }

        .welcome-image {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 250px;
          object-fit: cover;
        }

        .payees-card {
          width: 270px;
          height: 230px;
          background: white;
          border-radius: 18px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 1rem;
          color: black;
          flex: 1;
          min-width: 200px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .payees-title {
          font-weight: 600;
          text-align: center;
          font-size: 1rem;
        }

        .payees-list {
          margin-top: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .payee-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .payee-info {
          font-size: 13px;
          line-height: 1.3;
        }

        .view-all {
          text-align: right;
          margin-top: 0.5rem;
          font-size: 13px;
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
        }

        .transactions-section {
          margin-top: 0.75rem;
          color: black;
        }

        .transactions-title {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 0.75rem;
        }

        .transactions-card {
          background: white;
          border-radius: 22px;
          box-shadow: 18px 18px 12px rgba(0, 0, 0, 0.15);
          padding: 1.25rem;
          width: 1000px;
          height: 240px;
          max-width: 100%;
          overflow-y: auto;
        }

        .transaction-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
          gap: 0.75rem;
          flex-wrap: wrap;
          border-bottom: 1px solid #f3f4f6;
          padding-bottom: 0.5rem;
        }

        .transaction-item:last-child {
          border-bottom: none;
        }

        .transaction-date,
        .transaction-account,
        .transaction-amount {
          font-size: 0.95rem;
        }

        .transaction-status {
          background: #d5f1cb;
          padding: 0.25rem 1.5rem;
          border-radius: 4px;
          color: black;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        @media (max-width: 1024px) {
          .welcome-card {
            width: 100%;
          }
          .transactions-card {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .dashboard {
            flex-direction: column;
            gap: 0;
          }

          .content {
            padding: 1rem;
          }

          .page-title {
            font-size: 22px;
          }

          .top-section {
            flex-direction: column;
            align-items: stretch;
          }

          .welcome-card {
            height: 220px;
          }
          .balance-card {
            width: calc(100% - 2rem);
            left: 1rem;
            top: 50px;
            height: 100px;
          }
          .balance-label {
            font-size: 18px;
          }
          .balance-amount {
            font-size: 18px;
          }
          .welcome-image {
            height: 160px;
          }
          .carousel-dots {
            left: 1.5rem;
            bottom: 0.75rem;
          }

          .payees-card {
            width: 100%;
            height: auto;
            min-height: 200px;
          }

          .transactions-card {
            padding: 1rem;
          }

          .transaction-item {
            flex-wrap: wrap;
            gap: 0.5rem;
            border-bottom: 1px solid #f0f0f0;
            padding-bottom: 0.75rem;
          }
          .transaction-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }
          .transaction-status {
            padding: 0.15rem 1rem;
            font-size: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .header-actions {
            gap: 0.75rem;
          }
          .avatar {
            width: 35px;
            height: 35px;
          }
          .page-title {
            font-size: 20px;
          }
          .balance-label {
            font-size: 16px;
          }
          .balance-amount {
            font-size: 16px;
          }
          .welcome-card {
            height: 200px;
          }
          .welcome-image {
            height: 130px;
          }
          .transaction-date,
          .transaction-account,
          .transaction-amount {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </main>
  )
}
