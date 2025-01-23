import { TrackingData } from '../../types/tracking';

const API_BASE = 'http://localhost:3000/api';

export async function sendTrackingData(data: TrackingData): Promise<void> {
  await fetch(`${API_BASE}/tracking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}