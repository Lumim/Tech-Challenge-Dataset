import { ApiQueryParams, ApiResponse } from '@/types/api-types'

const API_BASE_URL = 'https://api.challenges.performativ.com'
const API_KEY = 'FSPkaSbQA55Do0nXhSZkH9eKWVlAMmNP7OKlI2oA'

export async function fetchFinancialData(params: ApiQueryParams): Promise<ApiResponse> {
  const queryString = new URLSearchParams(params as Record<string, string>).toString()
  const response = await fetch(`${API_BASE_URL}?${queryString}`, {
    headers: {
      'x-api-key': API_KEY,
      'Accept': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data as ApiResponse
}

