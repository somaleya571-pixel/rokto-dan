import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { BloodGroup } from '../data/bangladeshData';
import { BloodRequest, DonorResponse, UserProfile } from '../types';
import { isDonorEligible } from './dateUtils';
import { INITIAL_PROFILES, INITIAL_REQUESTS, INITIAL_RESPONSES } from './mockSeed';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('example.com')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Storage Keys for persistent storage
const PROFILES_KEY = 'roktodan_profiles_clean_v2';
const REQUESTS_KEY = 'roktodan_requests_clean_v2';
const RESPONSES_KEY = 'roktodan_responses_clean_v2';
const SESSION_KEY = 'roktodan_current_user_clean_v2';

// Initialize Local Store - clean database without fake people profiles
function initializeStorage() {
  if (typeof window === 'undefined') return;

  // Purge any legacy demo fake profiles
  const oldProfilesKey = 'roktodan_profiles_v1';
  if (localStorage.getItem(oldProfilesKey)) {
    localStorage.removeItem(oldProfilesKey);
    localStorage.removeItem('roktodan_requests_v1');
    localStorage.removeItem('roktodan_responses_v1');
    localStorage.removeItem('roktodan_current_user_v1');
  }

  if (!localStorage.getItem(PROFILES_KEY)) {
    localStorage.setItem(PROFILES_KEY, JSON.stringify([]));
  } else {
    // Extra safety: sanitize existing profiles to ensure zero fake accounts
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      if (raw) {
        const list: UserProfile[] = JSON.parse(raw);
        const filtered = list.filter(
          (p) => !p.email.includes('@example.com') && !p.id.startsWith('donor-')
        );
        localStorage.setItem(PROFILES_KEY, JSON.stringify(filtered));
      }
    } catch {
      localStorage.setItem(PROFILES_KEY, JSON.stringify([]));
    }
  }

  if (!localStorage.getItem(REQUESTS_KEY)) {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify([]));
  }

  if (!localStorage.getItem(RESPONSES_KEY)) {
    localStorage.setItem(RESPONSES_KEY, JSON.stringify([]));
  }
}

initializeStorage();

// Storage helper functions
export function getStoredProfiles(): UserProfile[] {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    return raw ? JSON.parse(raw) : INITIAL_PROFILES;
  } catch {
    return INITIAL_PROFILES;
  }
}

export function saveStoredProfiles(profiles: UserProfile[]) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
}

export function getStoredRequests(): BloodRequest[] {
  try {
    const raw = localStorage.getItem(REQUESTS_KEY);
    return raw ? JSON.parse(raw) : INITIAL_REQUESTS;
  } catch {
    return INITIAL_REQUESTS;
  }
}

export function saveStoredRequests(requests: BloodRequest[]) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export function getStoredResponses(): DonorResponse[] {
  try {
    const raw = localStorage.getItem(RESPONSES_KEY);
    return raw ? JSON.parse(raw) : INITIAL_RESPONSES;
  } catch {
    return INITIAL_RESPONSES;
  }
}

export function saveStoredResponses(responses: DonorResponse[]) {
  localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
}

export function getStoredSession(): UserProfile | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredSession(user: UserProfile | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// -------------------------------------------------------------
// Authentication Service
// -------------------------------------------------------------
export const authService = {
  async getCurrentUser(): Promise<UserProfile | null> {
    if (supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          if (profile) return profile as UserProfile;
        }
      } catch (err) {
        console.warn('Supabase auth check failed, using local session', err);
      }
    }
    return getStoredSession();
  },

  async signIn(email: string, _password: string): Promise<{ user: UserProfile | null; error: string | null }> {
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: _password });
        if (error) {
          return { user: null, error: error.message };
        }
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          if (profile) {
            saveStoredSession(profile as UserProfile);
            return { user: profile as UserProfile, error: null };
          }
        }
      } catch (err: any) {
        console.warn('Supabase sign-in failed, checking local database:', err);
      }
    }

    // Local / fallback database sign-in
    const profiles = getStoredProfiles();
    const existing = profiles.find((p) => p.email.toLowerCase() === email.trim().toLowerCase());
    if (existing) {
      saveStoredSession(existing);
      return { user: existing, error: null };
    }

    return {
      user: null,
      error: 'No registered profile found with this email. Please click "Register" to create your genuine donor account.'
    };
  },

  async signUp(
    params: {
      email: string;
      password?: string;
      full_name: string;
      phone: string;
      secondary_phone?: string;
      blood_group: BloodGroup;
      district: string;
      upazila: string;
      last_donation_date?: string | null;
      is_available?: boolean;
    }
  ): Promise<{ user: UserProfile | null; error: string | null }> {
    if (supabase && params.password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: params.email,
          password: params.password,
          options: {
            data: {
              full_name: params.full_name,
              phone: params.phone,
              blood_group: params.blood_group,
              district: params.district,
              upazila: params.upazila,
            }
          }
        });
        if (error) {
          return { user: null, error: error.message };
        }
        if (data.user) {
          const profile: UserProfile = {
            id: data.user.id,
            email: params.email,
            full_name: params.full_name,
            phone: params.phone,
            secondary_phone: params.secondary_phone || params.phone,
            blood_group: params.blood_group,
            district: params.district,
            upazila: params.upazila,
            last_donation_date: params.last_donation_date || null,
            is_available: params.is_available ?? true,
            avatar_url: null,
            created_at: new Date().toISOString()
          };
          await supabase.from('profiles').upsert(profile);
          saveStoredSession(profile);
          return { user: profile, error: null };
        }
      } catch (err: any) {
        console.warn('Supabase sign-up fallback to local DB:', err);
      }
    }

    const profiles = getStoredProfiles();
    const existing = profiles.find((p) => p.email.toLowerCase() === params.email.trim().toLowerCase());
    if (existing) {
      return { user: null, error: 'An account with this email already exists. Please log in.' };
    }

    const newProfile: UserProfile = {
      id: 'user-' + Date.now(),
      email: params.email.trim().toLowerCase(),
      full_name: params.full_name,
      phone: params.phone,
      secondary_phone: params.secondary_phone || params.phone,
      blood_group: params.blood_group,
      district: params.district,
      upazila: params.upazila,
      last_donation_date: params.last_donation_date || null,
      is_available: params.is_available ?? true,
      avatar_url: null,
      created_at: new Date().toISOString()
    };
    profiles.push(newProfile);
    saveStoredProfiles(profiles);
    saveStoredSession(newProfile);
    return { user: newProfile, error: null };
  },

  async signOut(): Promise<void> {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase sign-out error:', err);
      }
    }
    saveStoredSession(null);
  }
};

// -------------------------------------------------------------
// Donors & Search Service
// -------------------------------------------------------------
export const donorService = {
  /**
   * Search donors with the CRITICAL 3-month eligibility filter rule:
   * Only display donors eligible to donate (last donation date was 3+ months ago or never donated).
   * Exclude anyone who donated within the last 3 months.
   */
  async searchEligibleDonors(filters: {
    blood_group?: string;
    district?: string;
    upazila?: string;
  }): Promise<UserProfile[]> {
    let profiles = getStoredProfiles();

    // 1. Mandatory CRITICAL Eligibility Filter:
    // Exclude donors who donated within the last 3 months (< 90 days)
    // Only donors who are eligible (never donated OR >= 90 days ago) and is_available
    profiles = profiles.filter((donor) => {
      // Must be available for donation
      if (!donor.is_available) return false;
      // Must satisfy 3+ month rule (or never donated)
      return isDonorEligible(donor.last_donation_date);
    });

    // 2. Filter by Blood Group if specified
    if (filters.blood_group && filters.blood_group !== 'All') {
      profiles = profiles.filter((p) => p.blood_group === filters.blood_group);
    }

    // 3. Filter by District if specified
    if (filters.district && filters.district !== 'All') {
      profiles = profiles.filter(
        (p) => p.district.toLowerCase() === filters.district!.toLowerCase()
      );
    }

    // 4. Filter by Upazila if specified
    if (filters.upazila && filters.upazila !== 'All' && filters.upazila !== '') {
      profiles = profiles.filter(
        (p) => p.upazila.toLowerCase() === filters.upazila!.toLowerCase()
      );
    }

    return profiles;
  },

  async updateProfile(profile: UserProfile): Promise<UserProfile> {
    if (supabase) {
      try {
        await supabase.from('profiles').upsert(profile);
      } catch (err) {
        console.warn('Supabase profile update fallback:', err);
      }
    }

    const profiles = getStoredProfiles();
    const index = profiles.findIndex((p) => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = { ...profiles[index], ...profile, updated_at: new Date().toISOString() };
    } else {
      profiles.push(profile);
    }
    saveStoredProfiles(profiles);

    // Update current session if editing own profile
    const current = getStoredSession();
    if (current && current.id === profile.id) {
      saveStoredSession(profile);
    }

    return profile;
  }
};

// -------------------------------------------------------------
// Blood Requests & Responses Service
// -------------------------------------------------------------
export const bloodRequestService = {
  async getRecentRequests(): Promise<BloodRequest[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('blood_requests')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data && data.length > 0) {
          return data as BloodRequest[];
        }
      } catch (err) {
        console.warn('Supabase fetch requests fallback:', err);
      }
    }
    return getStoredRequests().sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async createRequest(
    data: Omit<BloodRequest, 'id' | 'created_at' | 'status'>
  ): Promise<BloodRequest> {
    const newRequest: BloodRequest = {
      ...data,
      id: 'req-' + Date.now(),
      status: 'Open',
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        await supabase.from('blood_requests').insert(newRequest);
      } catch (err) {
        console.warn('Supabase insert request fallback:', err);
      }
    }

    const requests = getStoredRequests();
    requests.unshift(newRequest);
    saveStoredRequests(requests);
    return newRequest;
  },

  /**
   * Submit an "I Want to Donate" response for a blood request
   */
  async submitResponse(
    requestId: string,
    donor: UserProfile
  ): Promise<{ response: DonorResponse | null; alreadyResponded: boolean }> {
    const responses = getStoredResponses();
    const existing = responses.find(
      (r) => r.request_id === requestId && r.donor_id === donor.id
    );

    if (existing) {
      return { response: existing, alreadyResponded: true };
    }

    const newResponse: DonorResponse = {
      id: 'resp-' + Date.now(),
      request_id: requestId,
      donor_id: donor.id,
      donor_name: donor.full_name,
      donor_phone: donor.phone,
      donor_secondary_contact: donor.secondary_phone || donor.phone,
      donor_blood_group: donor.blood_group,
      donor_district: donor.district,
      donor_upazila: donor.upazila,
      donor_avatar: donor.avatar_url,
      created_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        await supabase.from('blood_request_responses').insert(newResponse);
      } catch (err) {
        console.warn('Supabase insert response fallback:', err);
      }
    }

    responses.unshift(newResponse);
    saveStoredResponses(responses);
    return { response: newResponse, alreadyResponded: false };
  },

  /**
   * CRITICAL PRIVACY & SECURITY RULE:
   * "When a donor expresses interest, show their full profile (picture, name, details, quick Call and WhatsApp/Imo action buttons).
   * THIS RESPONDER LIST MUST ONLY BE VISIBLE TO THE USER WHO CREATED THE POST.
   * Other users or public visitors must not be able to view who applied/voted."
   */
  async getResponsesForRequest(
    requestId: string,
    currentUserId?: string
  ): Promise<{ count: number; responses: DonorResponse[]; canViewDetails: boolean }> {
    const requests = getStoredRequests();
    const request = requests.find((r) => r.id === requestId);
    const responses = getStoredResponses().filter((r) => r.request_id === requestId);
    const count = responses.length;

    // Strict privacy rule: ONLY post creator can see the details
    const isCreator = Boolean(request && currentUserId && request.user_id === currentUserId);

    if (isCreator) {
      return {
        count,
        responses,
        canViewDetails: true
      };
    }

    // Public / non-creators only see count, NEVER profiles or phone numbers
    return {
      count,
      responses: [],
      canViewDetails: false
    };
  },

  async hasUserResponded(requestId: string, userId: string): Promise<boolean> {
    const responses = getStoredResponses();
    return responses.some((r) => r.request_id === requestId && r.donor_id === userId);
  }
};
