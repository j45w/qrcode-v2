import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean
  variant?: 'primary' | 'secondary'
}

export function Button({ 
  children, 
  className = '', 
  fullWidth = false,
  variant = 'primary',
  ...props 
}: ButtonProps) {
  const baseStyles = 'relative flex justify-center py-2 px-4 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors'
  const variantStyles = {
    primary: 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600',
    secondary: 'border-gray-300 text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-paper hover:bg-gray-50 dark:hover:bg-dark-light'
  }
  
  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}