'use client'

import { useState, useEffect } from 'react'
import { fetchFinancialData } from '@/lib/api-client'
import { ApiResponse, Position } from '@/types/api-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const positionsData: Position[] = [
  {"id":299825,"open_date":"2022-11-01","close_date":"2024-10-20","open_price":"90.515","close_price":"160","quantity":35,"transaction_costs":0,"instrument_id":10256,"instrument_currency":"USD","open_transaction_type":"BUY","close_transaction_type":"SELL"},
  {"id":299826,"open_date":"2023-01-10","close_date":null,"open_price":"80","close_price":null,"quantity":50,"transaction_costs":0,"instrument_id":10256,"instrument_currency":"USD","open_transaction_type":"BUY","close_transaction_type":null},
  {"id":299827,"open_date":"2023-05-11","close_date":null,"open_price":"116","close_price":null,"quantity":35,"transaction_costs":0,"instrument_id":10256,"instrument_currency":"USD","open_transaction_type":"BUY","close_transaction_type":null},
  {"id":299828,"open_date":"2022-11-01","close_date":null,"open_price":"90.515","close_price":null,"quantity":65,"transaction_costs":0,"instrument_id":10256,"instrument_currency":"USD","open_transaction_type":"BUY","close_transaction_type":null},
  {"id":299832,"open_date":"2023-02-06","close_date":"2024-09-12","open_price":"115","close_price":"125","quantity":23,"transaction_costs":0,"instrument_id":32,"instrument_currency":"EUR","open_transaction_type":"BUY","close_transaction_type":"SELL"},
  {"id":299833,"open_date":"2023-07-03","close_date":null,"open_price":"133","close_price":null,"quantity":50,"transaction_costs":0,"instrument_id":32,"instrument_currency":"EUR","open_transaction_type":"BUY","close_transaction_type":null},
  {"id":299834,"open_date":"2023-02-06","close_date":null,"open_price":"115","close_price":null,"quantity":50,"transaction_costs":0,"instrument_id":32,"instrument_currency":"EUR","open_transaction_type":"BUY","close_transaction_type":null},
  {"id":299841,"open_date":"2023-04-12","close_date":"2024-07-10","open_price":"1527","close_price":"1635.5","quantity":129,"transaction_costs":0,"instrument_id":21289,"instrument_currency":"SEK","open_transaction_type":"BUY","close_transaction_type":"SELL"},
  {"id":299842,"open_date":"2024-02-12","close_date":"2024-08-26","open_price":"1275","close_price":"1763","quantity":101,"transaction_costs":0,"instrument_id":21289,"instrument_currency":"SEK","open_transaction_type":"BUY","close_transaction_type":"SELL"},
  {"id":299843,"open_date":"2023-04-12","close_date":"2024-08-26","open_price":"1527","close_price":"1763","quantity":71,"transaction_costs":0,"instrument_id":21289,"instrument_currency":"SEK","open_transaction_type":"BUY","close_transaction_type":"SELL"},
  {"id":299844,"open_date":"2024-02-12","close_date":null,"open_price":"1275","close_price":null,"quantity":36,"transaction_costs":0,"instrument_id":21289,"instrument_currency":"SEK","open_transaction_type":"BUY","close_transaction_type":null},
  {"id":299845,"open_date":"2023-05-19","close_date":null,"open_price":"0.2192","close_price":null,"quantity":1823,"transaction_costs":0,"instrument_id":21290,"instrument_currency":"DKK","open_transaction_type":"BUY","close_transaction_type":null}
]

export default function FinancialDataViewer() {
  const [pairs, setPairs] = useState('USDGBP,EURGBP,SEKGBP,DKKGBP')
  const [startDate, setStartDate] = useState('20221101')
  const [endDate, setEndDate] = useState('20241020')
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    handleFetch()
  }, [])

  async function handleFetch() {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFinancialData({
        pairs,
        start_date: startDate,
        end_date: endDate,
      })
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Financial Data Viewer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="pairs" className="text-sm font-medium">
                Currency Pairs
              </label>
              <Input
                id="pairs"
                value={pairs}
                onChange={(e) => setPairs(e.target.value)}
                placeholder="USDGBP,EURGBP,SEKGBP,DKKGBP"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium">
                Start Date
              </label>
              <Input
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="YYYYMMDD"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium">
                End Date
              </label>
              <Input
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="YYYYMMDD"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleFetch}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Loading...' : 'Fetch Data'}
          </Button>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          {data && (
            <div className="mt-4 space-y-4">
              <h3 className="text-lg font-semibold">API Data</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Currency Pair</TableHead>
                    <TableHead>Latest Price</TableHead>
                    <TableHead>Latest Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(data.positions).map(([positionId, metrics]) => (
                    <TableRow key={positionId}>
                      <TableCell>{positionId}</TableCell>
                      <TableCell>{metrics.Price[metrics.Price.length - 1].toFixed(8)}</TableCell>
                      <TableCell>{metrics.Value[metrics.Value.length - 1].toFixed(8)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Positions Data</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Open Date</TableHead>
                  <TableHead>Close Date</TableHead>
                  <TableHead>Open Price</TableHead>
                  <TableHead>Close Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Currency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positionsData.map((position) => (
                  <TableRow key={position.id}>
                    <TableCell>{position.id}</TableCell>
                    <TableCell>{position.open_date}</TableCell>
                    <TableCell>{position.close_date || 'N/A'}</TableCell>
                    <TableCell>{position.open_price}</TableCell>
                    <TableCell>{position.close_price || 'N/A'}</TableCell>
                    <TableCell>{position.quantity}</TableCell>
                    <TableCell>{position.instrument_currency}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

