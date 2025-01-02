import React, { useState } from 'react'
import { Input } from './Input'
import { Button } from './Button'
import { X, ArrowRight } from 'lucide-react'

interface ManualCodeCheckProps {
  onSubmit: (code: string) => Promise<void>
  onClose: () => void
}

export function ManualCodeCheck({ onSubmit, onClose }: ManualCodeCheckProps) {
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit(code)
    setIsSubmitting(false)
    setCode('')
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
        <Input
          label=""
          placeholder="Enter 4-digit code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={4}
          className="relative text-center text-3xl tracking-[0.5em] font-mono bg-gray-50 dark:bg-dark-light h-16 border-2 focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          autoFocus
        />
        </div>
        <Button 
          type="submit" 
          fullWidth 
          disabled={isSubmitting || code.length !== 4}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 h-12 text-lg transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          <span className="flex items-center gap-2">
          {isSubmitting ? 'Checking...' : 'Verify Code'}
          {!isSubmitting && <ArrowRight className="w-5 h-5" />}
          </span>
        </Button>
      </form>
    </div>
  )
}