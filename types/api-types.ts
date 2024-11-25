export interface RateData {
  date: string;
  rate: number;
}

export interface ApiResponse {
  [currencyPair: string]: RateData[];
}

export interface ApiQueryParams {
  pairs: string;
  start_date: string;
  end_date: string;
}

