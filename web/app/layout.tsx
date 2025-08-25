'use client';

import './globals.css'
import { AuthProvider } from '../components/auth-provider'
import { SidebarProvider } from '../lib/sidebar-context.tsx'
import Navigation from '../components/Navigation'
import { useAuth } from '../lib/auth.tsx'
import { useSidebar } from '../lib/sidebar-context.tsx'

// Metadata moved to root layout or page components

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { isSidebarCollapsed } = useSidebar();
  
  const getMainClassName = () => {
    if (!user) return "pt-16";
    return `pt-16 transition-all duration-300 ${isSidebarCollapsed ? 'pl-16' : 'pl-64'}`;
  };
  
  return (
    <>
      <Navigation />
      
      <main className={getMainClassName()}>
        {children}
      </main>
    </>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <SidebarProvider>
            <LayoutContent>
              {children}
            </LayoutContent>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

