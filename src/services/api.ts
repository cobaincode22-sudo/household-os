import { useHouseholdStore } from '@/store/householdStore';

// URL backend VPS Hostinger via Coolify Traefik Reverse Proxy (SSL HTTPS)
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://coolify.janghendra.tech/household-api';

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
