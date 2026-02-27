import { useParams, Link, useLocation } from "react-router";
import {
  ArrowLeft,
  Cpu,
  MemoryStick,
  Activity,
  Database,
  TrendingUp,
  Server,
  Layers,
} from "lucide-react";
import { getNodeById, getApplicationsByNode } from "../data/mockData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import {
  PerformanceMetricsBase,
  PerformanceMetricsResponse,
} from "../../services/dashboardService.type";
import { getNodeDetails } from "../../services/dashboardService";
import { mapSeries } from "../../utils/graphUtil";
import Loader from "../components/ui/loader";

export default function NodeDetails() {
  const location = useLocation();
  const { nodeId } = useParams<{ nodeId: string }>();
  const node = location?.state?.node || {};

  const applications: any[] = [];

  const [details, setDetails] = useState<PerformanceMetricsBase | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log(isLoading, "isLoading");

  const responseTimeData = mapSeries(
    details?.response_time_ms,
    "response_time_ms",
  );
  const dbTimeData = mapSeries(details?.db_time_ms, "db_time_ms");
  const queryCountData = mapSeries(details?.db_query_count, "db_query_count");

  const getNode = async (
    nodeId: string,
    dateRange: { start: string; end: string },
  ) => {
    if (nodeId) {
      try {
        setIsLoading(true);
        const nodeDetails: PerformanceMetricsResponse = await getNodeDetails(
          nodeId,
          dateRange,
        );
        setDetails(nodeDetails.result.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching node details:", error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getNode(nodeId || "", node?.dateRange);
  }, [nodeId, node]);

  if (!nodeId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-500">Node not found</p>
          <Link to="/">
            <Button className="mt-4">Back to Dashboard</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NORMAL":
        return "bg-green-100 text-green-800 border-green-200";
      case "WARNING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const transactionData = responseTimeData;
  const dbResponseData = dbTimeData;

  const resourceData =
    details?.cpu_time_ms.map((cpu, i) => ({
      time: new Date(cpu.datetime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      cpu: Number(cpu.cpu_time_ms),
      network: Number(details.network_time_ms[i]?.network_time_ms ?? 0),
      wait: Number(details.wait_time_ms[i]?.wait_time_ms ?? 0),
      browser: Number(details.browser_time_ms[i]?.browser_time_ms ?? 0),
    })) ?? [];

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
            <Server className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                {node.node_name || "--"}
              </h1>
              <p className="text-sm text-gray-600">
                Node Performance Details & Application Insights
              </p>
            </div>
            <Badge
              className={`${getStatusColor(node.health_status)} border font-medium px-3 py-1`}
            >
              {node.health_status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-6 space-y-6">
        {/* Key Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">CPU Usage</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {/* {node?.cpuPercent}% */}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Cpu className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${node?.cpuPercent >= 85 ? "bg-red-500" : node.cpuPercent >= 70 ? "bg-amber-500" : "bg-green-500"}`}
                  style={{ width: `${node?.cpuPercent}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">JVM Memory</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {/* {node?.jvmMemoryPercent}% */}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <MemoryStick className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${node?.jvmMemoryPercent >= 90 ? "bg-red-500" : node?.jvmMemoryPercent >= 75 ? "bg-amber-500" : "bg-green-500"}`}
                  style={{ width: `${node?.jvmMemoryPercent}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Active Transactions
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {details?.total_transactions ?? 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                AMB Rate: {details?.avg_transaction_time_ms ?? 0} ms
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">DB Response Time</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {details?.avg_db_time_ms ?? 0} ms
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Database className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                Thread Queue: {node.threadQueueDepth}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-base">
                Resource Utilization (Last {node?.range?.split("h")[0] ?? ""}{" "}
                Hour)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={resourceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="cpu"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                    name="CPU"
                  />
                  <Area
                    type="monotone"
                    dataKey="network"
                    stackId="2"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="Network"
                  />
                  <Area
                    type="monotone"
                    dataKey="wait"
                    stackId="2"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="Wait Time"
                  />
                  <Area
                    type="monotone"
                    dataKey="browser"
                    stackId="2"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                    name="Browser Time"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-base">
                Active Transactions Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line
                    dataKey="value"
                    name="Response Time"
                    type="monotone"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  {/* <Line
                    type="monotone"
                    dataKey="transactions"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Transactions"
                  /> */}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-base">
                Database Response Time (Last {node?.range?.split("h")[0] ?? ""}{" "}
                Hour)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={dbResponseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Area
                    dataKey="value"
                    name="DB Time"
                    type="monotone"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-base">Query count trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={queryCountData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 12 }}
                    stroke="#6b7280"
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="#ef4444"
                    radius={[8, 8, 0, 0]}
                    name="Query count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Applications Running on This Node */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-gray-600" />
              <CardTitle className="text-base">
                Applications Running on This Node ({applications.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {applications.map((app) => (
                <Link key={app.id} to={`/application/${app.id}`}>
                  <Card className="bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">
                          {app.name}
                        </h3>
                        <Badge
                          className={`${getStatusColor(app.status)} text-xs px-2 py-0.5`}
                        >
                          {app.status}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Hits:</span>
                          <span className="font-medium text-gray-900">
                            {app.totalHits.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Response:</span>
                          <span className="font-medium text-gray-900">
                            {app.avgResponseTime} ms
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Error Rate:</span>
                          <span
                            className={`font-medium ${app.errorRate > 2 ? "text-red-600" : app.errorRate > 1 ? "text-amber-600" : "text-green-600"}`}
                          >
                            {app.errorRate}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            {applications.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No applications running on this node
              </p>
            )}
          </CardContent>
        </Card>
      </main>

      {isLoading && <Loader />}
    </div>
  );
}
