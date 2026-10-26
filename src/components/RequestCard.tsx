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
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { BloodRequest, DonorResponse, UserProfile } from '../types';
import { bloodRequestService } from '../lib/supabase';
import { formatRelativeTime } from '../lib/dateUtils';
import { ResponderModal } from './ResponderModal';

interface RequestCardProps {
  request: BloodRequest;
  currentUser: UserProfile | null;
  onRequireLogin: () => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({
  request,
  currentUser,
  onRequireLogin
}) => {
  const [responderCount, setResponderCount] = useState<number>(0);
  const [responders, setResponders] = useState<DonorResponse[]>([]);
  const [canViewDetails, setCanViewDetails] = useState<boolean>(false);
  const [hasResponded, setHasResponded] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const isCreator = Boolean(currentUser && currentUser.id === request.user_id);

  // Fetch responder data and user response status
  useEffect(() => {
    let isMounted = true;
    async function loadStatus() {
      const { count, responses, canViewDetails } = await bloodRequestService.getResponsesForRequest(
        request.id,
        currentUser?.id
      );
      if (isMounted) {
        setResponderCount(count);
        setResponders(responses);
        setCanViewDetails(canViewDetails);
      }

      if (currentUser) {
        const responded = await bloodRequestService.hasUserResponded(request.id, currentUser.id);
        if (isMounted) setHasResponded(responded);
      }
    }
    loadStatus();
    return () => {
      isMounted = false;
    };
  }, [request.id, currentUser]);

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
      const res = await bloodRequestService.submitResponse(request.id, currentUser);
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

  const urgencyStyles = {
    Emergency: 'bg-[#A80012] text-white',
    'Within 24 Hours': 'bg-[#D97706] text-white',
    Planned: 'bg-[#4B5563] text-white'
  };

  const cleanPhone = request.contact_phone.replace(/[^0-9+]/g, '');

  return (
    <>
      <article className="bg-[#FFFDF5] border border-[#F1E4B8] rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
        {/* Top Header: Blood Group Badge + Urgency + Timestamp */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Blood Group Display */}
              <div className="w-13 h-13 rounded-2xl bg-[#E31828] text-white flex flex-col items-center justify-center font-black shadow-xs shadow-[#E31828]/25 shrink-0">
                <span className="text-xl leading-none">{request.blood_group}</span>
                <span className="text-[9px] font-semibold tracking-wider uppercase opacity-90">Blood</span>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1E1B18] tracking-tight">
                  {request.patient_name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#6B5E4F] mt-0.5">
                  <span className="font-semibold text-[#1E1B18]">{request.units_needed} {request.units_needed > 1 ? 'Units' : 'Unit'} Needed</span>
                  <span>·</span>
                  <span>{formatRelativeTime(request.created_at)}</span>
                </div>
              </div>
            </div>

            {/* Urgency Badge */}
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide uppercase shrink-0 ${
                urgencyStyles[request.urgency] || 'bg-[#A80012] text-white'
              }`}
            >
              {request.urgency === 'Emergency' ? 'জরুরি (Emergency)' : request.urgency}
            </span>
          </div>

          {/* Details: Hospital, District/Upazila, Required Date */}
          <div className="mt-4 space-y-1.5 text-xs text-[#5C5248]">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#E31828] shrink-0" />
              <span className="font-medium text-[#1E1B18] truncate">{request.hospital_name}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E31828] shrink-0" />
              <span>{request.upazila}, {request.district}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#E31828] shrink-0" />
              <span>Needed Date: <strong className="text-[#1E1B18]">{request.required_date}</strong></span>
            </div>

            {request.additional_notes && (
              <p className="mt-2 text-xs text-[#6B5E4F] bg-[#FEF9E7] p-2.5 rounded-lg border border-[#F1E4B8]/60 line-clamp-2">
                &quot;{request.additional_notes}&quot;
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
                  const { responses } = await bloodRequestService.getResponsesForRequest(request.id, currentUser?.id);
                  setResponders(responses);
                  setShowModal(true);
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
              disabled={isSubmitting || hasResponded}
              className={`flex-1 h-10 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 ${
                hasResponded
                  ? 'bg-emerald-600 text-white cursor-default'
                  : isCreator
                  ? 'bg-[#EBD89F] text-[#6B5E4F] cursor-not-allowed'
                  : 'bg-[#E31828] hover:bg-[#A80012] text-white shadow-xs shadow-[#E31828]/30 cursor-pointer'
              }`}
            >
              {hasResponded ? (
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
              aria-label={`Call contact number for ${request.patient_name}`}
              className="h-10 px-3.5 rounded-xl border border-[#F1E4B8] bg-[#FFFDE7] hover:bg-[#FFF4D4] text-[#1E1B18] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-[#E31828]" />
              <span className="hidden sm:inline">Call</span>
            </a>
          </div>
        </div>
      </article>

      {/* Responder Modal (Only accessible to creator) */}
      {showModal && isCreator && (
        <ResponderModal
          request={request}
          responses={responders}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
