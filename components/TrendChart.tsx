import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { FETISH_DATA } from '../constants';

const TrendChart: React.FC = () => {
  const data = FETISH_DATA.map(f => {
    let shortName = f.title.split(' ')[0];
    if (f.id === 'anal' || f.title.includes('Anal')) {
      shortName = 'Anal';
    } else if (f.id === 'bdsm' || f.title.includes('Dominação')) {
      shortName = 'BDSM';
    } else if (f.title.includes('Ménage')) {
       shortName = 'Ménage';
    }
    
    return {
      name: shortName,
      fullTitle: f.title,
      popularity: f.popularity,
    };
  }).sort((a, b) => b.popularity - a.popularity);

  return (
    <div className="w-full h-[300px] md:h-[400px] bg-[#18181b]/50 rounded-xl p-4 border border-[#c67a47]/30">
      <h3 className="text-[#e8a96a] mb-4 font-bold text-sm uppercase tracking-wider">
        Tendências Nacionais 2025/2026 (%)
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: -20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af" 
            tick={{ fontSize: 10, fill: '#9ca3af' }} 
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis stroke="#4b5563" tick={{ fontSize: 12, fill: '#4b5563' }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f0f11', borderColor: '#c67a47', color: '#f4f4f5', borderRadius: '8px' }}
            itemStyle={{ color: '#e8a96a', fontWeight: 'bold' }}
            cursor={{ fill: '#c67a47', opacity: 0.1 }}
          />
          <Bar dataKey="popularity" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index < 3 ? '#c67a47' : '#a05a28'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendChart;