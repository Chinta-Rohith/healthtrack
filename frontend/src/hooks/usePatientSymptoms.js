import { useCallback, useEffect, useMemo, useState } from 'react';
import { extractApiErrorMessage, getPatientSymptoms, getPatientTrends } from '../services/api';
import { validatePatientId } from '../utils/severity';

/**
 * Fetches and manages symptom history and 30-day trend data for a given patientId.
 */
export function usePatientSymptoms(patientId) {
  const [symptoms, setSymptoms] = useState([]);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = useCallback(async (signalObj = { cancelled: false }) => {
    const validationError = validatePatientId(patientId);
    if (validationError) {
      setSymptoms([]);
      setTrends([]);
      setError(validationError);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const [symptomList, trendList] = await Promise.all([
        getPatientSymptoms(patientId),
        getPatientTrends(patientId),
      ]);

      if (!signalObj.cancelled) {
        setSymptoms(symptomList);
        setTrends(trendList);
      }
    } catch (err) {
      if (!signalObj.cancelled) {
        setSymptoms([]);
        setTrends([]);
        setError(extractApiErrorMessage(err));
      }
    } finally {
      if (!signalObj.cancelled) {
        setLoading(false);
      }
    }
  }, [patientId]);

  useEffect(() => {
    const signalObj = { cancelled: false };
    loadData(signalObj);
    return () => {
      signalObj.cancelled = true;
    };
  }, [loadData]);

  const metrics = useMemo(() => {
    if (!symptoms.length) {
      return {
        totalEntries: 0,
        averageSeverity: null,
        highestSeverity: null,
        latestEntry: null,
      };
    }

    let sum = 0;
    let highest = 0;
    for (const entry of symptoms) {
      sum += entry.severity;
      if (entry.severity > highest) {
        highest = entry.severity;
      }
    }

    return {
      totalEntries: symptoms.length,
      averageSeverity: Number((sum / symptoms.length).toFixed(1)),
      highestSeverity: highest,
      // Backend returns entries sorted ascending, so the last element is the most recent.
      latestEntry: symptoms[symptoms.length - 1],
    };
  }, [symptoms]);

  const refresh = useCallback(() => {
    return loadData({ cancelled: false });
  }, [loadData]);

  return {
    symptoms,
    trends,
    metrics,
    loading,
    error,
    refresh,
  };
}
