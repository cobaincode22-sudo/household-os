import { useHouseholdStore } from '@/store/householdStore';

// URL backend VPS Hostinger yang sekarang aktif
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://187.127.223.222:4000';

export async function fetchHouseholdDashboard(householdId: string = 'hh_anderson') {
  try {
    const res = await fetch(`${API_BASE_URL}/api/households/${householdId}/dashboard`);
    if (!res.ok) {
      throw new Error(`Server returned ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn('API sync warning (using local store cache):', error);
    return null;
  }
}

export async function checkServerHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return await res.json();
  } catch (error) {
    return { status: 'offline', error };
  }
}
