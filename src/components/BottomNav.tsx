import React from 'react';
import { Home, Search, Plus, User } from 'lucide-react';
import { PageRoute } from '../types';

interface BottomNavProps {
  currentPage: PageRoute;
  onNavigate: (page: PageRoute) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF5]/95 backdrop-blur-md border-t border-[#F1E4B8] shadow-[0_-4px_16px_rgba(30,27,24,0.06)]"
    >
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between relative">
        {/* Item 1: Home */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          aria-label="Home page"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all group ${
            currentPage === 'home'
              ? 'text-[#E31828]'
              : 'text-[#6B5E4F] hover:text-[#1E1B18]'
          }`}
        >
          <div className="relative">
            <Home
              className={`w-5 h-5 transition-transform ${
                currentPage === 'home' ? 'scale-110 stroke-[2.5]' : 'group-hover:scale-105'
              }`}
            />
            {currentPage === 'home' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#E31828] rounded-full" />
            )}
          </div>
          <span
            className={`text-[11px] font-medium mt-1 tracking-tight ${
              currentPage === 'home' ? 'font-bold text-[#E31828]' : ''
            }`}
          >
            Home
          </span>
        </button>

        {/* Item 2: Search */}
        <button
          type="button"
          onClick={() => onNavigate('search')}
          aria-label="Search eligible donors"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all group ${
            currentPage === 'search'
              ? 'text-[#E31828]'
              : 'text-[#6B5E4F] hover:text-[#1E1B18]'
          }`}
        >
          <div className="relative">
            <Search
              className={`w-5 h-5 transition-transform ${
                currentPage === 'search' ? 'scale-110 stroke-[2.5]' : 'group-hover:scale-105'
              }`}
            />
            {currentPage === 'search' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#E31828] rounded-full" />
            )}
          </div>
          <span
            className={`text-[11px] font-medium mt-1 tracking-tight ${
              currentPage === 'search' ? 'font-bold text-[#E31828]' : ''
            }`}
          >
            Search
          </span>
        </button>

        {/* Item 3: Prominent Centered "Post" Button Icon (highlighted for blood request creation) */}
        <div className="flex-1 flex justify-center items-center h-full -mt-5">
          <button
            type="button"
            onClick={() => onNavigate('post')}
            aria-label="Post Blood Request"
            className={`w-13 h-13 rounded-full flex flex-col items-center justify-center text-white shadow-lg transition-transform active:scale-95 ${
              currentPage === 'post'
                ? 'bg-gradient-to-tr from-[#A80012] to-[#E31828] ring-4 ring-[#E31828]/25 scale-105'
                : 'bg-gradient-to-tr from-[#E31828] to-[#FF3B4E] hover:from-[#A80012] hover:to-[#E31828] shadow-[#E31828]/35'
            }`}
          >
            <Plus className="w-7 h-7 stroke-[2.8]" />
            <span className="sr-only">Create Blood Request Post</span>
          </button>
        </div>

        {/* Item 4: Profile */}
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          aria-label="User Profile"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all group ${
            currentPage === 'profile'
              ? 'text-[#E31828]'
              : 'text-[#6B5E4F] hover:text-[#1E1B18]'
          }`}
        >
          <div className="relative">
            <User
              className={`w-5 h-5 transition-transform ${
                currentPage === 'profile' ? 'scale-110 stroke-[2.5]' : 'group-hover:scale-105'
              }`}
            />
            {currentPage === 'profile' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#E31828] rounded-full" />
            )}
          </div>
          <span
            className={`text-[11px] font-medium mt-1 tracking-tight ${
              currentPage === 'profile' ? 'font-bold text-[#E31828]' : ''
            }`}
          >
            Profile
          </span>
        </button>
      </div>
    </nav>
  );
};
