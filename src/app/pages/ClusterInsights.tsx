import {
  ArrowLeft,
  Cpu,
  MemoryStick,
  Activity,
  Database,
  TrendingUp,
  AlertCircle,
  Server,
  AlertTriangle,
} from "lucide-react";
import { Link, useLocation } from "react-router";
import { clusterNodes } from "../data/mockData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { getClusterInsights } from "../../services/dashboardService";
import { useEffect, useState } from "react";
import {
  ClusterInsightsData,
  ClusterInsightsResponse,
} from "../../services/dashboardService.type";
import Loader from "../components/ui/loader";

export default function ClusterInsights() {
  const location = useLocation();
  const dateRange = location.state?.dateRange || {};

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<ClusterInsightsData | null>(null);

  // Generate time-series data for all nodes
  const timePoints = data?.data || [];
  const nodeNames = data?.node_statuses || [];
  // const timePoints = Array.from({ length: 24 }, (_, i) => {
  //   const hour = i;
  //   const data: any = { time: `${hour}:00` };

  //   clusterNodes.forEach((node) => {
  //     // CPU data with some variation
  //     data[`${node.id}_cpu`] = Math.max(
  //       10,
  //       Math.min(100, node.cpuPercent + (Math.random() - 0.5) * 20),
  //     );
  //     // Memory data
  //     data[`${node.id}_memory`] = Math.max(
  //       10,
  //       Math.min(100, node.jvmMemoryPercent + (Math.random() - 0.5) * 15),
  //     );
  //     // Transaction data
  //     data[`${node.id}_transactions`] = Math.max(
  //       0,
  //       node.activeTransactions + Math.floor((Math.random() - 0.5) * 50),
  //     );
  //     // DB Response time
  //     data[`${node.id}_db`] = Math.max(
  //       5,
  //       node.dbResponseTime + Math.floor((Math.random() - 0.5) * 30),
  //     );
  //     // AMB Rate
  //     data[`${node.id}_amb`] = Math.max(
  //       0,
  //       node.ambRate + Math.floor((Math.random() - 0.5) * 500),
  //     );
  //     // Thread Queue Depth
  //     data[`${node.id}_queue`] = Math.max(
  //       0,
  //       node.threadQueueDepth + Math.floor((Math.random() - 0.5) * 10),
  //     );
  //   });

  //   return data;
  // });

  // Node colors for consistent visualization
  const nodeColors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#ec4899", // pink
    "#14b8a6", // teal
    "#f97316", // orange
  ];

  // Calculate cluster-wide stats
  const avgCPU = Math.round(
    clusterNodes.reduce((sum, n) => sum + n.cpuPercent, 0) /
      clusterNodes.length,
  );
  const avgMemory = Math.round(
    clusterNodes.reduce((sum, n) => sum + n.jvmMemoryPercent, 0) /
      clusterNodes.length,
  );
  const totalTransactions = clusterNodes.reduce(
    (sum, n) => sum + n.activeTransactions,
    0,
  );
  const avgDBResponse = Math.round(
    clusterNodes.reduce((sum, n) => sum + n.dbResponseTime, 0) /
      clusterNodes.length,
  );
  const totalAMB = clusterNodes.reduce((sum, n) => sum + n.ambRate, 0);
  const maxQueueDepth = Math.max(
    ...clusterNodes.map((n) => n.threadQueueDepth),
  );

  const getCluster = async () => {
    try {
      setIsLoading(true);

      // const response = await getClusterInsights(
      //   "2026-02-26 4:00:00",
      //   "2026-02-26 5:00:00",
      // );
      const response: ClusterInsightsResponse = await getClusterInsights(
        dateRange.start,
        dateRange.end,
      );
      setData(response.result);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching cluster data:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCluster();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back Button + Title */}
            <div className="flex items-center gap-4">
              <Link to="/">
                <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  <span className="text-sm font-medium">Back to Dashboard</span>
                </button>
              </Link>
              <div className="border-l border-gray-300 h-6"></div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Cluster Performance Insights
                </h1>
                <p className="text-xs text-gray-500">
                  Multi-node comparative analytics
                </p>
              </div>
            </div>

            {/* Right: Cluster Stats Summary */}
            <div className="flex items-center gap-4">
              <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 px-3 py-1.5">
                <Server className="w-3 h-3 mr-1.5" />
                {nodeNames?.length || 0} Nodes
              </Badge>
              <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100 px-3 py-1.5">
                {nodeNames.filter((n) => n?.health_status === "normal").length}{" "}
                Healthy
              </Badge>
              {nodeNames.filter((n) => n?.health_status === "critical").length >
                0 && (
                <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100 px-3 py-1.5">
                  <AlertCircle className="w-3 h-3 mr-1.5" />
                  {
                    nodeNames.filter((n) => n?.health_status === "critical")
                      .length
                  }{" "}
                  Critical
                </Badge>
              )}
              {nodeNames.filter((n) => n?.health_status === "warning").length >
                0 && (
                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100 px-3 py-1.5">
                  <AlertTriangle className="w-3 h-3 mr-1.5" />
                  {
                    nodeNames.filter((n) => n?.health_status === "warning")
                      .length
                  }{" "}
                  Warning
                </Badge>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-5">
        {/* Cluster Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-5">
          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <p className="text-xs font-medium text-gray-600">Avg CPU</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.stats_card?.avg_cpu || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <MemoryStick className="w-4 h-4 text-purple-600" />
                <p className="text-xs font-medium text-gray-600">Avg Memory</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.stats_card?.avg_memory || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-green-600" />
                <p className="text-xs font-medium text-gray-600">Total Txns</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.stats_card?.total_txns || 0}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-indigo-600" />
                <p className="text-xs font-medium text-gray-600">Avg DB Time</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {data?.stats_card?.avg_db_time_ms || 0}ms
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-orange-600" />
                <p className="text-xs font-medium text-gray-600">Total AMB</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {((data?.stats_card?.total_amb || 0) / 1000).toFixed(1)}k
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <p className="text-xs font-medium text-gray-600">Max Queue</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {maxQueueDepth}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Node Legend */}
        <Card className="bg-white border-gray-200 mb-5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Server className="w-4 h-4 text-gray-600" />
              <p className="text-sm font-semibold text-gray-900">Node Legend</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {nodeNames.map((node, index) => (
                <div
                  key={node.node_name}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-md border border-gray-200"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: nodeColors[index % nodeColors.length],
                    }}
                  ></div>
                  <span className="text-xs font-medium text-gray-700">
                    {node.node_name}
                  </span>
                  <Badge
                    className={`ml-1 px-1.5 py-0.5 text-xs ${
                      node.health_status === "normal"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : node.health_status === "warning"
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : node.health_status === "critical"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {node.health_status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparative Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* CPU Usage Over Time */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                Average Response Across Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={timePoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    stroke="#6b7280"
                    style={{ fontSize: "11px" }}
                    interval={3}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "11px" }}
                    label={{
                      value: "CPU %",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: "11px" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  {nodeNames.map((node, index) => (
                    <Line
                      key={node.node_name}
                      type="monotone"
                      dataKey={`${node.node_name}_avg_response`}
                      name={node.node_name}
                      stroke={nodeColors[index % nodeColors.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Memory Usage Over Time */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <MemoryStick className="w-4 h-4 text-purple-600" />
                Queue Across Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={timePoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    stroke="#6b7280"
                    style={{ fontSize: "11px" }}
                    interval={3}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "11px" }}
                    label={{
                      value: "Memory %",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: "11px" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  {nodeNames.map((node, index) => (
                    <Area
                      key={node.node_name}
                      type="monotone"
                      dataKey={`${node.node_name}_queue`}
                      name={node.node_name}
                      stroke={nodeColors[index % nodeColors.length]}
                      fill={nodeColors[index % nodeColors.length]}
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Active Transactions Over Time */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-600" />
                Active Transactions by Node
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={timePoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    stroke="#6b7280"
                    style={{ fontSize: "11px" }}
                    interval={3}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "11px" }}
                    label={{
                      value: "Transactions",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: "11px" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  {nodeNames.map((node, index) => (
                    <Line
                      key={node.node_name}
                      type="monotone"
                      dataKey={`${node.node_name}_transactions`}
                      name={node.node_name}
                      stroke={nodeColors[index % nodeColors.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* DB Response Time Over Time */}
          <Card className="bg-white border-gray-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600" />
                DB Response Time by Node
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={timePoints}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="time"
                    stroke="#6b7280"
                    style={{ fontSize: "11px" }}
                    interval={3}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: "11px" }}
                    label={{
                      value: "Response (ms)",
                      angle: -90,
                      position: "insideLeft",
                      style: { fontSize: "11px" },
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  {nodeNames.map((node, index) => (
                    <Line
                      key={node.node_name}
                      type="monotone"
                      dataKey={`${node.node_name}_db`}
                      name={node.node_name}
                      stroke={nodeColors[index % nodeColors.length]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </main>

      {isLoading && <Loader />}
    </div>
  );
}
