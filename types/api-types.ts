export interface PositionMetrics {
    isOpen: number[]
    Price: number[]
    Value: number[]
    OpenValue: number[]
    CloseValue: number[]
    ReturnPerPeriod: number[]
    ReturnPerPeriodPercentage: number[]
    dates: string[]
  }
  
  export interface Positions {
    [key: string]: PositionMetrics
  }
  
  export interface BasketMetrics {
    isOpen: number[]
    Price: number[]
    Value: number[]
    OpenValue: number[]
    CloseValue: number[]
    ReturnPerPeriod: number[]
    ReturnPerPeriodPercentage: number[]
    dates: string[]
  }
  
  export interface ApiResponse {
    positions: Positions
    basket: BasketMetrics
  }
  
  export interface ApiQueryParams {
    pairs: string
    start_date: string
    end_date: string
  }