import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Calendar, 
  ShieldCheck, 
  Droplet, 
  UserCheck, 
  Filter, 
  RefreshCw 
} from 'lucide-react';
import { UserProfile } from '../types';
import { BANGLADESH_LOCATIONS, BLOOD_GROUPS, BloodGroup, DIVISIONS } from '../data/bangladeshData';
import { donorService } from '../lib/supabase';
import { formatDonationDate } from '../lib/dateUtils';
import { SearchableDropdown } from '../components/SearchableDropdown';

interface SearchPageProps {
  initialBloodGroup?: BloodGroup;
  currentUser: UserProfile | null;
  onRequireLogin: () => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialBloodGroup,
  currentUser,
  onRequireLogin
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>(initialBloodGroup || 'All');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedUpazila, setSelectedUpazila] = useState<string>('All');

  const [donors, setDonors] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic Upazila list based on selected District
  const activeDistrictData = BANGLADESH_LOCATIONS.find((d) => d.district === selectedDistrict);
  const upazilaList = activeDistrictData ? activeDistrictData.upazilas : [];

  // District options with live search across all 64 districts
  const districtOptions = [
    { label: 'All Districts (সকল ৬৪ জেলা)', value: 'All', sublabel: 'Search across all 64 districts in Bangladesh' },
    ...BANGLADESH_LOCATIONS.map((loc) => ({
      label: loc.district,
      value: loc.district,
      sublabel: `${loc.division} Division`
    }))
  ];

  // Upazila options with search
  const upazilaOptions = [
    { label: selectedDistrict === 'All' ? 'All Upazilas (সকল এলাকা)' : `All Upazilas in ${selectedDistrict}`, value: 'All' },
    ...upazilaList.map((up) => ({
      label: up,
      value: up
    }))
  ];

  const handleDistrictChange = (val: string) => {
    setSelectedDistrict(val || 'All');
    setSelectedUpazila('All');
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Calls donorService.searchEligibleDonors which enforces the CRITICAL 3-month eligibility filter!
      const results = await donorService.searchEligibleDonors({
        blood_group: selectedGroup,
        district: selectedDistrict,
        upazila: selectedUpazila
      });
      setDonors(results);
      setHasSearched(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to search donors. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Run search on initial mount or when initialBloodGroup changes
  useEffect(() => {
    handleSearch();
  }, [initialBloodGroup]);

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#E31828] text-white flex items-center justify-center">
            <Search className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B18] tracking-tight">
            Find Eligible Blood Donors
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#6B5E4F]">
          Search medically eligible donors in Bangladesh ready for direct contact.
        </p>
      </div>

      {/* Critical Eligibility Guarantee Banner */}
      <div className="p-3.5 rounded-2xl bg-[#FFFDE7] border border-[#F1E4B8] flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs">
          <strong className="text-[#1E1B18] font-bold block">
            3-Month Eligibility Filter Active (৩ মাসের ব্যবধান বাধ্যতামূলক)
          </strong>
          <span className="text-[#5C5248]">
            According to medical guidelines, whole blood donors must rest at least 3 months between donations. Donors who donated within the last 90 days are automatically excluded from these results.
          </span>
        </div>
      </div>

      {/* Search Filters Card */}
      <form
        onSubmit={handleSearch}
        className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between pb-2 border-b border-[#F1E4B8]">
          <span className="text-xs font-bold text-[#1E1B18] flex items-center gap-1.5 uppercase tracking-wide">
            <Filter className="w-3.5 h-3.5 text-[#E31828]" />
            Search Filters (ফিল্টার)
          </span>
          <button
            type="button"
            onClick={() => {
              setSelectedGroup('All');
              setSelectedDistrict('All');
              setSelectedUpazila('All');
              setTimeout(() => handleSearch(), 50);
            }}
            className="text-[11px] font-semibold text-[#E31828] hover:text-[#A80012] cursor-pointer"
          >
            Reset Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Blood Group Filter */}
          <div>
            <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
              Blood Group
            </label>
            <div className="relative">
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] font-semibold focus:outline-none focus:border-[#E31828]"
              >
                <option value="All">All Blood Groups (সকল গ্রুপ)</option>
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>
                    {bg}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Searchable District Filter */}
          <div>
            <SearchableDropdown
              label="District (জেলা) — Searchable"
              placeholder="Search & select district..."
              value={selectedDistrict === 'All' ? '' : selectedDistrict}
              options={districtOptions}
              onChange={handleDistrictChange}
              hint="Search any of all 64 districts"
            />
          </div>

          {/* Searchable Upazila Filter */}
          <div>
            <SearchableDropdown
              label="Upazila / Area (উপজেলা/থানা)"
              placeholder={selectedDistrict === 'All' ? 'Select district first' : 'Search upazila/thana...'}
              value={selectedUpazila === 'All' ? '' : selectedUpazila}
              options={upazilaOptions}
              onChange={(val) => setSelectedUpazila(val || 'All')}
              disabled={selectedDistrict === 'All'}
              hint={selectedDistrict === 'All' ? 'Choose district first' : `Upazilas of ${selectedDistrict}`}
            />
          </div>
        </div>

        {/* Search Action Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 rounded-xl bg-[#E31828] hover:bg-[#A80012] text-white text-xs sm:text-sm font-bold shadow-xs shadow-[#E31828]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Filtering Eligible Donors...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Search Eligible Donors (খুঁজুন)</span>
            </>
          )}
        </button>
      </form>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#1E1B18]">
          Matching Eligible Donors ({donors.length})
        </h2>
        <span className="text-xs text-[#6B5E4F]">
          Showing ready & verified profiles
        </span>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="p-4 rounded-xl bg-[#FEECEE] border border-[#E31828]/30 text-[#A80012] text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="p-12 text-center bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl">
          <div className="w-9 h-9 mx-auto border-3 border-[#E31828] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm font-semibold text-[#1E1B18]">Applying 3-Month Eligibility Check...</p>
          <p className="text-xs text-[#6B5E4F] mt-1">Filtering donors across Bangladesh</p>
        </div>
      ) : donors.length === 0 ? (
        /* Empty state */
        <div className="p-10 text-center bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl space-y-2">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF4D4] flex items-center justify-center text-[#A80012]">
            <Droplet className="w-6 h-6 stroke-[2]" />
          </div>
          <h3 className="text-base font-bold text-[#1E1B18]">No Registered Donors Found</h3>
          <p className="text-xs text-[#6B5E4F] max-w-sm mx-auto">
            No registered donors matched this filter. Only genuine registered donors appear here once they sign up. You can also create a blood request using the Post button.
          </p>
        </div>
      ) : (
        /* Donor Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {donors.map((donor) => {
            const cleanPhone = donor.phone.replace(/[^0-9+]/g, '');
            const cleanSecondary = (donor.secondary_phone || donor.phone).replace(/[^0-9]/g, '');
            const waLink = `https://wa.me/${cleanSecondary}`;

            return (
              <div
                key={donor.id}
                className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start gap-3.5">
                    {/* Donor Avatar */}
                    {donor.avatar_url ? (
                      <img
                        src={donor.avatar_url}
                        alt={donor.full_name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border border-[#F1E4B8] shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E31828] to-[#FF4D5E] text-white font-extrabold flex items-center justify-center text-lg shadow-xs shrink-0">
                        {donor.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Donor Header Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-[#1E1B18] truncate">
                            {donor.full_name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-[#6B5E4F] mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#E31828] shrink-0" />
                            <span className="truncate">{donor.upazila}, {donor.district}</span>
                          </div>
                        </div>

                        {/* Blood Group Badge */}
                        <div className="w-10 h-10 rounded-xl bg-[#E31828] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs shadow-[#E31828]/20">
                          {donor.blood_group}
                        </div>
                      </div>

                      {/* Eligibility & Availability tags */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          <UserCheck className="w-3 h-3" />
                          Eligible to Donate (উপযুক্ত)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Last Donation Date */}
                  <div className="mt-3 pt-2.5 border-t border-[#F1E4B8]/60 flex items-center gap-2 text-xs text-[#5C5248]">
                    <Calendar className="w-3.5 h-3.5 text-[#8C7D6B] shrink-0" />
                    <span>
                      Last donation: <strong className="text-[#1E1B18]">{formatDonationDate(donor.last_donation_date)}</strong>
                    </span>
                  </div>
                </div>

                {/* Direct Contact Actions: Call & WhatsApp / Imo */}
                <div className="mt-4 pt-3 border-t border-[#F1E4B8]/70 flex items-center gap-2">
                  <a
                    href={`tel:${cleanPhone}`}
                    aria-label={`Call ${donor.full_name}`}
                    className="flex-1 h-9.5 px-3 rounded-xl bg-[#E31828] hover:bg-[#A80012] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Phone</span>
                  </a>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp or Imo message to ${donor.full_name}`}
                    className="flex-1 h-9.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp / Imo</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
