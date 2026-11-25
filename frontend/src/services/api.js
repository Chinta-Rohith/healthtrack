import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Converts Axios/server error objects into safe, user-readable messages.
 */
export function extractApiErrorMessage(error) {
  if (!error) {
    return 'An unexpected error occurred. Please try again.';
  }

  if (error.response) {
    const { status, data } = error.response;

    if (data && typeof data === 'object') {
      if (data.fieldErrors && typeof data.fieldErrors === 'object') {
        const firstFieldMessage = Object.values(data.fieldErrors)[0];
        if (firstFieldMessage) {
          return String(firstFieldMessage);
        }
      }
      if (data.message) {
        return String(data.message);
      }
    }

    if (status === 400) {
      return 'Please check your input values and try again.';
    }
    if (status === 404) {
      return 'Requested symptom endpoint was not found.';
    }
    if (status === 503) {
      return 'The symptom database is currently unavailable. Please verify the backend and MySQL service.';
    }
    if (status >= 500) {
      return 'A server error occurred while processing your request. Please try again shortly.';
    }
  }

  if (error.code === 'ECONNABORTED') {
    return 'The request timed out. Please verify that the HealthTrack backend server is running.';
  }

  if (error.request) {
    return 'Unable to connect to the HealthTrack backend API. Please ensure the server is running.';
  }

  return error.message || 'An unexpected error occurred. Please try again.';
}

/**
 * Submits a new symptom entry to POST /api/symptoms.
 */
export async function createSymptom(payload) {
  const response = await apiClient.post('/symptoms', payload);
  return response.data;
}

/**
 * Fetches all symptom entries for a patient sorted chronologically ascending.
 */
export async function getPatientSymptoms(patientId) {
  const trimmed = (patientId ?? '').trim();
  const response = await apiClient.get(`/symptoms/${encodeURIComponent(trimmed)}`);
  return Array.isArray(response.data) ? response.data : [];
}

/**
 * Fetches 30-day daily average symptom severity trends for a patient.
 */
export async function getPatientTrends(patientId) {
  const trimmed = (patientId ?? '').trim();
  const response = await apiClient.get(`/symptoms/${encodeURIComponent(trimmed)}/trends`);
  return Array.isArray(response.data) ? response.data : [];
}
