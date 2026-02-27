import { useParams, Link } from 'react-router';
import { ArrowLeft, Activity, Clock, Database, Code, AlertCircle, Zap, Server, TrendingUp, AlertTriangle, TrendingDown, Flame, XCircle } from 'lucide-react';
import { getApplicationById, getNodesByApplication } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ApplicationDetails() {
  const { appId } = useParams<{ appId: string }>();
  const application = getApplicationById(appId || '');
  const nodeDetails = getNodesByApplication(appId || '');

  if (!application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-500">Application not found</p>
          <Link to="/">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800 border-green-200';
      case 'warning': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const hitsData = application.hitsTrend.map((value, index) => ({
    time: `${index}h`,
    hits: value
  }));

  const timeDistribution = [
    { name: 'DB Time', value: application.dbTimePercent, color: '#3b82f6' },
    { name: 'Script Time', value: application.scriptTimePercent, color: '#8b5cf6' },
    { name: 'Network', value: 100 - application.dbTimePercent - application.scriptTimePercent, color: '#10b981' }
  ];

  const urlPerformanceData = application.topSlowUrls.map((url, index) => ({
    url: url.split('/').pop() || url,
    fullUrl: url,
    responseTime: 300 + (application.topSlowUrls.length - index) * 50
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <Activity className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">{application.name}</h1>
              <p className="text-sm text-gray-600">Application Performance Details & Node Insights</p>
            </div>
            <Badge className={`${getStatusColor(application.status)} border font-medium px-3 py-1`}>
              {application.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-5 space-y-4">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Hits</p>
                  <p className="text-xl font-semibold text-gray-900">{application.totalHits.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <p className="text-xs text-green-600">+8.5% from last period</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Avg Response Time</p>
                  <p className="text-xl font-semibold text-gray-900">{application.avgResponseTime} ms</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="w-4 h-4 text-purple-600" />
                </div>
              </div>
              <div className={`text-xs ${
                application.avgResponseTime > 300 ? 'text-red-600' : 
                application.avgResponseTime > 200 ? 'text-amber-600' : 
                'text-green-600'
              }`}>
                {application.avgResponseTime > 300 ? 'Above threshold' : 
                 application.avgResponseTime > 200 ? 'Near threshold' : 
                 'Within target'}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Error Rate</p>
                  <p className="text-xl font-semibold text-gray-900">{application.errorRate}%</p>
                </div>
                <div className={`p-2 rounded-lg ${
                  application.errorRate > 2 ? 'bg-red-100' : 
                  application.errorRate > 1 ? 'bg-amber-100' : 
                  'bg-green-100'
                }`}>
                  <AlertCircle className={`w-4 h-4 ${
                    application.errorRate > 2 ? 'text-red-600' : 
                    application.errorRate > 1 ? 'text-amber-600' : 
                    'text-green-600'
                  }`} />
                </div>
              </div>
              <p className="text-xs text-gray-500">Target: {'<'}1.0%</p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Running Nodes</p>
                  <p className="text-xl font-semibold text-gray-900">{application.nodes.length}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Server className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500">Load balanced</p>
            </CardContent>
          </Card>
        </div>

        {/* Problem Identification Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Critical Issues */}
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-red-900 flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Critical Issues
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {application.errorRate > 2 && (
                <div className="flex items-start gap-2 p-2 bg-white/60 rounded border border-red-300">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-900">High Error Rate</p>
                    <p className="text-xs text-red-700">Error rate at {application.errorRate}%, exceeding 2% threshold</p>
                  </div>
                </div>
              )}
              {application.avgResponseTime > 400 && (
                <div className="flex items-start gap-2 p-2 bg-white/60 rounded border border-red-300">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-900">Severe Latency</p>
                    <p className="text-xs text-red-700">Avg response time {application.avgResponseTime}ms, critical threshold exceeded</p>
                  </div>
                </div>
              )}
              {nodeDetails.some(n => n.errorRate > 3) && (
                <div className="flex items-start gap-2 p-2 bg-white/60 rounded border border-red-300">
                  <Server className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-red-900">Node Failures</p>
                    <p className="text-xs text-red-700">{nodeDetails.filter(n => n.errorRate > 3).length} node(s) reporting critical error rates</p>
                  </div>
                </div>
              )}
              {!application.errorRate && application.avgResponseTime < 400 && !nodeDetails.some(n => n.errorRate > 3) && (
                <div className="flex items-center justify-center h-20">
                  <p className="text-xs text-gray-600">No critical issues detected</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Warnings */}
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Warnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {application.avgResponseTime > 300 && application.avgResponseTime <= 400 && (
                <div className="flex items-start gap-2 p-2 bg-white/60 rounded border border-amber-300">
                  <Clock className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">High Latency</p>
                    <p className="text-xs text-amber-700">Response time approaching threshold at {application.avgResponseTime}ms</p>
                  </div>
                </div>
              )}
              {application.dbTimePercent > 50 && (
                <div className="flex items-start gap-2 p-2 bg-white/60 rounded border border-amber-300">
                  <Database className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">DB Bottleneck</p>
                    <p className="text-xs text-amber-700">{application.dbTimePercent}% time spent in database queries</p>
                  </div>
                </div>
              )}
              {nodeDetails.some(n => n.cpuPercent > 85) && (
                <div className="flex items-start gap-2 p-2 bg-white/60 rounded border border-amber-300">
                  <Flame className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900">High CPU Usage</p>
                    <p className="text-xs text-amber-700">{nodeDetails.filter(n => n.cpuPercent > 85).length} node(s) with CPU above 85%</p>
                  </div>
                </div>
              )}
              {application.avgResponseTime <= 300 && application.dbTimePercent <= 50 && !nodeDetails.some(n => n.cpuPercent > 85) && (
                <div className="flex items-center justify-center h-20">
                  <p className="text-xs text-gray-600">No warnings detected</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {application.dbTimePercent > 40 && (
                <div className="flex items-start gap-2 p-2 bg-white/60 rounded border border-blue-300">
                  <Database className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900">Optimize DB Queries</p>
                    <p className="text-xs text-blue-700">Consider indexing or query optimization to reduce DB time</p>
                  </div>
                </div>
              )}
              {application.topSlowUrls.length > 3 && (
                <div className="flex items-start gap-2 p-2 bg-white/60 rounded border border-blue-300">
                  <Zap className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900">Address Slow URLs</p>
                    <p className="text-xs text-blue-700">{application.topSlowUrls.length} URLs need performance review</p>
                  </div>
                </div>
              )}
              {nodeDetails.length < 3 && (
                <div className="flex items-start gap-2 p-2 bg-white/60 rounded border border-blue-300">
                  <Server className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-blue-900">Scale Horizontally</p>
                    <p className="text-xs text-blue-700">Consider adding more nodes for better load distribution</p>
                  </div>
                </div>
              )}
              {application.dbTimePercent <= 40 && application.topSlowUrls.length <= 3 && nodeDetails.length >= 3 && (
                <div className="flex items-center justify-center h-20">
                  <p className="text-xs text-gray-600">Application performing well</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts - Reduced Size */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Hits Trend (6h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={hitsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#6b7280" />
                  <YAxis tick={{ fontSize: 10 }} stroke="#6b7280" />
                  <Tooltip contentStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="hits" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Hits" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Time Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={timeDistribution}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    label={({ value }) => `${value}%`}
                  >
                    {timeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {timeDistribution.map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-0.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs text-gray-600">{item.name}</span>
                    </div>
                    <p className="text-xs font-semibold text-gray-900">{item.value}%</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Slow URLs</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={urlPerformanceData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fontSize: 10 }} stroke="#6b7280" />
                  <YAxis dataKey="url" type="category" width={80} tick={{ fontSize: 9 }} stroke="#6b7280" />
                  <Tooltip contentStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="responseTime" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Response (ms)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Most Expensive Transaction - Compact */}
        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-orange-200 rounded-lg">
                <Zap className="w-4 h-4 text-orange-700" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-orange-700 mb-1">Most Expensive Transaction</p>
                <p className="text-base font-semibold text-orange-900 mb-1">{application.mostExpensiveTransaction}</p>
                <p className="text-xs text-orange-700">This transaction consumes the most resources. Consider optimization for better performance.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nodes Running This Application - Compact */}
        <Card className="bg-white border-gray-200">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-gray-600" />
              <CardTitle className="text-sm">Nodes Running This Application ({nodeDetails.length})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">Node Name</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">CPU %</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">Memory %</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">Response Time</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">Hits</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">Error Rate</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {nodeDetails.map((node) => (
                    <tr key={node.nodeId} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3">
                        <span className="font-medium text-gray-900 text-xs">{node.nodeName}</span>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[60px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                node.cpuPercent >= 85 ? 'bg-red-500' : 
                                node.cpuPercent >= 70 ? 'bg-amber-500' : 
                                'bg-green-500'
                              }`}
                              style={{ width: `${node.cpuPercent}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-900">{node.cpuPercent}%</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-[60px] h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                node.memoryPercent >= 90 ? 'bg-red-500' : 
                                node.memoryPercent >= 75 ? 'bg-amber-500' : 
                                'bg-green-500'
                              }`}
                              style={{ width: `${node.memoryPercent}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-900">{node.memoryPercent}%</span>
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`text-xs font-medium ${
                          node.responseTime > 300 ? 'text-red-600' : 
                          node.responseTime > 200 ? 'text-amber-600' : 
                          'text-green-600'
                        }`}>
                          {Math.round(node.responseTime)}ms
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-xs text-gray-900">{node.hits.toLocaleString()}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span className={`text-xs font-medium ${
                          node.errorRate > 2 ? 'text-red-600' : 
                          node.errorRate > 1 ? 'text-amber-600' : 
                          'text-green-600'
                        }`}>
                          {node.errorRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-2 px-3">
                        <Link to={`/node/${node.nodeId}`}>
                          <Button variant="outline" size="sm" className="h-7 text-xs px-2">View</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {nodeDetails.length === 0 && (
              <p className="text-center text-gray-500 py-6 text-xs">No node information available</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
