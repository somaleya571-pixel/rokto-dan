import React, { useState, useEffect } from 'react';
import { 
  PlusCircle, 
  Send, 
  Building2, 
  Calendar, 
  Phone, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  MessageSquare,
  Droplet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BloodRequest, DonorResponse, UrgencyLevel, UserProfile } from '../types';
import { BANGLADESH_LOCATIONS, BLOOD_GROUPS, BloodGroup, getMedicalFacilities } from '../data/bangladeshData';
import { bloodRequestService } from '../lib/supabase';
import { formatRelativeTime } from '../lib/dateUtils';
import { ResponderModal } from '../components/ResponderModal';
import { SearchableDropdown } from '../components/SearchableDropdown';
import { normalizeBangladeshPhone, extractNationalDigits } from '../lib/phoneUtils';

interface PostPageProps {
  currentUser: UserProfile | null;
  onRequireLogin: () => void;
  onNavigateHome: () => void;
}

export const PostPage: React.FC<PostPageProps> = ({
  currentUser,
  onRequireLogin,
  onNavigateHome
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'my-posts'>('create');

  // Form Fields
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('A+');
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [district, setDistrict] = useState(currentUser?.district || BANGLADESH_LOCATIONS[0].district);
  const [upazila, setUpazila] = useState(currentUser?.upazila || BANGLADESH_LOCATIONS[0].upazilas[0]);
  const [requiredDate, setRequiredDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [urgency, setUrgency] = useState<UrgencyLevel>('Emergency');
  const [unitsNeeded, setUnitsNeeded] = useState<number>(1);
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // My Posts & Responders Management
  const [myRequests, setMyRequests] = useState<BloodRequest[]>([]);
  const [selectedPostForModal, setSelectedPostForModal] = useState<BloodRequest | null>(null);
  const [activeModalResponders, setActiveModalResponders] = useState<DonorResponse[]>([]);
  const [postResponderCounts, setPostResponderCounts] = useState<Record<string, number>>({});

  // Dynamic Upazila choices
  const currentDistrictData = BANGLADESH_LOCATIONS.find((d) => d.district === district);
  const upazilaChoices = currentDistrictData ? currentDistrictData.upazilas : [];

  // District options with search & division metadata
  const districtOptions = BANGLADESH_LOCATIONS.map((loc) => ({
    label: loc.district,
    value: loc.district,
    sublabel: `${loc.division} Division`
  }));

  // Medical Facilities options with category sublabels for real-time search
  const rawFacilities = getMedicalFacilities(district, upazila);
  const medicalFacilityOptions = rawFacilities.map((h) => {
    let sub = 'Medical Facility';
    if (h.includes('Medical College')) {
      sub = 'Medical College Hospital';
    } else if (h.includes('Sadar') || h.includes('District Hospital') || h.includes('General Hospital') || h.includes('Bed')) {
      sub = 'District Sadar Hospital';
    } else if (h.includes('Health Complex')) {
      sub = 'Upazila Health Complex';
    } else if (h.includes('BSMMU') || h.includes('NICVD') || h.includes('Institute') || h.includes('Evercare') || h.includes('Square') || h.includes('United')) {
      sub = 'Specialized Tertiary Hospital';
    }
    return {
      label: h,
      value: h,
      sublabel: sub
    };
  });

  const handleDistrictChange = (dist: string) => {
    setDistrict(dist);
    const found = BANGLADESH_LOCATIONS.find((d) => d.district === dist);
    if (found && found.upazilas.length > 0) {
      setUpazila(found.upazilas[0]);
    }
  };

  // Load user's own requests
  const loadMyPosts = async () => {
    if (!currentUser) return;
    const all = await bloodRequestService.getRecentRequests();
    const mine = all.filter((r) => r.user_id === currentUser.id);
    setMyRequests(mine);

    // Load responder counts for each post
    const counts: Record<string, number> = {};
    for (const post of mine) {
      const res = await bloodRequestService.getResponsesForRequest(post.id, currentUser.id);
      counts[post.id] = res.count;
    }
    setPostResponderCounts(counts);
  };

  useEffect(() => {
    loadMyPosts();
  }, [currentUser, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (!patientName.trim() || !hospitalName.trim() || !contactPhone.trim()) {
      setErrorMsg('Please fill in all mandatory fields (Patient name, Hospital, and Contact Phone).');
      return;
    }

    const normalizedContact = normalizeBangladeshPhone(contactPhone);
    if (!normalizedContact) {
      setErrorMsg('Please enter a valid Bangladesh mobile number for the attendant.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const newPost = await bloodRequestService.createRequest({
        user_id: currentUser.id,
        creator_name: currentUser.full_name,
        creator_phone: currentUser.phone,
        patient_name: patientName.trim(),
        blood_group: bloodGroup,
        hospital_name: hospitalName.trim(),
        district,
        upazila,
        required_date: requiredDate,
        urgency,
        units_needed: unitsNeeded,
        contact_phone: normalizedContact,
        additional_notes: additionalNotes.trim() || undefined
      });

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#E31828', '#A80012', '#F1E4B8']
      });

      setSuccessMsg('Blood request successfully published to the live network! Eligible donors will now be notified.');
      
      // Reset form
      setPatientName('');
      setHospitalName('');
      setAdditionalNotes('');
      
      // Refresh my posts
      loadMyPosts();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit blood request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenResponders = async (post: BloodRequest) => {
    const { responses } = await bloodRequestService.getResponsesForRequest(post.id, currentUser?.id);
    setActiveModalResponders(responses);
    setSelectedPostForModal(post);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Page Title */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[#E31828] text-white flex items-center justify-center">
            <PlusCircle className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E1B18] tracking-tight">
            Blood Request & Donors
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#6B5E4F]">
          Publish an urgent blood requirement and privately manage interested donors.
        </p>
      </div>

      {/* Tabs: Create Request vs My Requests & Responders */}
      <div className="grid grid-cols-2 p-1 bg-[#FFF4D4] rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
            activeTab === 'create'
              ? 'bg-white text-[#E31828] shadow-xs'
              : 'text-[#6B5E4F] hover:text-[#1E1B18]'
          }`}
        >
          Create Request (নতুন আবেদন)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('my-posts')}
          className={`py-2 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'my-posts'
              ? 'bg-white text-[#E31828] shadow-xs'
              : 'text-[#6B5E4F] hover:text-[#1E1B18]'
          }`}
        >
          <span>My Requests ({myRequests.length})</span>
          {myRequests.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-[#E31828]" />
          )}
        </button>
      </div>

      {activeTab === 'create' ? (
        /* Create Blood Request Form */
        <form
          onSubmit={handleSubmit}
          className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl p-5 sm:p-6 shadow-xs space-y-4"
        >
          {/* Success Banner */}
          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-medium flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Request Created Successfully!</strong>
                <span>{successMsg}</span>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('my-posts')}
                    className="text-xs font-bold text-emerald-800 underline underline-offset-2 hover:text-emerald-950 cursor-pointer"
                  >
                    View in &quot;My Requests&quot; tab →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-[#FEECEE] border border-[#E31828]/30 text-[#A80012] text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Blood Group & Units */}
          <div>
            <label className="block text-xs font-bold text-[#1E1B18] mb-1.5">
              Required Blood Group (প্রয়োজনীয় রক্তের গ্রুপ) *
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setBloodGroup(bg)}
                  className={`py-2 text-xs font-black rounded-xl border transition-all cursor-pointer ${
                    bloodGroup === bg
                      ? 'bg-[#E31828] text-white border-[#E31828] shadow-xs'
                      : 'bg-[#FEF9E7] border-[#F1E4B8] text-[#1E1B18] hover:bg-[#FFF4D4]'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Units Needed & Urgency Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                Units / Bags Needed *
              </label>
              <select
                value={unitsNeeded}
                onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] font-bold focus:outline-none focus:border-[#E31828]"
              >
                <option value={1}>1 Bag (১ ব্যাগ)</option>
                <option value={2}>2 Bags (২ ব্যাগ)</option>
                <option value={3}>3 Bags (৩ ব্যাগ)</option>
                <option value={4}>4 Bags (৪ ব্যাগ)</option>
                <option value={5}>5+ Bags (জরুরি মাল্টিপল)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                Urgency Level (জরুরিতা) *
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Emergency', 'Within 24 Hours', 'Planned'] as UrgencyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setUrgency(lvl)}
                    className={`py-2 px-1 text-[11px] font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      urgency === lvl
                        ? lvl === 'Emergency'
                          ? 'bg-[#A80012] text-white border-[#A80012]'
                          : lvl === 'Within 24 Hours'
                          ? 'bg-[#D97706] text-white border-[#D97706]'
                          : 'bg-[#4B5563] text-white border-[#4B5563]'
                        : 'bg-[#FEF9E7] border-[#F1E4B8] text-[#1E1B18] hover:bg-[#FFF4D4]'
                    }`}
                  >
                    {lvl === 'Emergency' ? 'Emergency' : lvl === 'Within 24 Hours' ? '24 Hours' : 'Planned'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div>
            <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
              Patient Name / Details *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sultana Begum (ICU Patient, Post-op)"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] focus:outline-none focus:border-[#E31828]"
            />
          </div>

          {/* Three Required Dropdowns: District with Search, Dynamic Upazila, and Medical Facilities */}
          <div className="space-y-3.5 pt-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Dropdown 1: District with search (all 64 districts) */}
              <SearchableDropdown
                label="1. District (জেলা) — Searchable"
                required={true}
                placeholder="Search & select district..."
                value={district}
                options={districtOptions}
                onChange={handleDistrictChange}
                hint="Type to search any of all 64 districts in Bangladesh"
              />

              {/* Dropdown 2: Upazila that updates based on the district */}
              <SearchableDropdown
                label="2. Upazila / Area (উপজেলা/থানা)"
                required={true}
                placeholder="Select upazila/thana..."
                value={upazila}
                options={upazilaChoices}
                onChange={setUpazila}
                hint={`Showing upazilas for ${district} district`}
              />
            </div>

            {/* Dropdown 3: Medical facilities dropdown (Colleges, District Hospitals, Health Complexes) */}
            <SearchableDropdown
              label="3. Medical Facility / Hospital (হাসপাতাল / স্বাস্থ্য কমপ্লেক্স)"
              required={true}
              placeholder="Choose hospital, medical college, or health complex..."
              value={hospitalName}
              options={medicalFacilityOptions}
              onChange={setHospitalName}
              allowCustom={true}
              icon={<Building2 className="w-4 h-4 text-[#E31828]" />}
              hint="Includes Medical Colleges, 250 Bed District Sadar Hospitals, and Upazila Health Complexes (or type custom name)"
            />
          </div>

          {/* Required Date & Contact Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                Required Blood Date *
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#8C7D6B] absolute left-3 top-3" />
                <input
                  type="date"
                  required
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] focus:outline-none focus:border-[#E31828]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
                Attendant Contact Phone (যোগাযোগ নম্বর) *
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
                  value={extractNationalDigits(contactPhone)}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-transparent text-xs sm:text-sm text-[#1E1B18] font-mono focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-[#6B5E4F] mt-1">Bangladesh country code (+880) included</p>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#1E1B18] mb-1">
              Additional Medical Notes (ঐচ্ছিক বিবরণ)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Ward number, cabin, condition, or specific instructions for donors."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              className="w-full px-3 py-2 bg-[#FFFEEA] border border-[#F1E4B8] rounded-xl text-xs sm:text-sm text-[#1E1B18] focus:outline-none focus:border-[#E31828]"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-[#E31828] hover:bg-[#A80012] text-white text-xs sm:text-sm font-bold shadow-xs shadow-[#E31828]/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {isSubmitting ? (
              <span>Publishing Blood Request...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Blood Request (আবেদন প্রকাশ করুন)</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* My Requests & Interested Responders Management */
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-[#FFFDE7] border border-[#F1E4B8] flex items-start gap-2.5 text-xs text-[#5C5248]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Private Responder View:</strong> Below are your published blood requests. When donors click <em>&quot;I Want to Donate&quot;</em>, their details appear exclusively to you. Other users cannot see who applied.
            </span>
          </div>

          {myRequests.length === 0 ? (
            <div className="p-10 text-center bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF4D4] flex items-center justify-center text-[#A80012]">
                <Droplet className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-base font-bold text-[#1E1B18]">No requests published yet</h3>
              <p className="text-xs text-[#6B5E4F] max-w-sm mx-auto">
                Use the &quot;Create Request&quot; tab to post an urgent blood requirement for any patient.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className="mt-3 px-4 py-2 rounded-xl bg-[#E31828] text-white text-xs font-bold hover:bg-[#A80012] transition-colors inline-block"
              >
                Create Your First Request
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {myRequests.map((post) => {
                const count = postResponderCounts[post.id] || 0;
                return (
                  <div
                    key={post.id}
                    className="p-4 sm:p-5 rounded-2xl bg-[#FFFDF5] border border-[#F1E4B8] shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#E31828] text-white font-black flex items-center justify-center text-lg shrink-0">
                          {post.blood_group}
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-[#1E1B18]">
                            Patient: {post.patient_name}
                          </h3>
                          <div className="text-xs text-[#6B5E4F] mt-0.5">
                            {post.hospital_name} · {post.upazila}, {post.district}
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-[#A80012] text-white shrink-0">
                        {post.urgency}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#F1E4B8]/60 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-[#1E1B18]">
                        <Users className="w-4 h-4 text-[#E31828]" />
                        <span>
                          <strong>{count}</strong> {count === 1 ? 'donor offered to donate' : 'donors offered to donate'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenResponders(post)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#E31828] hover:bg-[#A80012] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <span>View Donors ({count})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal for viewing responders to creator's post */}
      {selectedPostForModal && (
        <ResponderModal
          request={selectedPostForModal}
          responses={activeModalResponders}
          onClose={() => setSelectedPostForModal(null)}
        />
      )}
    </div>
  );
};
