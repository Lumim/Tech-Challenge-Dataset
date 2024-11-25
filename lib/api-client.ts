import { ApiQueryParams, ApiResponse } from '@/types/api-types'

const API_BASE_URL = 'http://localhost:8000/fetch-fx-rates'
const API_KEY = 'FSPkaSbQA55Do0nXhSZkH9eKWVlAMmNP7OKlI2oA'
const MAX_RETRIES = 3
const INITIAL_RETRY_DELAY = 1000 // 1 second

export async function fetchFinancialData(params: ApiQueryParams): Promise<ApiResponse> {
  let retries = 0
  let delay = INITIAL_RETRY_DELAY

  while (retries < MAX_RETRIES) {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'Accept': 'application/json',
        },
        body: JSON.stringify(params),
      })

      if (!response.ok) {
        if (response.status === 429) {
          const retryAfter = parseInt(response.headers.get('Retry-After') || '60', 10)
          throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds.`)
        }
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      return data as ApiResponse
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed:`, error)
      if (error instanceof Error && error.message.includes('Rate limit exceeded')) {
        const retryAfter = parseInt(error.message.split(' ').pop() || '60', 10)
        delay = retryAfter * 1000
      }
      retries++
      if (retries >= MAX_RETRIES) {
        throw error
      }
      await new Promise(resolve => setTimeout(resolve, delay))
      delay *= 2 // Exponential backoff
    }
  }

  throw new Error('Max retries reached')
}

