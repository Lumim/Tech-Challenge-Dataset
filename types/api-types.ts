export interface Position {
  id: number;
  open_date: string;
  close_date: string | null;
  open_price: string;
  close_price: string | null;
  quantity: number;
  transaction_costs: number;
  instrument_id: number;
  instrument_currency: string;
  open_transaction_type: string;
  close_transaction_type: string | null;
}

export interface FxRate {
  date: string;
  rate: number;
}

export interface Price {
  date: string;
  price: number;
}

export interface MetricValues {
  IsOpen: number[];
  Price: number[];
  Value: number[];
  OpenValue: number[];
  CloseValue: number[];
  ReturnPerPeriod: number[];
  ReturnPerPeriodPercentage: number[];
}

export interface PositionMetrics {
  [positionId: string]: MetricValues;
}

export interface Result {
  positions: PositionMetrics & { dates: string[] };
  basket: MetricValues & { dates: string[] };
}

