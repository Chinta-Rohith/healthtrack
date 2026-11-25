import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import SymptomForm from '../components/SymptomForm';
import * as api from '../services/api';

vi.mock('../services/api', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createSymptom: vi.fn(),
  };
});

describe('SymptomForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders patient ID, symptom description, severity scale, and submit button', () => {
    render(<SymptomForm defaultPatientId="PATIENT001" />);

    expect(screen.getByLabelText(/patient id/i)).toHaveValue('PATIENT001');
    expect(screen.getByLabelText(/symptom description/i)).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: /severity rating/i })).toBeInTheDocument();
    for (let level = 1; level <= 10; level += 1) {
      expect(screen.getByRole('radio', { name: new RegExp(`^Severity ${level} `) })).toBeInTheDocument();
    }
    expect(screen.getByRole('button', { name: /submit symptom entry/i })).toBeInTheDocument();
  });

  it('validates required patient ID and symptom description fields', async () => {
    const user = userEvent.setup();
    render(<SymptomForm defaultPatientId="" />);

    await user.click(screen.getByRole('button', { name: /submit symptom entry/i }));

    expect(screen.getByText('Patient ID is required.')).toBeInTheDocument();
    expect(screen.getByText('Symptom description is required.')).toBeInTheDocument();
    expect(api.createSymptom).not.toHaveBeenCalled();
  });

  it('validates that severity is selected between 1 and 10', async () => {
    const user = userEvent.setup();
    render(<SymptomForm defaultPatientId="PATIENT001" />);

    await user.type(screen.getByLabelText(/symptom description/i), 'Persistent headache');
    await user.click(screen.getByRole('button', { name: /submit symptom entry/i }));

    expect(
      screen.getByText('Please select a severity rating between 1 and 10.')
    ).toBeInTheDocument();
    expect(api.createSymptom).not.toHaveBeenCalled();
  });

  it('displays API success feedback and clears form after successful submission', async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    api.createSymptom.mockResolvedValue({
      success: true,
      message: 'Symptom entry recorded successfully.',
      data: {
        id: 101,
        patientId: 'PATIENT001',
        description: 'Migraine headache',
        severity: 7,
        timestamp: '2026-11-25T12:30:00Z',
      },
    });

    render(<SymptomForm defaultPatientId="PATIENT001" onSuccess={onSuccess} />);

    const descriptionInput = screen.getByLabelText(/symptom description/i);
    await user.type(descriptionInput, '  Migraine headache  ');
    await user.click(screen.getByRole('radio', { name: /Severity 7 \(High\)/i }));
    await user.click(screen.getByRole('button', { name: /submit symptom entry/i }));

    await waitFor(() => {
      expect(api.createSymptom).toHaveBeenCalledWith({
        patientId: 'PATIENT001',
        description: 'Migraine headache',
        severity: 7,
      });
    });

    expect(screen.getByRole('status')).toHaveTextContent('Symptom entry recorded successfully.');
    expect(descriptionInput).toHaveValue('');
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('displays API failure feedback when submission fails', async () => {
    const user = userEvent.setup();
    api.createSymptom.mockRejectedValue({
      response: {
        status: 503,
        data: {
          message: 'Unable to reach the symptom database right now. Please try again shortly.',
        },
      },
    });

    render(<SymptomForm defaultPatientId="PATIENT001" />);

    await user.type(screen.getByLabelText(/symptom description/i), 'Moderate dizziness');
    await user.click(screen.getByRole('radio', { name: /Severity 5 \(Moderate\)/i }));
    await user.click(screen.getByRole('button', { name: /submit symptom entry/i }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(
      'Unable to reach the symptom database right now. Please try again shortly.'
    );
    expect(screen.getByLabelText(/symptom description/i)).toHaveValue('Moderate dizziness');
  });
});
