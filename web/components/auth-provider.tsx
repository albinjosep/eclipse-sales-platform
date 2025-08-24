'use client'

import { AuthProvider as SupabaseAuthProvider } from '../lib/auth'
import { ReactNode } from 'react'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SupabaseAuthProvider>
      {children}
    </SupabaseAuthProvider>
  )
}