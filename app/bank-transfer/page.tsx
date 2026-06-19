'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Sidebar from '@/components/sidebar'
import { getCookie } from '@/lib/cookie'

type Errors = Partial<{
  amount: string
  fromAccount: string
  accountNumber: string
  accountName: string
  bank: string
}>

interface Account {
  id: number
  account_number: string
  account_name: string
  balance: string
}

export default function Home() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [fromAccount, setFromAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountName, setAccountName] = useState('')
  const [bank, setBank] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [step, setStep] = useState<'form' | 'confirm' | 'success' | 'failure'>(
    'form'
  )
  const [confirmation, setConfirmation] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const userId = getCookie('user_id') || '1'

  // Fetch sender's accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await fetch(`/api/accounts?userId=${userId}`)
        if (res.ok) {
          const data = await res.json()
          setAccounts(data.accounts || [])
        }
      } catch (err) {
        console.error('Failed to load transfer accounts:', err)
      }
    }
    fetchAccounts()
  }, [userId])

  const selectedSourceAccount = accounts.find(
    (acc) => acc.account_number === fromAccount
  )
  const currentBalance = selectedSourceAccount
    ? parseFloat(selectedSourceAccount.balance)
    : 0

  function validate() {
    const e: Errors = {}
    if (!fromAccount) {
      e.fromAccount = 'Select a source account'
    }

    if (!amount) {
      e.amount = 'Amount is required'
    } else {
      const amtVal = Number(amount)
      if (amtVal <= 0 || isNaN(amtVal)) {
        e.amount = 'Enter a valid positive amount'
      } else if (selectedSourceAccount && amtVal + 50 > currentBalance) {
        e.amount = `Insufficient balance. Required: Rs. ${amtVal + 50} (incl. Rs. 50 fee). Available: Rs. ${currentBalance.toFixed(2)}`
      }
    }

    if (!accountNumber) {
      e.accountNumber = 'Account number is required'
    } else if (!/^\d{6,}$/.test(accountNumber)) {
      e.accountNumber = 'Enter a valid account number'
    } else if (accountNumber === fromAccount) {
      e.accountNumber = 'Cannot transfer to the same account'
    }

    if (!accountName) e.accountName = 'Account name is required'

    if (!bank) e.bank = 'Select a bank'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  function handleNext(e: React.FormEvent) {
    e.preventDefault()
    if (validate()) {
      setStep('confirm')
    }
  }

  async function handleTransfer(e: React.FormEvent) {
    e.preventDefault()
    setErrorMessage('')

    try {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromAccount,
          toAccount: accountNumber,
          amount,
          description,
          userId
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.message || 'Transfer transaction rejected.')
        setStep('failure')
        return
      }

      setConfirmation(
        data.transaction?.id
          ? `TXN-${data.transaction.id}`
          : String(Math.floor(10000000 + Math.random() * 89999999))
      )
      setStep('success')
    } catch (err) {
      setErrorMessage('Network error executing transfer. Please try again.')
      setStep('failure')
    }
  }

  return (
    <div className="min-h-screen bg-bg-light font-geist p-0">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 p-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Bank Transfer</h2>
            <div className="flex items-center gap-3">
              <button className="topbar-icon" aria-label="search">
                <img src="/search.png" alt="search" />
              </button>
              <button className="topbar-icon" aria-label="notifications">
                <img src="/notification.png" alt="notifications" />
              </button>
              <Link
                href="/profile"
                className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 block"
              >
                <img
                  src="/avatar.png"
                  alt="avatar"
                  className="w-full h-full object-cover bg-white"
                />
              </Link>
            </div>
          </div>
          {step === 'form' ? (
            <form onSubmit={handleNext} className="transfer-card p-8">
              <div className="grid grid-cols-12 gap-y-6 gap-x-8 items-center">
                {/* Source Account */}
                <label className="col-span-3 text-gray-700">
                  From Account :
                </label>
                <div className="col-span-9">
                  <select
                    value={fromAccount}
                    onChange={(e) => setFromAccount(e.target.value)}
                    className="underline-input bg-transparent"
                  >
                    <option value="">Choose source account</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.account_number}>
                        {acc.account_name} ({acc.account_number}) - Rs.{' '}
                        {parseFloat(acc.balance).toLocaleString('en-US', {
                          minimumFractionDigits: 2
                        })}
                      </option>
                    ))}
                  </select>
                  {errors.fromAccount && (
                    <div className="text-sm text-red-600 mt-1">
                      {errors.fromAccount}
                    </div>
                  )}
                </div>

                <label className="col-span-3 text-gray-700">Amount :</label>
                <div className="col-span-9">
                  <input
                    aria-label="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="underline-input"
                    placeholder="Enter amount to send"
                  />
                  {errors.amount && (
                    <div className="text-sm text-red-600 mt-1">
                      {errors.amount}
                    </div>
                  )}
                </div>

                <label className="col-span-3 text-gray-700">
                  Account Number :
                </label>
                <div className="col-span-9">
                  <input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="underline-input"
                    placeholder="Enter destination account number"
                  />
                  {errors.accountNumber && (
                    <div className="text-sm text-red-600 mt-1">
                      {errors.accountNumber}
                    </div>
                  )}
                </div>

                <label className="col-span-3 text-gray-700">
                  Account Name :
                </label>
                <div className="col-span-9">
                  <input
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="underline-input"
                    placeholder="Enter account holder name"
                  />
                  {errors.accountName && (
                    <div className="text-sm text-red-600 mt-1">
                      {errors.accountName}
                    </div>
                  )}
                </div>

                <label className="col-span-3 text-gray-700">
                  Select Bank :
                </label>
                <div className="col-span-9">
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    className="underline-input bg-transparent"
                  >
                    <option value="">Choose bank</option>
                    <option>First National</option>
                    <option>Global Trust</option>
                    <option>Union Bank</option>
                  </select>
                  {errors.bank && (
                    <div className="text-sm text-red-600 mt-1">
                      {errors.bank}
                    </div>
                  )}
                </div>

                <label className="col-span-3 text-gray-700">
                  Description :
                </label>
                <div className="col-span-9">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="description-box"
                    placeholder="Enter transaction reference description"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-10">
                <button type="submit" className="next-btn">
                  NEXT
                </button>
              </div>
            </form>
          ) : step === 'confirm' ? (
            <div className="transfer-card p-8">
              <h3 className="text-center text-2xl font-semibold mb-6">
                Confirm Transfer
              </h3>
              <div className="bg-white rounded-lg p-6 shadow-lg max-w-xl mx-auto text-center">
                <p className="mb-4">
                  Confirm your transfer of <strong>Rs. {amount || '0'}</strong>{' '}
                  from account <strong>{fromAccount}</strong> to{' '}
                  <strong>{accountName || 'recipient'}</strong> ({accountNumber}
                  )
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Additional fee of Rs.50 will be charged.
                </p>
                <div className="mb-6">
                  <img
                    src="/transfer-illustration.png"
                    alt="illustration"
                    className="mx-auto"
                  />
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setStep('form')}
                    className="next-btn"
                    aria-label="back"
                  >
                    BACK
                  </button>
                  <button
                    onClick={handleTransfer}
                    className="next-btn transfer-btn"
                  >
                    TRANSFER
                  </button>
                </div>
              </div>
            </div>
          ) : step === 'success' ? (
            <div className="transfer-card p-8">
              <div className="relative">
                <div className="success-check inside-check">
                  <svg
                    viewBox="0 0 120 120"
                    width="100"
                    height="100"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <radialGradient id="g" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="#28a745" />
                        <stop offset="100%" stopColor="#138a3e" />
                      </radialGradient>
                    </defs>
                    <circle cx="60" cy="60" r="50" fill="#dff7e7" />
                    <circle cx="60" cy="60" r="40" fill="#10a654" />
                    <path
                      d="M38 62 L54 78 L82 42"
                      stroke="#fff"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </div>

                <h3 className="text-center text-2xl font-semibold mb-4">
                  Transfer Successful!
                </h3>
                <p className="text-center text-sm text-gray-500 mb-10">
                  Confirmation number : {confirmation}
                </p>

                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setAmount('')
                      setAccountNumber('')
                      setAccountName('')
                      setBank('')
                      setDescription('')
                      setErrors({})
                      setConfirmation(null)
                      setStep('form')
                    }}
                    className="transfer-btn success-btn"
                  >
                    <span className="mr-3">‹</span> BACK TO HOME
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="transfer-card p-8">
              <div className="relative">
                <div className="success-check inside-check">
                  <svg
                    viewBox="0 0 120 120"
                    width="220"
                    height="220"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="60" cy="60" r="50" fill="#ffdede" />
                    <circle cx="60" cy="60" r="40" fill="#ffb6b6" />
                    <path
                      d="M60 30 L93 86 L27 86 Z"
                      fill="#ff4d4f"
                      stroke="#fff"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    />
                    <text
                      x="60"
                      y="78"
                      textAnchor="middle"
                      fontSize="36"
                      fill="#fff"
                      fontWeight="700"
                    >
                      !
                    </text>
                  </svg>
                </div>

                <h3 className="text-center text-2xl font-semibold mb-4">
                  Transaction Failed!
                </h3>
                <p className="text-center text-sm text-gray-500 mb-6">
                  {errorMessage || 'An error occurred processing the transfer.'}
                  <br />
                  {selectedSourceAccount && (
                    <span>
                      Current Balance is: Rs. {currentBalance.toFixed(2)}
                    </span>
                  )}
                </p>

                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setAmount('')
                      setAccountNumber('')
                      setAccountName('')
                      setBank('')
                      setDescription('')
                      setErrors({})
                      setConfirmation(null)
                      setStep('form')
                    }}
                    className="transfer-btn success-btn"
                  >
                    <span className="mr-3">‹</span> BACK TO HOME
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
