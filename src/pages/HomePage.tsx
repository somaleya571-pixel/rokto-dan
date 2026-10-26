import React, { useState, useEffect } from 'react';
import { Search, PlusCircle, Droplet, ArrowRight, Activity, Users, ShieldCheck, HeartHandshake } from 'lucide-react';
import { BloodRequest, PageRoute, UserProfile } from '../types';
import { BLOOD_GROUPS, BloodGroup } from '../data/bangladeshData';
import { bloodRequestService } from '../lib/supabase';
import { RequestCard } from '../components/RequestCard';

interface HomePageProps {
  currentUser: UserProfile | null;
  onNavigate: (page: PageRoute, initialSearchGroup?: BloodGroup) => void;
  onRequireLogin: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  currentUser,
  onNavigate,
  onRequireLogin
}) => {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [filterUrgency, setFilterUrgency] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setIsLoading(true);
        const data = await bloodRequestService.getRecentRequests();
        if (isMounted) setRequests(data);
      } catch (err) {
        console.error('Error loading blood requests:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredRequests = requests.filter((r) => {
    if (filterUrgency === 'All') return true;
    return r.urgency === filterUrgency;
  });

  return (
    <div className="space-y-6 pb-20">
      {/* Hero Banner Section */}
      <section className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-3xl overflow-hidden shadow-xs">
        <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
          <img
            src="/src/assets/images/blood_donation_hero_1793015522081.jpg"
            alt="Blood Donation Volunteers"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1B18]/90 via-[#1E1B18]/45 to-transparent flex flex-col justify-end p-5 sm:p-6 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E31828]" />
              <span className="text-xs font-semibold tracking-wider uppercase text-amber-200">
                Bangladesh Voluntary Donor Network
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-balance">
              রক্ত দিন, জীবন বাঁচান
            </h1>
            <p className="text-xs sm:text-sm text-amber-100/90 font-medium max-w-xl mt-1">
              Give blood, save lives. Connect instantly with verified, eligible donors across Bangladesh without middlemen.
            </p>
          </div>
        </div>

        {/* Quick KPI stats strip */}
        <div className="grid grid-cols-3 divide-x divide-[#F1E4B8] bg-[#FFFEEA] border-t border-[#F1E4B8] py-3 text-center text-xs">
          <div>
            <div className="font-bold text-[#E31828] text-base sm:text-lg tabular-nums">90+ Days</div>
            <div className="text-[#6B5E4F] text-[11px]">Strict Eligibility</div>
          </div>
          <div>
            <div className="font-bold text-[#1E1B18] text-base sm:text-lg tabular-nums">14+ Districts</div>
            <div className="text-[#6B5E4F] text-[11px]">Coverage</div>
          </div>
          <div>
            <div className="font-bold text-[#A80012] text-base sm:text-lg tabular-nums">100% Free</div>
            <div className="text-[#6B5E4F] text-[11px]">Voluntary Non-profit</div>
          </div>
        </div>
      </section>

      {/* Primary Navigation Triggers (Shortcuts) */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#6B5E4F]">
          Quick Shortcuts (দ্রুত কার্যক্রম)
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Shortcut 1: Find Eligible Donors */}
          <button
            type="button"
            onClick={() => onNavigate('search')}
            className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#F1E4B8] hover:border-[#E31828]/50 shadow-xs hover:shadow-md transition-all flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#FFF4D4] text-[#E31828] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E1B18] group-hover:text-[#E31828] transition-colors">
                  Find Eligible Donors
                </h3>
                <p className="text-xs text-[#6B5E4F]">
                  Filter verified donors by blood group & district
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#8C7D6B] group-hover:text-[#E31828] group-hover:translate-x-1 transition-all" />
          </button>

          {/* Shortcut 2: Post Blood Request */}
          <button
            type="button"
            onClick={() => onNavigate('post')}
            className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#F1E4B8] hover:border-[#E31828]/50 shadow-xs hover:shadow-md transition-all flex items-center justify-between text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-[#FEECEE] text-[#A80012] flex items-center justify-center group-hover:scale-105 transition-transform">
                <PlusCircle className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#1E1B18] group-hover:text-[#E31828] transition-colors">
                  Request Blood (রক্তের আবেদন)
                </h3>
                <p className="text-xs text-[#6B5E4F]">
                  Post an urgent requirement for a patient
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#8C7D6B] group-hover:text-[#E31828] group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </section>

      {/* Quick Blood Group Search Jump Chips */}
      <section className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold text-[#1E1B18] flex items-center gap-1.5">
            <Droplet className="w-3.5 h-3.5 text-[#E31828] fill-[#E31828]" />
            Search Donors by Blood Group
          </span>
          <span className="text-[11px] text-[#6B5E4F]">Tap to filter</span>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {BLOOD_GROUPS.map((bg) => (
            <button
              key={bg}
              type="button"
              onClick={() => onNavigate('search', bg)}
              className="py-2 rounded-xl bg-[#FEF9E7] hover:bg-[#E31828] border border-[#F1E4B8] hover:border-[#E31828] text-xs font-black text-[#1E1B18] hover:text-white transition-all text-center shadow-xs cursor-pointer group"
            >
              {bg}
            </button>
          ))}
        </div>
      </section>

      {/* Recent Blood Requests Feed */}
      <section className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-[#1E1B18] tracking-tight flex items-center gap-2">
              <span>সাম্প্রতিক রক্তের আবেদন (Recent Requests)</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#E31828]/10 text-[#E31828]">
                {filteredRequests.length}
              </span>
            </h2>
            <p className="text-xs text-[#6B5E4F]">
              Patients currently in need of urgent whole blood or platelets
            </p>
          </div>

          {/* Urgency Filter buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#FFF4D4] rounded-xl self-start">
            {['All', 'Emergency', 'Within 24 Hours'].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setFilterUrgency(u)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  filterUrgency === u
                    ? 'bg-[#E31828] text-white shadow-xs'
                    : 'text-[#6B5E4F] hover:text-[#1E1B18]'
                }`}
              >
                {u === 'All' ? 'All' : u === 'Emergency' ? 'Emergency' : '24h'}
              </button>
            ))}
          </div>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="p-8 text-center bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl">
            <div className="w-8 h-8 mx-auto border-3 border-[#E31828] border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs text-[#6B5E4F]">Loading live blood requests...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl">
            <p className="text-sm font-semibold text-[#1E1B18]">No active blood requests right now.</p>
            <p className="text-xs text-[#6B5E4F] mt-1">If a patient needs urgent blood, click &quot;Request Blood&quot; or the center Post button to publish an immediate requirement.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                currentUser={currentUser}
                onRequireLogin={onRequireLogin}
                onPostUpdated={(updated) => {
                  setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
                }}
                onPostDeleted={(deletedId) => {
                  setRequests((prev) => prev.filter((r) => r.id !== deletedId));
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
