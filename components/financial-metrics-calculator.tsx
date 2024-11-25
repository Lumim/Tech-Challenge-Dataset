'use client'

import React, { useState, useEffect } from 'react';
import { fetchFxRates, fetchPrices, submitResult } from '@/lib/api-client';
import { Position, Result, MetricValues, FxRate, Price } from '@/types/api-types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const START_DATE = '20241016';
const END_DATE = '20241116';
const TARGET_CURRENCY = 'USD';

const positions: Position[] = [
  {
    id: 299825,
    open_date: "2022-11-01",
    close_date: "2024-10-20",
    open_price: "90.515",
    close_price: "160",
    quantity: 35,
    transaction_costs: 0,
    instrument_id: 10256,
    instrument_currency: "USD",
    open_transaction_type: "BUY",
    close_transaction_type: "SELL",
  },
  {
    id: 299826,
    open_date: "2023-01-10",
    close_date: null,
    open_price: "80",
    close_price: null,
    quantity: 50,
    transaction_costs: 0,
    instrument_id: 10256,
    instrument_currency: "USD",
    open_transaction_type: "BUY",
    close_transaction_type: null,
  },
  {
    id: 299827,
    open_date: "2023-05-11",
    close_date: null,
    open_price: "116",
    close_price: null,
    quantity: 35,
    transaction_costs: 0,
    instrument_id: 10256,
    instrument_currency: "USD",
    open_transaction_type: "BUY",
    close_transaction_type: null,
  },
  {
    id: 299828,
    open_date: "2022-11-01",
    close_date: null,
    open_price: "90.515",
    close_price: null,
    quantity: 65,
    transaction_costs: 0,
    instrument_id: 10256,
    instrument_currency: "USD",
    open_transaction_type: "BUY",
    close_transaction_type: null,
  },
  {
    id: 299832,
    open_date: "2023-02-06",
    close_date: "2024-09-12",
    open_price: "115",
    close_price: "125",
    quantity: 23,
    transaction_costs: 0,
    instrument_id: 32,
    instrument_currency: "EUR",
    open_transaction_type: "BUY",
    close_transaction_type: "SELL",
  },
  {
    id: 299833,
    open_date: "2023-07-03",
    close_date: null,
    open_price: "133",
    close_price: null,
    quantity: 50,
    transaction_costs: 0,
    instrument_id: 32,
    instrument_currency: "EUR",
    open_transaction_type: "BUY",
    close_transaction_type: null,
  },
  {
    id: 299834,
    open_date: "2023-02-06",
    close_date: null,
    open_price: "115",
    close_price: null,
    quantity: 50,
    transaction_costs: 0,
    instrument_id: 32,
    instrument_currency: "EUR",
    open_transaction_type: "BUY",
    close_transaction_type: null,
  },
  {
    id: 299841,
    open_date: "2023-04-12",
    close_date: "2024-07-10",
    open_price: "1527",
    close_price: "1635.5",
    quantity: 129,
    transaction_costs: 0,
    instrument_id: 21289,
    instrument_currency: "SEK",
    open_transaction_type: "BUY",
    close_transaction_type: "SELL",
  },
  {
    id: 299842,
    open_date: "2024-02-12",
    close_date: "2024-08-26",
    open_price: "1275",
    close_price: "1763",
    quantity: 101,

    transaction_costs: 0,
    instrument_id: 21289,
    instrument_currency: "SEK",
    open_transaction_type: "BUY",
    close_transaction_type: "SELL",
  },
  {
    id: 299843,
    open_date: "2023-04-12",
    close_date: "2024-08-26",
    open_price: "1527",
    close_price: "1763",
    quantity: 71,
    transaction_costs: 0,
    instrument_id: 21289,
    instrument_currency: "SEK",
    open_transaction_type: "BUY",
    close_transaction_type: "SELL",
  },
  {
    id: 299844,
    open_date: "2024-02-12",
    close_date: null,
    open_price: "1275",
    close_price: null,
    quantity: 36,
    transaction_costs: 0,
    instrument_id: 21289,
    instrument_currency: "SEK",
    open_transaction_type: "BUY",
    close_transaction_type: null,
  },
  {
    id: 299845,
    open_date: "2023-05-19",
    close_date: null,
    open_price: "0.2192",
    close_price: null,
    quantity: 1823,
    transaction_costs: 0,
    instrument_id: 21290,
    instrument_currency: "DKK",
    open_transaction_type: "BUY",
    close_transaction_type: null,
  },
];
function generateDateRange(start: string, end: string): string[] {
  const dates: string[] = [];
  let currentDate = new Date(start);
  const endDate = new Date(end);

  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

function calculatePositionMetrics(
  position: Position,
  fxRates: Record<string, FxRate[]>,
  prices: Price[],
  dates: string[]
): MetricValues {
  const metrics: MetricValues = {
    IsOpen: [],
    Price: [],
    Value: [],
    OpenValue: [],
    CloseValue: [],
    ReturnPerPeriod: [],
    ReturnPerPeriodPercentage: [],
  };

  const openDate = new Date(position.open_date);
  const closeDate = position.close_date ? new Date(position.close_date) : new Date(END_DATE);

  dates.forEach((date, index) => {
    const currentDate = new Date(date);
    const isOpen = currentDate >= openDate && currentDate < closeDate ? 1 : 0;
    const fxRate = fxRates[`${position.instrument_currency}${TARGET_CURRENCY}`].find(r => r.date === date)?.rate || 1;
    const price = prices.find(p => p.date === date)?.price || 0;

    metrics.IsOpen.push(isOpen);
    metrics.Price.push(price * fxRate);
    metrics.Value.push(isOpen * price * fxRate * position.quantity);
    metrics.OpenValue.push(isOpen * parseFloat(position.open_price) * fxRate * position.quantity);
    metrics.CloseValue.push(position.close_date && currentDate >= closeDate ? parseFloat(position.close_price!) * fxRate * position.quantity : 0);

    if (index > 0) {
      const prevValue = metrics.Value[index - 1];
      const currentValue = metrics.Value[index];
      const returnPerPeriod = currentValue - prevValue;
      metrics.ReturnPerPeriod.push(returnPerPeriod);
      metrics.ReturnPerPeriodPercentage.push(prevValue !== 0 ? returnPerPeriod / prevValue : 0);
    } else {
      metrics.ReturnPerPeriod.push(0);
      metrics.ReturnPerPeriodPercentage.push(0);
    }
  });

  return metrics;
}

function calculateBasketMetrics(positionMetrics: Record<string, MetricValues>): MetricValues {
  const basketMetrics: MetricValues = {
    IsOpen: [],
    Price: [],
    Value: [],
    OpenValue: [],
    CloseValue: [],
    ReturnPerPeriod: [],
    ReturnPerPeriodPercentage: [],
  };

  const metricKeys = Object.keys(basketMetrics) as (keyof MetricValues)[];
  const numDays = positionMetrics[Object.keys(positionMetrics)[0]].IsOpen.length;

  for (let i = 0; i < numDays; i++) {
    metricKeys.forEach(key => {
      if (key === 'IsOpen') {
        basketMetrics[key][i] = Object.values(positionMetrics).some(metrics => metrics[key][i] === 1) ? 1 : 0;
      } else if (key === 'Price') {
        basketMetrics[key][i] = 0; // Basket doesn't have a meaningful price
      } else {
        basketMetrics[key][i] = Object.values(positionMetrics).reduce((sum, metrics) => sum + metrics[key][i], 0);
      }
    });

    if (i > 0) {
      const prevValue = basketMetrics.Value[i - 1];
      basketMetrics.ReturnPerPeriodPercentage[i] = prevValue !== 0 ? basketMetrics.ReturnPerPeriod[i] / prevValue : 0;
    }
  }

  return basketMetrics;
}

export default function FinancialMetricsCalculator() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{ id: string; distance: number } | null>(null);

  async function calculateMetrics() {
    setLoading(true);
    setError(null);
    try {
      const dates = generateDateRange(START_DATE, END_DATE);
      const currencyPairs = [...new Set(positions.map(p => `${p.instrument_currency}${TARGET_CURRENCY}`))];
      const fxRates = await fetchFxRates(currencyPairs, START_DATE, END_DATE);

      const positionMetrics: Record<string, MetricValues> = {};
      for (const position of positions) {
        const prices = await fetchPrices(position.instrument_id, START_DATE, END_DATE);
        positionMetrics[position.id.toString()] = calculatePositionMetrics(position, fxRates, prices, dates);
      }

      const basketMetrics = calculateBasketMetrics(positionMetrics);

      const result: Result = {
        positions: { ...positionMetrics, dates },
        basket: { ...basketMetrics, dates },
      };
      alert(result)
      setResult(result);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!result) return;

    try {
      const submissionResult = await submitResult(result);
      setSubmissionResult(submissionResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    }
  }

  useEffect(() => {
    calculateMetrics();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Financial Metrics Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <p>Calculating metrics...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {result && (
          <div>
            <p>Metrics calculated successfully!</p>
            <Button onClick={handleSubmit} className="mt-4">Submit Result</Button>
          </div>
        )}
        {submissionResult && (
          <div className="mt-4">
            <p>Submission ID: {submissionResult.id}</p>
            <p>Distance Score: {submissionResult.distance}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

