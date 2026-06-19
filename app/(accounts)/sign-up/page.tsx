'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
// @ts-ignore
import AuthButton from '@/components/authButton'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    accountNumber: '',
    accountName: '',
    branch: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fields = [
    { label: 'Account Number', key: 'accountNumber' },
    { label: 'Account Name', key: 'accountName' },
    { label: 'Branch', key: 'branch' },
    { label: 'Email', key: 'email' },
    { label: 'Password', key: 'password' },
    { label: 'Confirm Password', key: 'confirmPassword' }
  ]

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const { accountNumber, accountName, email, password, confirmPassword } =
      formData

    // Basic Validation
    if (
      !accountNumber ||
      !accountName ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError('All fields are required')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountNumber,
          accountName,
          branch: formData.branch,
          email,
          password
        })
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Registration failed')
        return
      }

      alert('Registration successful! Please log in.')
      router.push('/login')
    } catch (err) {
      setError('Network error, please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto min-h-[700px] w-full max-w-[1100px] rounded-[58px] bg-white px-8 py-9 shadow-[0_1px_3px_0_rgba(0,0,0,0.30),0_4px_8px_3px_rgba(0,0,0,0.15)] lg:min-h-[820px] lg:px-14">
      <form
        onSubmit={handleSignUp}
        className="relative mx-auto w-full max-w-[860px]"
      >
        <img
          src="/loginlogo.png"
          alt="Nova Bank"
          className="absolute left-0 top-0 hidden w-[128px] md:block"
        />

        <h1 className="mb-12 text-center text-[2.6rem] font-bold text-black text-balance">
          SIGN UP
        </h1>

        {error && (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {fields.map((field) => {
            const fieldId = `sign-up-${field.key}`
            const isPassword = field.key.toLowerCase().includes('password')

            return (
              <div
                className="grid items-center gap-4 md:grid-cols-[180px_1fr]"
                key={field.key}
              >
                <label className="text-xl text-black" htmlFor={fieldId}>
                  {field.label} :
                </label>
                <input
                  id={fieldId}
                  type={isPassword ? 'password' : 'text'}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className="h-[64px] rounded-[40px] border-0 bg-[#d9d9d9] px-7 text-lg text-black outline-none"
                />
              </div>
            )
          })}
        </div>

        <div className="mt-8 flex justify-center">
          <button type="submit" disabled={loading}>
            <AuthButton>{loading ? 'SIGNING UP...' : 'SIGN UP'}</AuthButton>
          </button>
        </div>
      </form>
    </section>
  )
}
