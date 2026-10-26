import React, { useState, useEffect } from 'react';
import { PageRoute, UserProfile } from './types';
import { BloodGroup } from './data/bangladeshData';
import { authService } from './lib/supabase';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { PostPage } from './pages/PostPage';
import { ProfilePage } from './pages/ProfilePage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentPage, setCurrentPage] = useState<PageRoute>('login');
  const [initialSearchGroup, setInitialSearchGroup] = useState<BloodGroup | undefined>(undefined);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check saved session on mount
  useEffect(() => {
    async function initSession() {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setCurrentPage('home');
        } else {
          setCurrentUser(null);
          setCurrentPage('login');
        }
      } catch (err) {
        console.error('Session init error:', err);
        setCurrentPage('login');
      } finally {
        setIsInitializing(false);
      }
    }
    initSession();
  }, []);

  const handleLoginSuccess = (user: UserProfile) => {
    setCurrentUser(user);
    setCurrentPage('home');
  };

  const handleLogout = async () => {
    await authService.signOut();
    setCurrentUser(null);
    setCurrentPage('login');
  };

  const handleNavigate = (page: PageRoute, group?: BloodGroup) => {
    // Protected pages: if not logged in, redirect to login
    if (!currentUser && page !== 'login') {
      setCurrentPage('login');
      return;
    }

    if (group) {
      setInitialSearchGroup(group);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileUpdated = (updated: UserProfile) => {
    setCurrentUser(updated);
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#FEF9E7] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#E31828] border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-xs font-semibold text-[#1E1B18] tracking-tight">
          রক্তদান নেটওয়ার্ক লোড হচ্ছে...
        </span>
      </div>
    );
  }

  // Logged-out view shows the Login page first
  if (!currentUser || currentPage === 'login') {
    return (
      <div className="min-h-screen bg-[#FEF9E7] text-[#1E1B18] font-sans flex flex-col">
        {/* Header with three-dot menu having strictly Login action */}
        <Header
          currentUser={null}
          onLogout={handleLogout}
          onNavigateLogin={() => setCurrentPage('login')}
        />

        <main className="flex-1 flex flex-col">
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        </main>
      </div>
    );
  }

  // Authenticated application views
  return (
    <div className="min-h-screen bg-[#FEF9E7] text-[#1E1B18] font-sans flex flex-col">
      {/* Top Header with Brand and Three-Dot Menu (Logout ONLY) */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onNavigateLogin={() => setCurrentPage('login')}
      />

      {/* Main Page Canvas with Light Plasma Theme & max-w-4xl desktop ergonomics */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 pt-4 sm:pt-6">
        {currentPage === 'home' && (
          <HomePage
            currentUser={currentUser}
            onNavigate={handleNavigate}
            onRequireLogin={() => setCurrentPage('login')}
          />
        )}

        {currentPage === 'search' && (
          <SearchPage
            initialBloodGroup={initialSearchGroup}
            currentUser={currentUser}
            onRequireLogin={() => setCurrentPage('login')}
          />
        )}

        {currentPage === 'post' && (
          <PostPage
            currentUser={currentUser}
            onRequireLogin={() => setCurrentPage('login')}
            onNavigateHome={() => setCurrentPage('home')}
          />
        )}

        {currentPage === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            onProfileUpdated={handleProfileUpdated}
          />
        )}
      </main>

      {/* Persistent 4-Item Bottom Navigation Bar */}
      <BottomNav
        currentPage={currentPage}
        onNavigate={(page) => handleNavigate(page)}
      />
    </div>
  );
}
