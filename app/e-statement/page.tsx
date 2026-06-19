'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/sidebar'
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
  account_name: string
  balance: string
  full_name: string
}

export default function EStatementPage() {
  const [accountNumber, setAccountNumber] = useState('')
  const [account, setAccount] = useState<Account | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const userId = getCookie('user_id') || '1'

  // Automatically pre-fill the first account on load
  useEffect(() => {
    const loadDefaultAccount = async () => {
      try {
        const res = await fetch(`/api/accounts?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.accounts && data.accounts.length > 0) {
            setAccountNumber(data.accounts[0].account_number)
          }
        }
      } catch (err) {
        console.error(err)
      }
    }
    loadDefaultAccount()
  }, [userId])

  const fetchStatement = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!accountNumber.trim()) return

    setLoading(true)
    setError('')
    setAccount(null)
    setTransactions([])

    try {
      // 1. Fetch user accounts to match name
      const accountsRes = await fetch(`/api/accounts?userId=${userId}`)
      if (accountsRes.ok) {
        const accountsData = await accountsRes.json()
        const matched = (accountsData.accounts || []).find(
          (a: Account) => a.account_number === accountNumber.trim()
        )
        if (matched) {
          setAccount(matched)
        } else {
          // If not owned by active user, look up general info or display as is
          setAccount({
            id: 0,
            account_number: accountNumber,
            account_name: 'External Account',
            balance: '0.00',
            full_name: 'External User'
          })
        }
      }

      // 2. Fetch transactions
      const txnsRes = await fetch(
        `/api/transactions?account=${accountNumber.trim()}`
      )
      if (txnsRes.ok) {
        const txnsData = await txnsRes.json()
        setTransactions(txnsData.transactions || [])
      } else {
        setError('Failed to fetch transactions for this account.')
      }
    } catch (err) {
      setError('An error occurred loading the statement.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch when accountNumber changes automatically (debounced or on blur) or trigger on load
  useEffect(() => {
    if (accountNumber) {
      fetchStatement()
    }
  }, [accountNumber])

  // Calculations
  const closingBalance = account ? parseFloat(account.balance) : 0
  const totalDebits = transactions
    .filter((t) => t.from_account === accountNumber)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  const totalCredits = transactions
    .filter((t) => t.to_account === accountNumber)
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
  const openingBalance = closingBalance + totalDebits - totalCredits

  return (
    <div className="min-h-screen bg-bg-light font-geist p-0">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-12 text-black">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">E-Statement</h2>
            <div className="flex items-center gap-3">
              <button className="topbar-icon" aria-label="search">
                <img src="/search.png" alt="search" />
              </button>
              <button className="topbar-icon" aria-label="notifications">
                <img src="/notification.png" alt="notifications" />
              </button>
              <Link
                href="/profile"
                className="size-12 overflow-hidden rounded-full border-2 border-gray-200 block"
              >
                <img
                  src="/avatar.png"
                  alt="avatar"
                  className="size-full bg-white object-cover"
                />
              </Link>
            </div>
          </div>

          <form
            onSubmit={fetchStatement}
            className="rounded-[32px] bg-white px-10 py-8 text-black shadow-[0_1px_3px_0_rgba(0,0,0,0.30),0_4px_8px_3px_rgba(0,0,0,0.15)]"
          >
            <label
              htmlFor="statement-account-number"
              className="grid items-end gap-6 text-xl md:grid-cols-[auto_1fr]"
            >
              <span>Enter account number:</span>
              <input
                id="statement-account-number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                inputMode="numeric"
                className="min-w-0 border-0 border-b border-black bg-transparent px-2 py-1 text-xl text-black outline-none"
              />
            </label>
          </form>

          {error && (
            <div className="mt-4 text-red-600 font-semibold">{error}</div>
          )}

          <section
            aria-label="Bank statement preview"
            className="mt-6 min-h-[560px] bg-[#e7e7e7] px-7 py-9 text-black rounded-3xl"
          >
            <div className="max-w-full">
              <img
                src="/loginlogo.png"
                alt="Nova Bank"
                className="size-[86px] rounded-full object-cover bg-white"
              />

              <div className="mt-5 text-sm leading-tight">
                <h2 className="font-bold text-lg mb-2">Bank Statement</h2>
                <dl className="grid grid-cols-[150px_1fr] gap-y-1">
                  <dt className="font-semibold">Account Holder:</dt>
                  <dd>{account?.full_name || 'N/A'}</dd>

                  <dt className="font-semibold">Account Nickname:</dt>
                  <dd>{account?.account_name || 'N/A'}</dd>

                  <dt className="font-semibold">Account Number:</dt>
                  <dd>{accountNumber || 'N/A'}</dd>

                  <dt className="font-semibold">Branch:</dt>
                  <dd>Colombo Premier</dd>
                </dl>
              </div>

              <div className="mt-9 text-sm">
                <h3 className="font-bold border-b border-black/20 pb-2 mb-4">
                  Account Summary
                </h3>
                <table className="w-full table-fixed border-collapse text-left">
                  <thead>
                    <tr>
                      <th className="pr-4 font-semibold">Opening Balance</th>
                      <th className="pr-4 font-semibold">Total Credits</th>
                      <th className="pr-4 font-semibold">Total Debits</th>
                      <th className="font-semibold">Closing Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="pt-2">
                        Rs.{' '}
                        {openingBalance.toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        })}
                      </td>
                      <td className="pt-2 text-emerald-600">
                        +Rs.{' '}
                        {totalCredits.toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        })}
                      </td>
                      <td className="pt-2 text-rose-600">
                        -Rs.{' '}
                        {totalDebits.toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        })}
                      </td>
                      <td className="pt-2 font-bold">
                        Rs.{' '}
                        {closingBalance.toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-10 border-t border-black pt-9">
                <h3 className="text-sm font-bold border-b border-black/20 pb-2 mb-4">
                  Transaction Details
                </h3>

                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[760px] table-fixed border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="w-[15%] pb-3 font-semibold">Date</th>
                        <th className="w-[25%] pb-3 font-semibold">
                          Description
                        </th>
                        <th className="w-[20%] pb-3 font-semibold">
                          Reference ID
                        </th>
                        <th className="w-[20%] pb-3 font-semibold text-emerald-600">
                          Credit(+)
                        </th>
                        <th className="w-[20%] pb-3 font-semibold text-rose-600">
                          Debit(-)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-4 text-center text-gray-500"
                          >
                            Loading transactions...
                          </td>
                        </tr>
                      ) : transactions.length > 0 ? (
                        transactions.map((t) => {
                          const isDebit = t.from_account === accountNumber
                          const displayDate = new Date(
                            t.created_at
                          ).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                          return (
                            <tr key={t.id} className="border-b border-black/10">
                              <td className="py-3">{displayDate}</td>
                              <td className="py-3">
                                {t.description || 'Fund Transfer'}
                              </td>
                              <td className="py-3">TXN-{t.id}</td>
                              <td className="py-3 text-emerald-600 font-medium">
                                {!isDebit
                                  ? `Rs. ${parseFloat(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                  : '-'}
                              </td>
                              <td className="py-3 text-rose-600 font-medium">
                                {isDebit
                                  ? `Rs. ${parseFloat(t.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                                  : '-'}
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="py-4 text-center text-gray-500"
                          >
                            No transactions recorded for this account.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
