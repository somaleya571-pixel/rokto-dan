import { BloodGroup } from '../data/bangladeshData';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  secondary_phone?: string; // WhatsApp or Imo
  blood_group: BloodGroup;
  district: string;
  upazila: string;
  last_donation_date?: string | null; // ISO string or YYYY-MM-DD
  is_available: boolean;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type UrgencyLevel = 'Emergency' | 'Within 24 Hours' | 'Planned';

export interface BloodRequest {
  id: string;
  user_id: string;
  creator_name: string;
  creator_phone: string;
  patient_name: string;
  blood_group: BloodGroup;
  hospital_name: string;
  district: string;
  upazila: string;
  required_date: string;
  urgency: UrgencyLevel;
  units_needed: number;
  contact_phone: string;
  additional_notes?: string;
  status: 'Open' | 'Fulfilled' | 'Cancelled';
  created_at: string;
}

export interface DonorResponse {
  id: string;
  request_id: string;
  donor_id: string;
  donor_name: string;
  donor_phone: string;
  donor_secondary_contact?: string; // WhatsApp or Imo
  donor_blood_group: BloodGroup;
  donor_district: string;
  donor_upazila: string;
  donor_avatar?: string | null;
  created_at: string;
}

export type PageRoute = 'login' | 'home' | 'search' | 'post' | 'profile';
