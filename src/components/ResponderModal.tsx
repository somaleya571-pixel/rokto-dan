import React from 'react';
import { X, Phone, MessageSquare, ShieldCheck, MapPin, Droplet, Clock } from 'lucide-react';
import { DonorResponse, BloodRequest } from '../types';
import { formatRelativeTime } from '../lib/dateUtils';
import { formatDisplayPhone } from '../lib/phoneUtils';

interface ResponderModalProps {
  request: BloodRequest;
  responses: DonorResponse[];
  onClose: () => void;
}

export const ResponderModal: React.FC<ResponderModalProps> = ({
  request,
  responses,
  onClose
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="responder-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#F1E4B8] flex items-center justify-between bg-[#FFFDE7]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E31828]" />
              <h2 id="responder-modal-title" className="text-base font-bold text-[#1E1B18]">
                Interested Donors ({responses.length})
              </h2>
            </div>
            <p className="text-xs text-[#6B5E4F] mt-0.5">
              Patient: <span className="font-semibold text-[#1E1B18]">{request.patient_name}</span> ({request.blood_group})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B5E4F] hover:text-[#1E1B18] hover:bg-[#F4E8BD] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Rule Notice */}
        <div className="px-5 py-2.5 bg-[#FEF9E7] border-b border-[#F1E4B8] flex items-center gap-2 text-xs text-[#5C5248]">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong className="text-[#1E1B18]">Creator-Only Privacy:</strong> You can see these responders because you created this post. These details are private and hidden from other users.
          </span>
        </div>

        {/* Donor List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5 divide-y divide-[#F1E4B8]/60">
          {responses.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FFF4D4] flex items-center justify-center text-[#A80012] mb-3">
                <Droplet className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-sm font-semibold text-[#1E1B18]">No donors have responded yet</h3>
              <p className="text-xs text-[#6B5E4F] mt-1 max-w-xs mx-auto">
                When someone clicks &quot;I Want to Donate&quot; on your post, their contact details will immediately appear here.
              </p>
            </div>
          ) : (
            responses.map((resp) => {
              const cleanPhone = resp.donor_phone.replace(/[^0-9+]/g, '');
              const cleanSecondary = (resp.donor_secondary_contact || resp.donor_phone).replace(/[^0-9]/g, '');
              const waLink = `https://wa.me/${cleanSecondary}`;

              return (
                <div key={resp.id} className="pt-3.5 first:pt-0">
                  <div className="flex items-start gap-3.5">
                    {/* Donor Avatar */}
                    {resp.donor_avatar ? (
                      <img
                        src={resp.donor_avatar}
                        alt={resp.donor_name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border border-[#F1E4B8] shadow-xs shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E31828] to-[#FF4D5E] text-white font-bold flex items-center justify-center text-base shadow-xs shrink-0">
                        {resp.donor_name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    {/* Donor Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-bold text-[#1E1B18] truncate">
                          {resp.donor_name}
                        </h4>
                        <span className="px-2 py-0.5 rounded bg-[#E31828]/10 text-[#E31828] font-bold text-xs shrink-0">
                          {resp.donor_blood_group}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-[#6B5E4F] mt-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-[#E31828]" />
                        <span className="truncate">{resp.donor_upazila}, {resp.donor_district}</span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-[#8C7D6B] mt-0.5">
                        <Clock className="w-3 h-3 shrink-0" />
                        <span>Responded {formatRelativeTime(resp.created_at)}</span>
                      </div>

                      {/* Phone Numbers display */}
                      <div className="mt-2 space-y-1 text-xs text-[#1E1B18]">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="text-[#6B5E4F] text-[11px]">Primary:</span>
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-[#FFF4D4] text-[#1E1B18] text-[10px] font-bold border border-[#F1E4B8]">
                            🇧🇩 +880
                          </span>
                          <span>{formatDisplayPhone(resp.donor_phone).formattedNumber || resp.donor_phone}</span>
                        </div>
                        {resp.donor_secondary_contact && (
                          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#5C5248]">
                            <span className="text-[#6B5E4F]">WhatsApp:</span>
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-[#E8F8EE] text-emerald-800 text-[10px] font-bold border border-emerald-200">
                              🇧🇩 +880
                            </span>
                            <span>{formatDisplayPhone(resp.donor_secondary_contact).formattedNumber || resp.donor_secondary_contact}</span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons: Call & WhatsApp / Imo */}
                      <div className="mt-3 flex items-center gap-2">
                        <a
                          href={`tel:${cleanPhone}`}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#E31828] hover:bg-[#A80012] text-white text-xs font-semibold shadow-xs transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call Donor</span>
                        </a>

                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold shadow-xs transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp / Imo</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#F1E4B8] bg-[#FFFDE7] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#E6D8A7] hover:bg-[#D4C38E] text-[#1E1B18] text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
