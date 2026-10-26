import React, { useState } from 'react';
import { Droplet, Mail, Lock, User, Phone, MapPin, Calendar, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { authService } from '../lib/supabase';
import { UserProfile } from '../types';
import { BANGLADESH_LOCATIONS, BLOOD_GROUPS, BloodGroup, DIVISIONS } from '../data/bangladeshData';
import { SearchableDropdown } from '../components/SearchableDropdown';
import { normalizeBangladeshPhone, extractNationalDigits } from '../lib/phoneUtils';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regBloodGroup, setRegBloodGroup] = useState<BloodGroup>('A+');
  const [regPhone, setRegPhone] = useState('');
  const [regSecondaryPhone, setRegSecondaryPhone] = useState('');
  const [regDistrict, setRegDistrict] = useState(BANGLADESH_LOCATIONS[0].district);
  const [regUpazila, setRegUpazila] = useState(BANGLADESH_LOCATIONS[0].upazilas[0]);
  const [regLastDonation, setRegLastDonation] = useState('');
  const [regAvailable, setRegAvailable] = useState(true);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Update upazilas when district changes
  const activeDistrictData = BANGLADESH_LOCATIONS.find((d) => d.district === regDistrict);
  const upazilaOptions = activeDistrictData ? activeDistrictData.upazilas : [];

  const districtOptions = BANGLADESH_LOCATIONS.map((loc) => ({
    label: loc.district,
    value: loc.district,
    sublabel: `${loc.division} Division`
  }));

  const handleDistrictChange = (district: string) => {
    setRegDistrict(district);
    const found = BANGLADESH_LOCATIONS.find((d) => d.district === district);
    if (found && found.upazilas.length > 0) {
      setRegUpazila(found.upazilas[0]);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const { user, error } = await authService.signIn(loginEmail, loginPassword || 'password123');
      if (error) {
        setErrorMsg(error);
      } else if (user) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regPhone.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, Phone).');
      return;
    }

    const normalizedPhone = normalizeBangladeshPhone(regPhone);
    const normalizedSecondary = normalizeBangladeshPhone(regSecondaryPhone || regPhone);

    if (!normalizedPhone) {
      setErrorMsg('Please enter a valid Bangladesh mobile number.');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const { user, error } = await authService.signUp({
        email: regEmail,
        password: regPassword || 'password123',
        full_name: regFullName,
        phone: normalizedPhone,
        secondary_phone: normalizedSecondary || normalizedPhone,
        blood_group: regBloodGroup,
        district: regDistrict,
        upazila: regUpazila,
        last_donation_date: regLastDonation || null,
        is_available: regAvailable
      });

      if (error) {
        setErrorMsg(error);
      } else if (user) {
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#FEF9E7] flex flex-col justify-center py-10 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        {/* App Branding */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-[#E31828] to-[#A80012] flex items-center justify-center text-white shadow-md shadow-[#E31828]/30 mb-3">
            <Droplet className="w-9 h-9 fill-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B18] tracking-tight">
            রক্তদান <span className="text-[#E31828]">Roktodan</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5E4F] mt-1 font-medium">
            রক্ত দিন, জীবন বাঁচান • Save Lives Across Bangladesh
          </p>
        </div>

        {/* Auth Card Container */}
        <div className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl p-6 shadow-sm">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-[#FFF4D4] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setTab('login');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-white text-[#E31828] shadow-xs'
                  : 'text-[#6B5E4F] hover:text-[#1E1B18]'
              }`}
            >
              Login (প্রবেশ)
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('register');
                setErrorMsg(null);
              }}
              className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-white text-[#E31828] shadow-xs'
                  : 'text-[#6B5E4F] hover:text-[#1E1B18]'
              }`}
            >
              Register (নিবন্ধন)
            </button>
          </div>

          {/* Error Message banner */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-[#FEECEE] border border-[#E31828]/30 text-[#A80012] text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C7D6B] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rafiqul@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] placeholder-[#9C8E7E] focus:outline-none focus:border-[#E31828] focus:ring-1 focus:ring-[#E31828]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C7D6B] absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] placeholder-[#9C8E7E] focus:outline-none focus:border-[#E31828] focus:ring-1 focus:ring-[#E31828]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#E31828] hover:bg-[#A80012] text-white text-xs sm:text-sm font-bold shadow-xs shadow-[#E31828]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Login to Roktodan</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>


            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8C7D6B] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanzil Ahmed"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] focus:outline-none focus:border-[#E31828]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@email.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] focus:outline-none focus:border-[#E31828]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    placeholder="Min. 6 chars"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] focus:outline-none focus:border-[#E31828]"
                  />
                </div>
              </div>

              {/* Blood Group Selector */}
              <div>
                <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                  Blood Group *
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {BLOOD_GROUPS.map((bg) => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setRegBloodGroup(bg)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        regBloodGroup === bg
                          ? 'bg-[#E31828] text-white border-[#E31828]'
                          : 'bg-[#FEF9E7] border-[#F1E4B8] text-[#1E1B18] hover:bg-[#FFF4D4]'
                      }`}
                    >
                      {bg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Phone & Secondary WhatsApp / Imo with Bangladesh +880 code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                    Primary Phone *
                  </label>
                  <div className="flex rounded-xl border border-[#F1E4B8] overflow-hidden bg-[#FFFEEA] focus-within:border-[#E31828] focus-within:ring-1 focus-within:ring-[#E31828]">
                    <div className="inline-flex items-center gap-1 px-2.5 py-2 bg-[#FFF4D4] border-r border-[#F1E4B8] text-xs font-bold text-[#1E1B18] shrink-0 select-none">
                      <span className="text-xs">🇧🇩</span>
                      <span>+880</span>
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="1712-345678"
                      value={extractNationalDigits(regPhone)}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-2.5 py-2 bg-transparent text-xs sm:text-sm text-[#1E1B18] font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                    WhatsApp / Imo No.
                  </label>
                  <div className="flex rounded-xl border border-[#F1E4B8] overflow-hidden bg-[#FFFEEA] focus-within:border-[#E31828] focus-within:ring-1 focus-within:ring-[#E31828]">
                    <div className="inline-flex items-center gap-1 px-2.5 py-2 bg-[#E8F8EE] border-r border-emerald-200 text-xs font-bold text-emerald-800 shrink-0 select-none">
                      <span className="text-xs">🇧🇩</span>
                      <span>+880</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="1812-345678"
                      value={extractNationalDigits(regSecondaryPhone)}
                      onChange={(e) => setRegSecondaryPhone(e.target.value)}
                      className="w-full px-2.5 py-2 bg-transparent text-xs sm:text-sm text-[#1E1B18] font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* District & Upazila with Search */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <SearchableDropdown
                    label="District (জেলা) — Searchable"
                    placeholder="Search district..."
                    value={regDistrict}
                    options={districtOptions}
                    onChange={handleDistrictChange}
                    hint="Search any of all 64 districts"
                  />
                </div>

                <div>
                  <SearchableDropdown
                    label="Upazila / Area (উপজেলা/থানা)"
                    placeholder="Select upazila..."
                    value={regUpazila}
                    options={upazilaOptions}
                    onChange={setRegUpazila}
                    hint={`Upazilas in ${regDistrict}`}
                  />
                </div>
              </div>

              {/* Last Donation Date */}
              <div>
                <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                  Last Donation Date (Leave empty if never donated)
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-[#8C7D6B] absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={regLastDonation}
                    onChange={(e) => setRegLastDonation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs text-[#1E1B18] focus:outline-none focus:border-[#E31828]"
                  />
                </div>
              </div>

              {/* Availability checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="regAvailable"
                  checked={regAvailable}
                  onChange={(e) => setRegAvailable(e.target.checked)}
                  className="w-4 h-4 text-[#E31828] rounded border-[#F1E4B8] focus:ring-[#E31828]"
                />
                <label htmlFor="regAvailable" className="text-xs font-medium text-[#1E1B18]">
                  Available to donate blood when requested
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-[#E31828] hover:bg-[#A80012] text-white text-xs sm:text-sm font-bold shadow-xs shadow-[#E31828]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 mt-2"
              >
                {isLoading ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <span>Create Donor Profile</span>
                    <Heart className="w-4 h-4 fill-white" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Security and privacy note */}
        <div className="mt-6 text-center text-xs text-[#6B5E4F] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Blood Donor Network of Bangladesh</span>
        </div>
      </div>
    </div>
  );
};
