import React, { useState } from 'react'
import { AuthLayout } from '../components/AuthLayout'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { supabase } from '../lib/supabase'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check your email"
        subtitle="We've sent you a password reset link"
      >
        <div className="mt-8 space-y-6">
          <p className="text-center text-sm text-gray-600">
            We've sent a password reset link to <strong>{email}</strong>.
            Please check your email and follow the instructions to reset your password.
          </p>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => window.location.href = '/signin'}
          >
            Return to sign in
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email to receive a reset link"
    >
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm space-y-4">
          <Input
            label="Email address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Sending reset link...' : 'Send reset link'}
        </Button>

        <div className="text-center">
          <span className="text-sm text-gray-600">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => window.location.href = '/signin'}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </button>
          </span>
        </div>
      </form>
    </AuthLayout>
  )
}