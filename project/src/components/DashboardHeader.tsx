import React from 'react'
import { Button } from './Button'
import { supabase } from '../lib/supabase'
import { LogOut, Home, Bell } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { Link } from './Link'

export function DashboardHeader() {
  const isHomePage = window.location.pathname === '/'

  return (
    <header className="bg-white/70 dark:bg-dark-paper/70 backdrop-blur-md shadow-sm border-b border-gray-100/50 dark:border-gray-800/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            {!isHomePage && (
              <Link 
                href="/" 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-all p-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 rounded-full hover:scale-105"
              >
                <Home className="w-5 h-5" />
              </Link>
            )}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-tight">
              Guest Management
            </h1>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">Manage and track your guest list</p>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button className="text-gray-500 hover:text-gray-700 transition-all p-2 hover:bg-gray-100/80 rounded-full relative hover:scale-105">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <Button
            onClick={() => supabase.auth.signOut()}
            variant="secondary"
            className="flex items-center gap-2 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all hover:scale-105 font-medium"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </div>
    </header>
  )
}