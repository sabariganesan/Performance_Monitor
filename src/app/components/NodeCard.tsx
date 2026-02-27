import { Cpu, MemoryStick, Activity, Database, TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { NodeMetric } from '../data/mockData';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface NodeCardProps {
  node: NodeMetric;
}

export default function NodeCard({ node }: NodeCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-300';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getMetricColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'text-red-600';
    if (value >= thresholds.warning) return 'text-amber-600';
    return 'text-green-600';
  };

  const getBarColor = (value: number, thresholds: { warning: number; critical: number }) => {
    if (value >= thresholds.critical) return 'bg-red-500';
    if (value >= thresholds.warning) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3 text-red-500" />;
      case 'down': return <TrendingDown className="w-3 h-3 text-green-500" />;
      case 'stable': return <Minus className="w-3 h-3 text-gray-500" />;
    }
  };

  const transactionData = node.transactionTrend.map((value, index) => ({ index, value }));
  const dbResponseData = node.dbResponseTrend.map((value, index) => ({ index, value }));

  const isCritical = node.status === 'critical';

  return (
    <Card className={`bg-white border-l-4 shadow-sm hover:shadow-md transition-all duration-300 ${
      isCritical ? 'border-l-red-500 node-card-critical' : 
      node.status === 'warning' ? 'border-l-amber-500' : 
      'border-l-green-500'
    } card-hover min-h-[220px] flex flex-col`}>
      <CardHeader className="pb-1.5 pt-3 px-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-gray-900 mb-0.5">{node.name}</h3>
            <p className="text-xs text-gray-500">{node.applications.length} apps</p>
          </div>
          <Badge className={`${getStatusColor(node.status)} border font-semibold px-1.5 py-0.5 text-xs uppercase tracking-wide ${
            isCritical ? 'badge-critical' : ''
          }`}>
            {node.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 flex-1 flex flex-col pt-0 px-3 pb-3">
        {/* 2-Column Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* Left Column: CPU & Memory */}
          <div className="space-y-2">
            {/* CPU */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">CPU</span>
                </div>
                <span className={`text-xs font-bold ${getMetricColor(node.cpuPercent, { warning: 70, critical: 85 })}`}>
                  {node.cpuPercent}%
                </span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getBarColor(node.cpuPercent, { warning: 70, critical: 85 })} progress-bar-animated rounded-full`}
                  style={{ width: `${node.cpuPercent}%` }}
                ></div>
              </div>
            </div>

            {/* JVM Memory */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <MemoryStick className="w-2.5 h-2.5 text-gray-500" />
                  <span className="text-xs font-medium text-gray-600">Mem</span>
                </div>
                <span className={`text-xs font-bold ${getMetricColor(node.jvmMemoryPercent, { warning: 75, critical: 90 })}`}>
                  {node.jvmMemoryPercent}%
                </span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getBarColor(node.jvmMemoryPercent, { warning: 75, critical: 90 })} progress-bar-animated rounded-full`}
                  style={{ width: `${node.jvmMemoryPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Right Column: Active Transactions & DB Response */}
          <div className="space-y-2">
            {/* Active Transactions */}
            <div className="bg-blue-50 rounded p-1.5 border border-blue-100">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium text-blue-700">Txn</span>
                <div className="w-10 h-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={transactionData}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#2563eb" 
                        strokeWidth={1} 
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-base font-bold text-blue-900">{node.activeTransactions}</p>
            </div>

            {/* DB Response Time */}
            <div className="bg-purple-50 rounded p-1.5 border border-purple-100">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-medium text-purple-700">DB</span>
                <div className="w-10 h-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dbResponseData}>
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#9333ea" 
                        strokeWidth={1} 
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-base font-bold text-purple-900">{node.dbResponseTime}ms</p>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Row */}
        <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-gray-100">
          <div className="text-center p-1.5 bg-gray-50 rounded">
            <p className="text-xs text-gray-500 mb-0.5">AMB</p>
            <div className="flex items-center justify-center gap-0.5">
              <p className="text-xs font-bold text-gray-900">{node.ambRate > 1000 ? `${(node.ambRate/1000).toFixed(1)}k` : node.ambRate}</p>
              {getTrendIcon(node.ambTrend)}
            </div>
          </div>
          
          <div className={`text-center p-1.5 rounded ${
            node.threadQueueDepth > 15 ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
          }`}>
            <p className="text-xs text-gray-500 mb-0.5">Q</p>
            <p className={`text-xs font-bold ${
              node.threadQueueDepth > 15 ? 'text-red-600 badge-critical' : 'text-gray-900'
            }`}>
              {node.threadQueueDepth}
            </p>
          </div>
          
          <div className={`text-center p-1.5 rounded ${
            node.slowPatternCount > 10 ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'
          }`}>
            <p className="text-xs text-gray-500 mb-0.5">Slow</p>
            <p className={`text-xs font-bold ${
              node.slowPatternCount > 10 ? 'text-amber-600' : 'text-gray-900'
            }`}>
              {node.slowPatternCount}
            </p>
          </div>
        </div>

        {/* Alert Block Area - Minimal Fixed Height */}
        <div className="mt-auto min-h-[32px]">
          {(node.threadQueueDepth > 15 || node.slowPatternCount > 10 || isCritical) ? (
            <div className="flex items-start gap-1 p-1.5 bg-amber-50 border border-amber-200 rounded">
              <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700 leading-tight">
                {isCritical ? 'Critical' : node.threadQueueDepth > 15 ? 'High queue' : 'Slow patterns'}
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