import React, { useState } from 'react'
import { Input } from './Input'
import { Button } from './Button'
import { UserPlus } from 'lucide-react'

interface AddGuestFormProps {
  onSubmit: (name: string) => Promise<void>
  onClose: () => void
}

export function AddGuestForm({ onSubmit, onClose }: AddGuestFormProps) {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await onSubmit(name)
    setIsSubmitting(false)
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Guest Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          className="h-12 text-lg bg-gray-50 dark:bg-dark-light"
        />
        <div className="flex gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            className="flex-1 h-12"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="flex-1 h-12"
          >
            <span className="flex items-center justify-center gap-2">
              {isSubmitting ? 'Adding...' : 'Add Guest'}
              {!isSubmitting && <UserPlus className="w-5 h-5" />}
            </span>
          </Button>
        </div>
      </form>
    </div>
  )
}