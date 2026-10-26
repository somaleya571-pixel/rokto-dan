import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Building2, 
  Calendar, 
  Phone, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Droplet,
  Activity,
  Edit3
} from 'lucide-react';
import { BloodRequest, UrgencyLevel } from '../types';
import { BANGLADESH_LOCATIONS, BLOOD_GROUPS, BloodGroup, getMedicalFacilities } from '../data/bangladeshData';
import { SearchableDropdown } from './SearchableDropdown';
import { normalizeBangladeshPhone, extractNationalDigits } from '../lib/phoneUtils';
import { bloodRequestService } from '../lib/supabase';

interface EditPostModalProps {
  request: BloodRequest;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (updatedRequest: BloodRequest) => void;
}

export const EditPostModal: React.FC<EditPostModalProps> = ({
  request,
  isOpen,
  onClose,
  onSaved
}) => {
  const [patientName, setPatientName] = useState(request.patient_name);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(request.blood_group);
  const [district, setDistrict] = useState(request.district);
  const [upazila, setUpazila] = useState(request.upazila);
  const [hospitalName, setHospitalName] = useState(request.hospital_name);
  const [requiredDate, setRequiredDate] = useState(request.required_date);
  const [urgency, setUrgency] = useState<UrgencyLevel>(request.urgency);
  const [unitsNeeded, setUnitsNeeded] = useState<number>(request.units_needed || 1);
  const [contactPhone, setContactPhone] = useState(
    extractNationalDigits(request.contact_phone)
  );
  const [additionalNotes, setAdditionalNotes] = useState(request.additional_notes || '');
  const [status, setStatus] = useState<'Open' | 'Fulfilled' | 'Cancelled'>(request.status || 'Open');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state if initial request prop changes
  useEffect(() => {
    setPatientName(request.patient_name);
    setBloodGroup(request.blood_group);
    setDistrict(request.district);
    setUpazila(request.upazila);
    setHospitalName(request.hospital_name);
    setRequiredDate(request.required_date);
    setUrgency(request.urgency);
    setUnitsNeeded(request.units_needed || 1);
    setContactPhone(extractNationalDigits(request.contact_phone));
    setAdditionalNotes(request.additional_notes || '');
    setStatus(request.status || 'Open');
    setErrorMsg(null);
  }, [request, isOpen]);

  if (!isOpen) return null;

  // District options
  const districtOptions = BANGLADESH_LOCATIONS.map((loc) => ({
    label: loc.district,
    value: loc.district,
    sublabel: `${loc.division} Division`
  }));

  // Dynamic Upazila list
  const currentDistrictData = BANGLADESH_LOCATIONS.find((d) => d.district === district);
  const upazilaChoices = currentDistrictData ? currentDistrictData.upazilas : [];
  const upazilaOptions = [
    ...upazilaChoices.map((u) => ({
      label: u,
      value: u
    }))
  ];

  // Medical facilities options
  const rawFacilities = getMedicalFacilities(district, upazila);
  const medicalFacilityOptions = rawFacilities.map((h) => {
    let sub = 'Medical Facility';
    if (h.includes('Medical College')) sub = 'Medical College Hospital';
    else if (h.includes('Sadar') || h.includes('General')) sub = 'District Sadar Hospital';
    else if (h.includes('Health Complex')) sub = 'Upazila Health Complex';
    return {
      label: h,
      value: h,
      sublabel: sub
    };
  });

  const handleDistrictChange = (newDist: string) => {
    setDistrict(newDist);
    const found = BANGLADESH_LOCATIONS.find((d) => d.district === newDist);
    if (found && found.upazilas.length > 0) {
      setUpazila(found.upazilas[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!patientName.trim()) {
      setErrorMsg('Please provide the patient name.');
      return;
    }
    if (!hospitalName.trim()) {
      setErrorMsg('Please select or enter the hospital / clinic name.');
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMsg('Please enter a valid attendant contact phone number.');
      return;
    }

    const normalizedContact = normalizeBangladeshPhone(contactPhone);
    if (!normalizedContact) {
      setErrorMsg('Please enter a valid 11-digit Bangladesh phone number (e.g. 01712345678).');
      return;
    }

    setIsSubmitting(true);
    try {
      const updated = await bloodRequestService.updateRequest(request.id, {
        patient_name: patientName.trim(),
        blood_group: bloodGroup,
        district,
        upazila,
        hospital_name: hospitalName.trim(),
        required_date: requiredDate,
        urgency,
        units_needed: unitsNeeded,
        contact_phone: normalizedContact,
        additional_notes: additionalNotes.trim() || undefined,
        status
      });

      onSaved(updated);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update blood request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1E1B18]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-3xl w-full max-w-xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="edit-post-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#F1E4B8] bg-[#FFFDE7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E31828] text-white flex items-center justify-center shadow-xs">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="edit-post-title" className="text-base sm:text-lg font-bold text-[#1E1B18] tracking-tight">
                Edit Blood Request (আবেদন সম্পাদনা)
              </h2>
              <p className="text-xs text-[#6B5E4F]">
                Modify requirements, hospital location, or request status
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FFF4D4] hover:bg-[#F1E4B8] text-[#1E1B18] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Post Status Selector */}
          <div className="p-3 bg-[#FEF9E7] border border-[#F1E4B8] rounded-2xl space-y-1.5">
            <label className="block text-xs font-bold text-[#1E1B18]">
              Request Status (আবেদনের বর্তমান অবস্থা)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Open', 'Fulfilled', 'Cancelled'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    status === st
                      ? st === 'Open'
                        ? 'bg-[#E31828] text-white border-[#E31828]'
                        : st === 'Fulfilled'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-gray-600 text-white border-gray-600'
                      : 'bg-white text-[#6B5E4F] border-[#F1E4B8] hover:bg-[#FFF4D4]'
                  }`}
                >
                  {st === 'Open' ? '🔴 Open (প্রয়োজন)' : st === 'Fulfilled' ? '✅ Fulfilled (সংগৃহীত)' : '⚪ Cancelled'}
                </button>
              ))}
            </div>
          </div>

          {/* Blood Group Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#1E1B18]">
              Required Blood Group (রক্তের গ্রুপ) <span className="text-[#E31828]">*</span>
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {BLOOD_GROUPS.map((bg) => (
                <button
                  key={bg}
                  type="button"
                  onClick={() => setBloodGroup(bg)}
                  className={`py-2 text-xs font-black rounded-xl border transition-all ${
                    bloodGroup === bg
                      ? 'bg-[#E31828] text-white border-[#E31828] shadow-xs'
                      : 'bg-white hover:bg-[#FEF9E7] text-[#1E1B18] border-[#F1E4B8]'
                  }`}
                >
                  {bg}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Name & Units Needed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="block text-xs font-bold text-[#1E1B18]">
                Patient Name / Info (রোগীর নাম) <span className="text-[#E31828]">*</span>
              </label>
              <input
                type="text"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="e.g., Rahima Begum (Surgery patient)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E4B8] bg-white text-xs text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#E31828]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1E1B18]">
                Bags/Units (ব্যাগ)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={unitsNeeded}
                onChange={(e) => setUnitsNeeded(parseInt(e.target.value) || 1)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E4B8] bg-white text-xs text-[#1E1B18] font-bold focus:outline-none focus:ring-2 focus:ring-[#E31828]"
              />
            </div>
          </div>

          {/* Location: District and Upazila */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <SearchableDropdown
              label="District (জেলা)"
              placeholder="Search 64 districts..."
              options={districtOptions}
              value={district}
              onChange={handleDistrictChange}
            />

            <SearchableDropdown
              label="Upazila / Area (উপজেলা / থানা)"
              placeholder="Search upazila..."
              options={upazilaOptions}
              value={upazila}
              onChange={(val) => setUpazila(val)}
            />
          </div>

          {/* Medical Facility / Hospital */}
          <SearchableDropdown
            label="Hospital / Medical Facility (হাসপাতালের নাম)"
            placeholder="Search hospitals, medical colleges & health complexes..."
            options={medicalFacilityOptions}
            value={hospitalName}
            onChange={(val) => setHospitalName(val)}
          />

          {/* Required Date & Urgency Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1E1B18]">
                Needed Date (রক্তের তারিখ) <span className="text-[#E31828]">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E4B8] bg-white text-xs text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#E31828]"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1E1B18]">
                Urgency Level (জরুরিতা) <span className="text-[#E31828]">*</span>
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#F1E4B8] bg-white text-xs text-[#1E1B18] font-semibold focus:outline-none focus:ring-2 focus:ring-[#E31828]"
              >
                <option value="Emergency">🚨 জরুরি (Emergency / Immediate)</option>
                <option value="Within 24 Hours">⏳ Within 24 Hours (আজকের মধ্যে)</option>
                <option value="Planned">📅 Planned / Scheduled (পরিকল্পিত)</option>
              </select>
            </div>
          </div>

          {/* Attendant Contact Number with Bangladesh Badge */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#1E1B18]">
              Attendant Phone Number (যোগাযোগের নম্বর) <span className="text-[#E31828]">*</span>
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3 flex items-center gap-1.5 pointer-events-none text-xs font-bold text-[#1E1B18] pr-2 border-r border-[#F1E4B8]">
                <span className="text-base leading-none">🇧🇩</span>
                <span>+880</span>
              </div>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="1712345678"
                maxLength={11}
                className="w-full pl-24 pr-3.5 py-2.5 rounded-xl border border-[#F1E4B8] bg-white text-xs text-[#1E1B18] font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-[#E31828]"
                required
              />
            </div>
            <p className="text-[11px] text-[#6B5E4F]">
              Direct contact number for blood donors to reach the patient&apos;s attendant.
            </p>
          </div>

          {/* Additional Notes */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#1E1B18]">
              Additional Notes (অন্যান্য বিবরণ)
            </label>
            <textarea
              rows={2}
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="e.g. Bed no: 402, ICU Ward. Cross-match report already completed."
              className="w-full px-3.5 py-2 rounded-xl border border-[#F1E4B8] bg-white text-xs text-[#1E1B18] focus:outline-none focus:ring-2 focus:ring-[#E31828]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#F1E4B8]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-[#F1E4B8] bg-white hover:bg-[#FFF4D4] text-[#1E1B18] text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#E31828] hover:bg-[#A80012] text-white text-xs font-bold shadow-xs shadow-[#E31828]/30 transition-all flex items-center gap-1.5 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes (সংরক্ষণ করুন)</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
