import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import { getMarketDashboard } from '@/config/admin';
import ServiceAccordion from '@/components/ServiceAccordion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const formatINR = (num) => {
  if (!num && num !== 0) return '₹0.00';
  return '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const Services = () => {
  const [bdxData, setBdxData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [bdxLoading, setBdxLoading] = useState(true);
  const [bdxError, setBdxError] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    getMarketDashboard()
      .then((res) => setDashboard(res.data))
      .catch(() => console.error('Failed to load market dashboard'));
  }, []);

  const fetchBdxData = useCallback(async () => {
    try {
      const [coinRes, chartRes] = await Promise.all([
        fetch('https://api.coingecko.com/api/v3/coins/beldex?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false'),
        fetch('https://api.coingecko.com/api/v3/coins/beldex/market_chart?vs_currency=inr&days=7'),
      ]);

      if (!coinRes.ok || !chartRes.ok) throw new Error('Failed to fetch');

      const coin = await coinRes.json();
      const chart = await chartRes.json();

      setBdxData({
        priceINR: coin.market_data.current_price.inr,
        change24h: coin.market_data.price_change_percentage_24h,
        marketCapINR: coin.market_data.market_cap.inr,
        volumeINR: coin.market_data.total_volume.inr,
        circulatingSupply: coin.market_data.circulating_supply,
      });

      const formatted = chart.prices.map(([timestamp, price]) => {
        const date = new Date(timestamp);
        return {
          time: date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit' }),
          price,
        };
      });
      setChartData(formatted);
      setBdxError(null);
    } catch (err) {
      setBdxError('Unable to load BDX price.');
    } finally {
      setBdxLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBdxData();
    const interval = setInterval(fetchBdxData, 60000);
    return () => clearInterval(interval);
  }, [fetchBdxData]);

  return (
    <div>
      <ServiceAccordion />

      {/* BDX Market Overview */}
      <section className="relative section-padding overflow-hidden bg-black">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-6"
          >
            <span className="text-green-400 text-xs font-semibold tracking-[0.2em] uppercase block mb-4">
              BDX Market Overview
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
              Beldex Ecosystem{' '}
              <span className="text-gradient">Dashboard</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            {bdxLoading ? (
              <div className="bg-zinc-950 rounded-3xl p-6 sm:p-8 border border-white/[0.04]">
                <div className="animate-pulse space-y-4">
                  <div className="h-3 bg-white/5 rounded w-20 mx-auto" />
                  <div className="h-12 bg-white/5 rounded w-32 mx-auto" />
                  <div className="h-32 bg-white/5 rounded-2xl" />
                  <div className="flex gap-3 justify-center">
                    <div className="h-12 bg-white/5 rounded-xl w-28" />
                    <div className="h-12 bg-white/5 rounded-xl w-28" />
                    <div className="h-12 bg-white/5 rounded-xl w-28" />
                  </div>
                </div>
              </div>
            ) : bdxError ? (
              <div className="bg-zinc-950 rounded-3xl p-8 border border-white/[0.04] text-center">
                <AlertCircle size={40} className="text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-500">{bdxError}</p>
              </div>
            ) : (
              <div className="bg-zinc-950 rounded-3xl p-6 sm:p-8 border border-white/[0.04]">
                <div className="text-center mb-4">
                  <div className="text-zinc-200 text-sm sm:text-base font-semibold tracking-[0.35em] uppercase mb-1">
                    {dashboard?.title || 'BDX Current Price'}
                  </div>
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-emerald-400 font-mono glow-text leading-none">
                    {bdxData ? formatINR(bdxData.priceINR) : (dashboard?.currentPrice || '₹7.51')}
                  </div>
                </div>

                <div className="mb-4">
                  {chartData.length > 0 || (dashboard?.chartData?.length > 0) ? (
                    <div className="h-32 sm:h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={chartData.length > 0 ? chartData : dashboard.chartData.map((d) => ({ time: d.label, price: d.value }))}
                          margin={{ top: 5, right: 5, left: 5, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="bdxGradientServices" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22C55E" stopOpacity={0.2} />
                              <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" />
                          <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#555555', fontSize: 10 }}
                          />
                          <YAxis
                            domain={['dataMin - 0.1', 'dataMax + 0.1']}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#555555', fontSize: 10 }}
                            tickFormatter={(val) => '₹' + val.toFixed(2)}
                          />
                          <Tooltip
                            contentStyle={{
                              background: '#000000',
                              border: '1px solid rgba(34,197,94,0.15)',
                              borderRadius: '8px',
                            }}
                            labelStyle={{ color: '#a3a3a3', fontSize: '11px' }}
                            formatter={(value) => ['₹' + value.toFixed(2), 'BDX']}
                          />
                          <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#22C55E"
                            strokeWidth={2}
                            fill="url(#bdxGradientServices)"
                            dot={false}
                            activeDot={{ r: 4, fill: '#22C55E', stroke: '#000000', strokeWidth: 2 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-48 sm:h-56 flex items-center justify-center">
                      <p className="text-zinc-600 text-sm">Chart data unavailable</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Network Status', value: dashboard?.networkStatus || 'Active' },
                    { label: 'Recommended Horizon', value: dashboard?.recommendedHorizon || '3\u20135 Years' },
                    { label: 'Current Trend', value: dashboard?.currentTrend || 'Bullish' },
                  ].map((item) => (
                    <div key={item.label} className="text-center p-3 rounded-xl bg-black/50 border border-white/[0.04]">
                      <div className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider mb-2">
                        {item.label}
                      </div>
                      <div className="text-emerald-400 text-sm font-bold">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;
