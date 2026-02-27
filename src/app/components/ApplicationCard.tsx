import { Activity, Clock, Database, Code, AlertCircle, Zap, TrendingUp, Server } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { ApplicationMetric } from '../data/mockData';
import { BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ApplicationCardProps {
  application: ApplicationMetric;
}

export default function ApplicationCard({ application }: ApplicationCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-300';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const hitsData = application.hitsTrend.map((value, index) => ({ index, value }));
  
  const timeDistribution = [
    { name: 'DB', value: application.dbTimePercent, color: '#3b82f6' },
    { name: 'Script', value: application.scriptTimePercent, color: '#8b5cf6' },
    { name: 'Other', value: 100 - application.dbTimePercent - application.scriptTimePercent, color: '#e5e7eb' }
  ];

  const isCritical = application.status === 'critical';

  return (
    <Card className={`bg-white border-l-4 shadow-sm hover:shadow-md transition-all duration-300 ${
      isCritical ? 'border-l-red-500 node-card-critical' : 
      application.status === 'warning' ? 'border-l-amber-500' : 
      'border-l-green-500'
    } card-hover min-h-[220px] flex flex-col`}>
      <CardHeader className="pb-1.5 pt-3 px-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-gray-900 mb-0.5 truncate">{application.name}</h3>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Server className="w-2.5 h-2.5" />
              <span>{application.nodes.length} nodes</span>
            </div>
          </div>
          <Badge className={`${getStatusColor(application.status)} border font-semibold px-1.5 py-0.5 text-xs uppercase tracking-wide ${
            isCritical ? 'badge-critical' : ''
          }`}>
            {application.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 flex-1 flex flex-col pt-0 px-3 pb-3">
        {/* Main KPIs - 2 Column Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Total Hits */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded p-2 border border-blue-200">
            <p className="text-xs font-medium text-blue-700 mb-1">Hits</p>
            <p className="text-base font-bold text-blue-900">{application.totalHits > 1000 ? `${(application.totalHits/1000).toFixed(1)}k` : application.totalHits}</p>
            <div className="h-5 mt-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hitsData}>
                  <Bar dataKey="value" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Average Response Time */}
          <div className={`rounded p-2 border ${
            application.avgResponseTime > 300 ? 'bg-gradient-to-br from-red-50 to-red-100/50 border-red-200' :
            application.avgResponseTime > 200 ? 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200' :
            'bg-gradient-to-br from-green-50 to-green-100/50 border-green-200'
          }`}>
            <p className={`text-xs font-medium mb-1 ${
              application.avgResponseTime > 300 ? 'text-red-700' :
              application.avgResponseTime > 200 ? 'text-amber-700' :
              'text-green-700'
            }`}>
              Response
            </p>
            <p className={`text-base font-bold ${
              application.avgResponseTime > 300 ? 'text-red-900' :
              application.avgResponseTime > 200 ? 'text-amber-900' :
              'text-green-900'
            }`}>
              {application.avgResponseTime}ms
            </p>
            <div className="h-1 bg-white/50 rounded-full overflow-hidden mt-1">
              <div 
                className={`h-full ${
                  application.avgResponseTime > 300 ? 'bg-red-500' :
                  application.avgResponseTime > 200 ? 'bg-amber-500' :
                  'bg-green-500'
                } progress-bar-animated`}
                style={{ width: `${Math.min((application.avgResponseTime / 500) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Compact Metrics Row */}
        <div className="grid grid-cols-3 gap-1.5">
          {/* DB Time */}
          <div className="bg-gray-50 rounded p-1.5 border border-gray-200">
            <p className="text-xs text-gray-600 mb-0.5">DB</p>
            <p className="text-xs font-bold text-gray-900">{application.dbTimePercent}%</p>
          </div>

          {/* Script Time */}
          <div className="bg-gray-50 rounded p-1.5 border border-gray-200">
            <p className="text-xs text-gray-600 mb-0.5">Script</p>
            <p className="text-xs font-bold text-gray-900">{application.scriptTimePercent}%</p>
          </div>

          {/* Error Rate */}
          <div className={`rounded p-1.5 border ${
            application.errorRate > 2 ? 'bg-red-50 border-red-200' : 
            application.errorRate > 1 ? 'bg-amber-50 border-amber-200' : 
            'bg-green-50 border-green-200'
          }`}>
            <p className="text-xs text-gray-600 mb-0.5">Error</p>
            <p className={`text-xs font-bold ${
              application.errorRate > 2 ? 'text-red-600' : 
              application.errorRate > 1 ? 'text-amber-600' : 
              'text-green-600'
            }`}>
              {application.errorRate}%
            </p>
          </div>
        </div>

        {/* Most Expensive Transaction - Compact */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded p-1.5">
          <div className="flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-orange-600 flex-shrink-0" />
            <p className="text-xs text-orange-900 truncate font-medium">{application.mostExpensiveTransaction}</p>
          </div>
        </div>

        {/* Alert Block Area - Minimal Fixed Height */}
        <div className="mt-auto min-h-[32px]">
          {(isCritical || application.errorRate > 2 || application.avgResponseTime > 400) ? (
            <div className={`flex items-start gap-1 p-1.5 rounded border ${
              isCritical || application.errorRate > 2 ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
            }`}>
              <AlertCircle className={`w-3 h-3 flex-shrink-0 ${
                isCritical || application.errorRate > 2 ? 'text-red-600' : 'text-amber-600'
              }`} />
              <p className={`text-xs leading-tight ${
                isCritical || application.errorRate > 2 ? 'text-red-700' : 'text-amber-700'
              }`}>
                {isCritical ? 'Critical issues' : application.errorRate > 2 ? 'High error rate' : 'Slow response'}
              </p>
            </div>
          ) : (
            <div className="h-[32px]" aria-hidden="true"></div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}