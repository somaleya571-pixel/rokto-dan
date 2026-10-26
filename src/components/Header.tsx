import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, LogOut, LogIn, Droplet } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  currentUser: UserProfile | null;
  onLogout: () => void;
  onNavigateLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onLogout,
  onNavigateLogin
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-[#FEF9E7]/95 backdrop-blur-md border-b border-[#F1E4B8] shadow-xs">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand identity: Logo, Name, Bengali Slogan */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E31828] to-[#A80012] flex items-center justify-center text-white shadow-sm shadow-[#E31828]/25">
            <Droplet className="w-6 h-6 fill-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg md:text-xl text-[#1E1B18] tracking-tight">
                রক্তদান
              </span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-[#E31828]/10 text-[#E31828]">
                Roktodan
              </span>
            </div>
            <span className="text-xs text-[#6B5E4F] font-medium hidden sm:inline">
              রক্ত দিন, জীবন বাঁচান • Save Lives Across Bangladesh
            </span>
          </div>
        </div>

        {/* Three-Dot Menu - strictly ONLY authentication action (Login or Logout) */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Account Options Menu"
            aria-expanded={menuOpen}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#5C5248] hover:text-[#1E1B18] hover:bg-[#FFF4D4] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E31828]"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Dropdown Menu - EXACTLY ONE AUTHENTICATION ACTION */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#FFFDF5] border border-[#F1E4B8] rounded-xl shadow-lg py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              {currentUser ? (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#A80012] hover:bg-[#FEECEE] flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-[#E31828]" />
                  <span>Logout (লগআউট)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onNavigateLogin();
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-[#1E1B18] hover:bg-[#FFF4D4] flex items-center gap-2.5 transition-colors"
                >
                  <LogIn className="w-4 h-4 text-[#E31828]" />
                  <span>Login (লগইন)</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
