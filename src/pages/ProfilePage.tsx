import React, { useState, useRef } from 'react';
import { 
  User, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Calendar, 
  Camera, 
  Save, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Droplet,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { BANGLADESH_LOCATIONS, BLOOD_GROUPS, BloodGroup, DIVISIONS } from '../data/bangladeshData';
import { donorService } from '../lib/supabase';
import { processAndCompressImage } from '../lib/imageUtils';
import { isDonorEligible, getDaysUntilEligible, formatDonationDate } from '../lib/dateUtils';
import { SearchableDropdown } from '../components/SearchableDropdown';
import { normalizeBangladeshPhone, extractNationalDigits, formatDisplayPhone } from '../lib/phoneUtils';

interface ProfilePageProps {
  currentUser: UserProfile;
  onProfileUpdated: (updated: UserProfile) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onProfileUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form edit states
  const [fullName, setFullName] = useState(currentUser.full_name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [secondaryPhone, setSecondaryPhone] = useState(currentUser.secondary_phone || currentUser.phone);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(currentUser.blood_group);
  const [district, setDistrict] = useState(currentUser.district);
  const [upazila, setUpazila] = useState(currentUser.upazila);
  const [lastDonationDate, setLastDonationDate] = useState(currentUser.last_donation_date || '');
  const [isAvailable, setIsAvailable] = useState(currentUser.is_available);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentUser.avatar_url || null);

  // Status feedback
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImg, setIsUploadingImg] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dynamic Upazila choices
  const currentDistrictData = BANGLADESH_LOCATIONS.find((d) => d.district === district);
  const upazilaChoices = currentDistrictData ? currentDistrictData.upazilas : [];

  const districtOptions = BANGLADESH_LOCATIONS.map((loc) => ({
    label: loc.district,
    value: loc.district,
    sublabel: `${loc.division} Division`
  }));

  const handleDistrictChange = (dist: string) => {
    setDistrict(dist);
    const found = BANGLADESH_LOCATIONS.find((d) => d.district === dist);
    if (found && found.upazilas.length > 0) {
      setUpazila(found.upazilas[0]);
    }
  };

  // Eligibility evaluation
  const eligible = isDonorEligible(currentUser.last_donation_date);
  const daysRemaining = getDaysUntilEligible(currentUser.last_donation_date);

  // Image Upload handler supporting ANY file size without restrictions
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImg(true);
      setErrorMsg(null);
      // Process and smoothly compress image to support any phone camera resolution/size
      const compressedDataUrl = await processAndCompressImage(file, 900, 0.85);
      setAvatarUrl(compressedDataUrl);

      // Save directly to user profile in Supabase/database
      const updated: UserProfile = {
        ...currentUser,
        avatar_url: compressedDataUrl
      };
      await donorService.updateProfile(updated);
      onProfileUpdated(updated);
      setSuccessMsg('Profile photo updated successfully!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setErrorMsg('Failed to process uploaded image. Please try again.');
    } finally {
      setIsUploadingImg(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const normalizedPhone = normalizeBangladeshPhone(phone);
      const normalizedSecondary = normalizeBangladeshPhone(secondaryPhone || phone);

      if (!normalizedPhone) {
        setErrorMsg('Please enter a valid Bangladesh mobile number.');
        setIsSaving(false);
        return;
      }

      const updated: UserProfile = {
        ...currentUser,
        full_name: fullName.trim(),
        phone: normalizedPhone,
        secondary_phone: normalizedSecondary || normalizedPhone,
        blood_group: bloodGroup,
        district,
        upazila,
        last_donation_date: lastDonationDate || null,
        is_available: isAvailable,
        avatar_url: avatarUrl
      };

      await donorService.updateProfile(updated);
      onProfileUpdated(updated);
      setIsEditing(false);
      setSuccessMsg('Profile successfully updated!');

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#E31828', '#F1E4B8']
      });

      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save profile changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle availability instantly
  const handleQuickAvailabilityToggle = async () => {
    const newStatus = !currentUser.is_available;
    setIsAvailable(newStatus);
    const updated = { ...currentUser, is_available: newStatus };
    await donorService.updateProfile(updated);
    onProfileUpdated(updated);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B18] tracking-tight">
            Donor Profile
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5E4F]">
            Manage your personal donation details, contacts, and availability.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-3.5 py-2 rounded-xl bg-[#FFFDF5] border border-[#F1E4B8] hover:border-[#E31828] text-xs font-bold text-[#1E1B18] hover:text-[#E31828] shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Feedback Banners */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-[#FEECEE] border border-[#E31828]/30 text-[#A80012] text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Profile Showcase Card */}
      <div className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-3xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar with Camera upload button */}
          <div className="relative group shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={currentUser.full_name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-[#F1E4B8] shadow-sm"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-[#E31828] to-[#FF4D5E] text-white font-black flex items-center justify-center text-3xl shadow-sm">
                {currentUser.full_name.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Hidden File Input supporting ANY file size */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageFileChange}
              className="hidden"
            />

            {/* Camera Upload Overlay Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImg}
              aria-label="Upload profile photo"
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-[#E31828] hover:bg-[#A80012] text-white flex items-center justify-center shadow-md transition-transform active:scale-90 cursor-pointer"
            >
              {isUploadingImg ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Profile Details */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[#1E1B18] tracking-tight">
                  {currentUser.full_name}
                </h2>
                <p className="text-xs text-[#6B5E4F]">{currentUser.email}</p>
              </div>

              {/* Blood Group Display */}
              <div className="inline-flex items-center justify-center self-center sm:self-auto px-4 py-1.5 rounded-xl bg-[#E31828] text-white font-black text-lg shadow-xs shadow-[#E31828]/25">
                {currentUser.blood_group}
              </div>
            </div>

            {/* District & Location */}
            <div className="mt-2 flex items-center justify-center sm:justify-start gap-1.5 text-xs text-[#5C5248]">
              <MapPin className="w-4 h-4 text-[#E31828] shrink-0" />
              <span>{currentUser.upazila}, {currentUser.district}</span>
            </div>

            {/* Availability Toggle */}
            <div className="mt-4 pt-3 border-t border-[#F1E4B8]/60 flex flex-wrap items-center justify-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#1E1B18]">
                  Donation Availability:
                </span>
                <button
                  type="button"
                  onClick={handleQuickAvailabilityToggle}
                  className="flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                >
                  {currentUser.is_available ? (
                    <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1">
                      <ToggleRight className="w-4 h-4 text-emerald-600" />
                      Available (প্রস্তুত)
                    </span>
                  ) : (
                    <span className="text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                      <ToggleLeft className="w-4 h-4 text-amber-600" />
                      Unavailable (বিরতিতে)
                    </span>
                  )}
                </button>
              </div>

              {/* Eligibility Indicator */}
              <div className="text-xs font-medium">
                {eligible ? (
                  <span className="text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Eligible to donate now
                  </span>
                ) : (
                  <span className="text-[#A80012] flex items-center gap-1 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-[#E31828]" />
                    Eligible in {daysRemaining} days (3-month rule)
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form (View or Edit Mode) */}
      <div className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-3xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#1E1B18] mb-4 pb-2 border-b border-[#F1E4B8]">
          {isEditing ? 'Edit Profile Information' : 'Contact & Donation Record'}
        </h3>

        {isEditing ? (
          /* Edit Profile Form */
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] focus:outline-none focus:border-[#E31828]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-3 py-2.5 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] font-bold focus:outline-none focus:border-[#E31828]"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Personal Phone & WhatsApp Number with Bangladesh code +880 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                  Personal Number (ব্যক্তিগত ফোন নম্বর) *
                </label>
                <div className="flex rounded-xl border border-[#F1E4B8] overflow-hidden bg-[#FFFEEA] focus-within:border-[#E31828] focus-within:ring-2 focus-within:ring-[#E31828]/20 transition-all">
                  <div className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-[#FFF4D4] border-r border-[#F1E4B8] text-xs font-bold text-[#1E1B18] shrink-0 select-none">
                    <span className="text-sm">🇧🇩</span>
                    <span>+880</span>
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="1712-345678"
                    value={extractNationalDigits(phone)}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-transparent text-xs sm:text-sm text-[#1E1B18] font-mono focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-[#6B5E4F] mt-1">Bangladesh country code (+880) included</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                  WhatsApp / Imo Number (হোয়াটসঅ্যাপ নম্বর)
                </label>
                <div className="flex rounded-xl border border-[#F1E4B8] overflow-hidden bg-[#FFFEEA] focus-within:border-[#E31828] focus-within:ring-2 focus-within:ring-[#E31828]/20 transition-all">
                  <div className="inline-flex items-center gap-1.5 px-3 py-2.5 bg-[#E8F8EE] border-r border-emerald-200 text-xs font-bold text-emerald-800 shrink-0 select-none">
                    <span className="text-sm">🇧🇩</span>
                    <span>+880</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="1812-345678"
                    value={extractNationalDigits(secondaryPhone)}
                    onChange={(e) => setSecondaryPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-transparent text-xs sm:text-sm text-[#1E1B18] font-mono focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-[#6B5E4F] mt-1">Direct WhatsApp / Imo messaging number</p>
              </div>
            </div>

            {/* District & Upazila with Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <SearchableDropdown
                  label="District (জেলা) — Searchable"
                  placeholder="Search & select district..."
                  value={district}
                  options={districtOptions}
                  onChange={handleDistrictChange}
                  hint="Search any of all 64 districts"
                />
              </div>

              <div>
                <SearchableDropdown
                  label="Upazila / Area (উপজেলা/থানা)"
                  placeholder="Select upazila/thana..."
                  value={upazila}
                  options={upazilaChoices}
                  onChange={setUpazila}
                  hint={`Upazilas in ${district}`}
                />
              </div>
            </div>

            {/* Last Donation Date */}
            <div>
              <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                Last Blood Donation Date (শেষ রক্তদানের তারিখ)
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#8C7D6B] absolute left-3 top-3" />
                <input
                  type="date"
                  value={lastDonationDate}
                  onChange={(e) => setLastDonationDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] focus:outline-none focus:border-[#E31828]"
                />
              </div>
              <p className="text-[11px] text-[#6B5E4F] mt-1">
                Used to determine your 3-month eligibility to donate blood again.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 rounded-xl border border-[#F1E4B8] text-xs font-bold text-[#6B5E4F] hover:bg-[#FFF4D4] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#E31828] hover:bg-[#A80012] text-white text-xs font-bold shadow-xs shadow-[#E31828]/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-2xl bg-[#FFFEEA] border border-[#F1E4B8]/70">
                <span className="text-xs text-[#6B5E4F] block mb-1">Personal Phone Number</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FFF4D4] text-[#1E1B18] font-bold text-xs border border-[#F1E4B8]">
                    <span>🇧🇩</span> +880
                  </span>
                  <span className="font-bold text-[#1E1B18] font-mono text-sm">
                    {formatDisplayPhone(currentUser.phone).formattedNumber || currentUser.phone}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFEEA] border border-[#F1E4B8]/70">
                <span className="text-xs text-[#6B5E4F] block mb-1">WhatsApp / Imo Number</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E8F8EE] text-emerald-800 font-bold text-xs border border-emerald-200">
                    <span>🇧🇩</span> +880
                  </span>
                  <span className="font-bold text-[#1E1B18] font-mono text-sm">
                    {formatDisplayPhone(currentUser.secondary_phone || currentUser.phone).formattedNumber || (currentUser.secondary_phone || currentUser.phone)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFEEA] border border-[#F1E4B8]/70">
                <span className="text-xs text-[#6B5E4F] block mb-1">District & Upazila</span>
                <span className="font-bold text-[#1E1B18]">
                  {currentUser.upazila}, {currentUser.district}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFEEA] border border-[#F1E4B8]/70">
                <span className="text-xs text-[#6B5E4F] block mb-1">Last Blood Donation Date</span>
                <span className="font-bold text-[#1E1B18]">
                  {formatDonationDate(currentUser.last_donation_date)}
                </span>
              </div>
            </div>

            {/* Eligibility detailed summary box */}
            <div className="mt-4 p-4 rounded-2xl bg-[#FFFDE7] border border-[#F1E4B8] flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <strong className="text-[#1E1B18] font-bold block">
                  Eligibility Status: {eligible ? 'Eligible (উপযুক্ত)' : 'In 3-Month Rest Period'}
                </strong>
                <p className="text-[#5C5248]">
                  {eligible
                    ? 'Your last donation was more than 3 months ago (or this is your first donation). Your profile will appear in search results when patients look for blood donors.'
                    : `You donated blood recently. To safeguard your health and blood volume, you will be eligible again in ${daysRemaining} days.`}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
