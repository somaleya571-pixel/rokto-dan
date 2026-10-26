import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MapPin, 
  Building2, 
  Calendar, 
  Phone, 
  AlertCircle, 
  Users, 
  Lock, 
  CheckCircle2, 
  MessageSquare,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BloodRequest, DonorResponse, UserProfile } from '../types';
import { bloodRequestService } from '../lib/supabase';
import { formatRelativeTime } from '../lib/dateUtils';
import { ResponderModal } from './ResponderModal';
import { EditPostModal } from './EditPostModal';
import { DeletePostModal } from './DeletePostModal';

interface RequestCardProps {
  request: BloodRequest;
  currentUser: UserProfile | null;
  onRequireLogin: () => void;
  onPostUpdated?: (updated: BloodRequest) => void;
  onPostDeleted?: (requestId: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  currentUser,
  onRequireLogin,
  onPostUpdated,
  onPostDeleted
}) => {
  const [currentPost, setCurrentPost] = useState<BloodRequest>(request);
  const [responderCount, setResponderCount] = useState<number>(0);
  const [responders, setResponders] = useState<DonorResponse[]>([]);
  const [canViewDetails, setCanViewDetails] = useState<boolean>(false);
  const [hasResponded, setHasResponded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showResponderModal, setShowResponderModal] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Sync internal state when prop changes
  useEffect(() => {
    setCurrentPost(request);
  }, [request]);

  const isCreator = Boolean(currentUser && currentUser.id === currentPost.user_id);

  // Determine poster's avatar (from request object or dynamic lookup)
  const posterAvatar = 
    currentPost.creator_avatar || 
    bloodRequestService.getPosterAvatar(currentPost.user_id) || 
    (currentUser?.id === currentPost.user_id ? currentUser.avatar_url : null);

  // Fetch responder data and user response status
  useEffect(() => {
    let isMounted = true;
    async function loadStatus() {
      const { count, responses, canViewDetails } = await bloodRequestService.getResponsesForRequest(
        currentPost.id,
        currentUser?.id
      );
      if (isMounted) {
        setResponderCount(count);
        setResponders(responses);
        setCanViewDetails(canViewDetails);
      }

      if (currentUser) {
        const responded = await bloodRequestService.hasUserResponded(currentPost.id, currentUser.id);
        if (isMounted) setHasResponded(responded);
      }
    }
    loadStatus();
    return () => {
      isMounted = false;
    };
  }, [currentPost.id, currentUser]);

  const handleDonateClick = async () => {
    if (!currentUser) {
      onRequireLogin();
      return;
    }

    if (isCreator) {
      setFeedbackMsg('This is your own blood request post.');
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    if (hasResponded) {
      setFeedbackMsg('You have already offered to donate for this patient.');
      setTimeout(() => setFeedbackMsg(null), 3000);
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await bloodRequestService.submitResponse(currentPost.id, currentUser);
      setHasResponded(true);
      setResponderCount((prev) => prev + 1);
      setFeedbackMsg('Thank you! Your donation offer and contact details have been privately sent to the patient.');
      
      // Joyful celebratory confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#E31828', '#A80012', '#F1E4B8', '#FFD700']
      });

      setTimeout(() => setFeedbackMsg(null), 5000);
    } catch (err) {
      setFeedbackMsg('Could not submit response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = (updated: BloodRequest) => {
    setCurrentPost(updated);
    setFeedbackMsg('Blood request successfully updated.');
    setTimeout(() => setFeedbackMsg(null), 4000);
    if (onPostUpdated) onPostUpdated(updated);
  };

  const handleDeleteSuccess = (deletedId: string) => {
    if (onPostDeleted) onPostDeleted(deletedId);
  };

  const urgencyStyles = {
    Emergency: 'bg-[#A80012] text-white',
    'Within 24 Hours': 'bg-[#D97706] text-white',
    Planned: 'bg-[#4B5563] text-white'
  };

  const cleanPhone = currentPost.contact_phone.replace(/[^0-9+]/g, '');

  return (
    <>
      <article className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
        {/* Poster Profile Header & Creator Actions (Edit / Delete) */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[#F1E4B8]/60">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Poster Profile Picture */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-[#FFF4D4] border border-[#F1E4B8] shrink-0 flex items-center justify-center font-bold text-[#E31828] text-xs shadow-xs">
              {posterAvatar ? (
                <img
                  src={posterAvatar}
                  alt={currentPost.creator_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-black">
                  {currentPost.creator_name ? currentPost.creator_name.charAt(0).toUpperCase() : 'U'}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#1E1B18] truncate">
                  {currentPost.creator_name}
                </span>
                {isCreator && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#FFF4D4] text-[#8C6D1F] border border-[#F1E4B8] shrink-0">
                    You
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#6B5E4F] flex items-center gap-1">
                <span>Posted</span>
                <span>·</span>
                <span>{formatRelativeTime(currentPost.created_at)}</span>
              </div>
            </div>
          </div>

          {/* CRITICAL: ONLY Post Creator can see Edit and Delete buttons */}
          {isCreator && (
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-[#FEF9E7] hover:bg-[#FFF4D4] border border-[#F1E4B8] text-xs font-bold text-[#1E1B18] flex items-center gap-1 transition-colors cursor-pointer active:scale-95 shadow-xs"
                title="Edit your post details"
                aria-label="Edit post"
              >
                <Edit2 className="w-3 h-3 text-[#E31828]" />
                <span className="text-[11px]">Edit</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-1 transition-colors cursor-pointer active:scale-95 shadow-xs"
                title="Delete your post"
                aria-label="Delete post"
              >
                <Trash2 className="w-3 h-3 text-[#E31828]" />
                <span className="text-[11px]">Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Post Core Details */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Blood Group Display */}
              <div className="w-13 h-13 rounded-2xl bg-[#E31828] text-white flex flex-col items-center justify-center font-black shadow-xs shadow-[#E31828]/25 shrink-0">
                <span className="text-xl leading-none">{currentPost.blood_group}</span>
                <span className="text-[9px] font-semibold tracking-wider uppercase opacity-90">Blood</span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1E1B18] tracking-tight">
                  {currentPost.patient_name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#6B5E4F] mt-0.5">
                  <span className="font-semibold text-[#1E1B18]">
                    {currentPost.units_needed} {currentPost.units_needed > 1 ? 'Units' : 'Unit'} Needed
                  </span>
                  {currentPost.status && currentPost.status !== 'Open' && (
                    <>
                      <span>·</span>
                      <span className={`font-bold px-1.5 py-0.2 rounded text-[10px] ${
                        currentPost.status === 'Fulfilled' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        {currentPost.status}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Urgency Badge */}
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase shrink-0 ${
                urgencyStyles[currentPost.urgency] || 'bg-[#A80012] text-white'
              }`}
            >
              {currentPost.urgency === 'Emergency' ? 'জরুরি (Emergency)' : currentPost.urgency}
            </span>
          </div>

          {/* Details: Hospital, District/Upazila, Required Date */}
          <div className="mt-3.5 space-y-1.5 text-xs text-[#5C5248]">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#E31828] shrink-0" />
              <span className="font-medium text-[#1E1B18] truncate">{currentPost.hospital_name}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E31828] shrink-0" />
              <span>{currentPost.upazila}, {currentPost.district}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#E31828] shrink-0" />
              <span>Needed Date: <strong className="text-[#1E1B18]">{currentPost.required_date}</strong></span>
            </div>

            {currentPost.additional_notes && (
              <p className="mt-2 text-xs text-[#6B5E4F] bg-[#FEF9E7] p-2.5 rounded-lg border border-[#F1E4B8]/60 line-clamp-2">
                &quot;{currentPost.additional_notes}&quot;
              </p>
            )}
          </div>
        </div>

        {/* Responders Count & Privacy Info */}
        <div className="mt-4 pt-3.5 border-t border-[#F1E4B8]/70">
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-1.5 text-[#1E1B18] font-medium">
              <Users className="w-4 h-4 text-[#E31828]" />
              <span>
                <strong>{responderCount}</strong> {responderCount === 1 ? 'donor has offered' : 'donors have offered'}
              </span>
            </div>

            {/* Privacy indicator: Only post creator can see the details */}
            {isCreator ? (
              <button
                type="button"
                onClick={async () => {
                  const { responses } = await bloodRequestService.getResponsesForRequest(currentPost.id, currentUser?.id);
                  setResponders(responses);
                  setShowResponderModal(true);
                }}
                className="text-xs font-bold text-[#E31828] hover:text-[#A80012] underline underline-offset-2 flex items-center gap-1 cursor-pointer"
              >
                <span>View Responders ({responderCount})</span>
              </button>
            ) : (
              <span className="flex items-center gap-1 text-[11px] text-[#8C7D6B]">
                <Lock className="w-3 h-3" />
                <span>Responders private</span>
              </span>
            )}
          </div>

          {/* Feedback message banner */}
          {feedbackMsg && (
            <div className="mb-3 p-2 rounded-lg bg-[#FEF9E7] border border-[#F1E4B8] text-xs text-[#1E1B18] flex items-center gap-1.5 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 text-[#E31828] shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Action Row: "I Want to Donate" (রক্ত দিতে চাই) + Direct Call */}
          <div className="flex items-center gap-2">
            {/* "I Want to Donate" (রক্ত দিতে চাই) Button */}
            <button
              type="button"
              onClick={handleDonateClick}
              disabled={isSubmitting || hasResponded || currentPost.status === 'Fulfilled'}
              className={`flex-1 h-10 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 ${
                currentPost.status === 'Fulfilled'
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : hasResponded
                  ? 'bg-emerald-600 text-white cursor-default'
                  : isCreator
                  ? 'bg-[#EBD89F] text-[#6B5E4F] cursor-not-allowed'
                  : 'bg-[#E31828] hover:bg-[#A80012] text-white shadow-xs shadow-[#E31828]/30 cursor-pointer'
              }`}
            >
              {currentPost.status === 'Fulfilled' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>রক্ত সংগ্রহ সম্পন্ন (Fulfilled)</span>
                </>
              ) : hasResponded ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>রক্তদানের সম্মতি দিয়েছেন (Applied)</span>
                </>
              ) : isCreator ? (
                <span>আপনার পোস্ট (Your Post)</span>
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-white" />
                  <span>রক্ত দিতে চাই (I Want to Donate)</span>
                </>
              )}
            </button>

            {/* Call patient contact phone */}
            <a
              href={`tel:${cleanPhone}`}
              aria-label={`Call contact number for ${currentPost.patient_name}`}
              className="h-10 px-3.5 rounded-xl border border-[#F1E4B8] bg-[#FFFDE7] hover:bg-[#FFF4D4] text-[#1E1B18] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-[#E31828]" />
              <span className="hidden sm:inline">Call</span>
            </a>
          </div>
        </div>
      </article>

      {/* Responder Modal (Only accessible to creator) */}
      {showResponderModal && isCreator && (
        <ResponderModal
          request={currentPost}
          responses={responders}
          onClose={() => setShowResponderModal(false)}
        />
      )}

      {/* Edit Post Modal (Only accessible to creator) */}
      {isEditModalOpen && isCreator && (
        <EditPostModal
          request={currentPost}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSaved={handleSaveEdit}
        />
      )}

      {/* Delete Post Modal (Only accessible to creator) */}
      {isDeleteModalOpen && isCreator && (
        <DeletePostModal
          request={currentPost}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDeleted={handleDeleteSuccess}
        />
      )}
    </>
  );
};
