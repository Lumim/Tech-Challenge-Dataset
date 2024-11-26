import { FxRate, Price } from '@/types/api-types';

const API_BASE_URL = 'http://localhost:8000/';

async function fetchFromAPI<T>(endpoint: string, params: Record<string, string>): Promise<T> {
  const url = new URL(endpoint, API_BASE_URL);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchFxRates(pairs: string[], startDate: string, endDate: string): Promise<Record<string, FxRate[]>> {
  return fetchFromAPI<Record<string, FxRate[]>>('fx-rates', {
    pairs: pairs.join(','),
    start_date: startDate,
    end_date: endDate,
  });
}

export async function fetchPrices(instrumentId: number, startDate: string, endDate: string): Promise<Price[]> {
  return fetchFromAPI<Price[]>('prices', {
    instrument_id: instrumentId.toString(),
    start_date: startDate,
    end_date: endDate,
  });
}

export async function submitResult(result: any): Promise<{ id: string; distance: number }> {
  const response = await fetch(`${API_BASE_URL}submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(result),
  });

  if (!response.ok) {
    throw new Error(`Submission failed: ${response.statusText}`);
  }

  return response.json();
}

