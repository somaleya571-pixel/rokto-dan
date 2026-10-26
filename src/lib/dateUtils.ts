/**
 * Date and Eligibility Utility Functions
 */

export function isDonorEligible(lastDonationDate?: string | null): boolean {
  if (!lastDonationDate) return true; // Never donated = eligible
  const donation = new Date(lastDonationDate);
  if (isNaN(donation.getTime())) return true;
  
  const now = new Date();
  const diffTime = now.getTime() - donation.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 3 months = ~90 days minimum gap between whole blood donations
  return diffDays >= 90;
}

export function getDaysUntilEligible(lastDonationDate?: string | null): number {
  if (!lastDonationDate) return 0;
  const donation = new Date(lastDonationDate);
  if (isNaN(donation.getTime())) return 0;
  
  const now = new Date();
  const diffTime = now.getTime() - donation.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, 90 - diffDays);
}

export function formatDonationDate(dateStr?: string | null): string {
  if (!dateStr) return 'Never donated (কখনো রক্ত দেননি)';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Not recorded';
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatRelativeTime(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Recently';
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60));
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}
