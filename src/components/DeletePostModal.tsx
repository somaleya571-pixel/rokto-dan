import React, { useState } from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { BloodRequest } from '../types';
import { bloodRequestService } from '../lib/supabase';

interface DeletePostModalProps {
  request: BloodRequest;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (requestId: string) => void;
}

export const DeletePostModal: React.FC<DeletePostModalProps> = ({
  request,
  isOpen,
  onClose,
  onDeleted
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setErrorMsg(null);
    try {
      await bloodRequestService.deleteRequest(request.id);
      onDeleted(request.id);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete blood request. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1E1B18]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-labelledby="delete-post-title"
        aria-modal="true"
      >
        <div className="p-4 sm:p-5 border-b border-[#F1E4B8] bg-[#FEF2F2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E31828] text-white flex items-center justify-center shadow-xs">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="delete-post-title" className="text-base sm:text-lg font-bold text-[#991B1B] tracking-tight">
                Delete Blood Request
              </h2>
              <p className="text-xs text-[#7F1D1D]">
                Permanently remove this request
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-red-100 text-[#991B1B] flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3.5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#991B1B] text-xs">
              {errorMsg}
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-[#FFFDE7] border border-[#F1E4B8] text-xs space-y-2 text-[#5C5248]">
            <div className="flex items-center gap-2 font-bold text-[#1E1B18]">
              <span className="w-6 h-6 rounded-md bg-[#E31828] text-white text-[11px] font-black flex items-center justify-center">
                {request.blood_group}
              </span>
              <span>Patient: {request.patient_name}</span>
            </div>
            <div className="text-[#6B5E4F] pl-8">
              {request.hospital_name} · {request.upazila}, {request.district}
            </div>
          </div>

          <p className="text-xs text-[#6B5E4F] leading-relaxed">
            Are you sure you want to delete this blood request post? This action is permanent. All donor response offers attached to this post will also be removed.
          </p>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2.5 rounded-xl border border-[#F1E4B8] bg-white hover:bg-[#FFF4D4] text-[#1E1B18] text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-5 py-2.5 rounded-xl bg-[#A80012] hover:bg-[#8A000E] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              {isDeleting ? (
                <span>Deleting...</span>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Yes, Delete Post</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
