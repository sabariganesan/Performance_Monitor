import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Server,
  Activity,
  Zap,
  AlertTriangle,
  Flame,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { clusterNodes, applications } from "../data/mockData";
import NodeCard from "../components/NodeCard";
import ApplicationCard from "../components/ApplicationCard";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Badge } from "../components/ui/badge";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { getClusterOverview } from "../../services/dashboardService";
import {
  ClusterOverviewResponse,
  NodeHealthStatus,
} from "../../services/dashboardService.type";
import { getDateRange, isWithinTimeRange } from "../../utils/dateTimeUtil";
import { RangeType } from "../../utils/dateTimeUtil.type";
import Loader from "../components/ui/loader";

export default function Dashboard() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [timeRange, setTimeRange] = useState("6h");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [clusterNodes, setClusterNodes] = useState<NodeHealthStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const healthyNodesCount = useMemo(() => {
    return clusterNodes.filter((node) => node.health_status === "NORMAL")
      .length;
  }, [clusterNodes]);

  const warningNodesCount = useMemo(() => {
    return clusterNodes.filter((node) => node.health_status === "WARNING")
      .length;
  }, [clusterNodes]);

  const criticalNodesCount = useMemo(() => {
    return clusterNodes.filter((node) => node.health_status === "CRITICAL")
      .length;
  }, [clusterNodes]);

  // Check if any filters are active
  const hasActiveFilters =
    timeRange !== "1h" ||
    statusFilter !== "all" ||
    showCriticalOnly ||
    searchTerm !== "";

  // Clear all filters
  const clearAllFilters = () => {
    setTimeRange("1h");
    setStatusFilter("all");
    setShowCriticalOnly(false);
    setSearchTerm("");
  };

  const filteredNodes = clusterNodes.filter((node) => {
    const matchesSearch = node.node_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || node.health_status === statusFilter;
    const matchesCritical =
      !showCriticalOnly || node.health_status === "CRITICAL";
    // const matchesTime = isWithinTimeRange(node.last_heartbeat, timeRange);

    return matchesSearch && matchesStatus && matchesCritical;
  });

  const filteredApps = applications.filter((app) => {
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesCritical = !showCriticalOnly || app.status === "critical";
    return matchesSearch && matchesStatus && matchesCritical;
  });

  // Cluster Stats
  const totalNodes = clusterNodes.length;
  const healthyNodes = clusterNodes.filter(
    (n) => n.status === "healthy",
  ).length;
  const warningNodes = clusterNodes.filter(
    (n) => n.status === "warning",
  ).length;
  const criticalNodes = clusterNodes.filter(
    (n) => n.status === "critical",
  ).length;
  const healthyPercentage =
    totalNodes > 0 ? (healthyNodes / totalNodes) * 100 : 0;
  const warningPercentage =
    totalNodes > 0 ? (warningNodes / totalNodes) * 100 : 0;
  const criticalPercentage =
    totalNodes > 0 ? (criticalNodes / totalNodes) * 100 : 0;

  // Application Stats
  const totalApps = applications.length;
  const totalHits = applications.reduce((sum, app) => sum + app.totalHits, 0);
  const avgResponseTime = Math.round(
    applications.reduce((sum, app) => sum + app.avgResponseTime, 0) /
      applications.length,
  );
  const avgErrorRate = (
    applications.reduce((sum, app) => sum + app.errorRate, 0) /
    applications.length
  ).toFixed(2);
  const slowTransactionsCount = applications.filter(
    (app) => app.avgResponseTime > 300,
  ).length;

  // Generate sparkline data for total hits
  const hitsSparklineData = Array.from({ length: 8 }, (_, i) => ({
    index: i,
    value: totalHits * (0.85 + Math.random() * 0.15),
  }));

  const getResponseTimeColor = (time: number) => {
    if (time < 200) return "text-green-600";
    if (time < 400) return "text-amber-600";
    return "text-red-600";
  };

  const getResponseTimeBg = (time: number) => {
    if (time < 200) return "bg-green-50";
    if (time < 400) return "bg-amber-50";
    return "bg-red-50";
  };

  const getResponseTimeBorder = (time: number) => {
    if (time < 200) return "border-t-green-500";
    if (time < 400) return "border-t-amber-500";
    return "border-t-red-500";
  };

  const getDashboardData = async () => {
    try {
      setIsLoading(true);
      const dateRange = getDateRange(timeRange as RangeType);
      const data: ClusterOverviewResponse = await getClusterOverview(
        dateRange.start.toString(),
        dateRange.end.toString(),
      );
      setClusterNodes(data?.result?.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setIsLoading(false);
    }
  };

  const handleNavigateCard = (node: NodeHealthStatus) => {
    navigate(`/node/${node.system_id}`, {
      state: {
        node: { ...node, dateRange: getDateRange(timeRange as RangeType) },
      },
    });
  };

  useEffect(() => {
    getDashboardData();
  }, [timeRange]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Global Top Bar - Sticky */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="px-6 py-3">
          {/* First Row: Primary Controls */}
          <div className="flex items-center justify-between gap-4">
            {/* Left: Title + Environment Tag + Search */}
            <div className="flex items-center gap-4 flex-1">
              <div className="flex items-center gap-2">
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">
                    ServiceNow Performance Monitor
                  </h1>
                  <p className="text-xs text-gray-500">
                    Real-time observability
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100 px-2 py-0.5 text-xs font-medium">
                  PROD
                </Badge>
              </div>

              {/* Global Search */}
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search nodes, applications, or transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-50 border-gray-300 h-9"
                  />
                </div>
              </div>
            </div>

            {/* Right: Auto-refresh + Updated timestamp */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                <RefreshCw className="w-3 h-3 text-green-600 pulse-indicator" />
                <span className="text-xs text-gray-600">Auto-refresh</span>
              </div>

              <div className="text-xs text-gray-500 px-2.5 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
                Updated: 00:20:35
              </div>
            </div>
          </div>

          {/* Second Row: Filtering & Status Controls */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            {/* Left: Health Legend */}
            <div className="flex items-center gap-3 text-xs text-gray-600">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Healthy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Critical</span>
              </div>
            </div>

            {/* Right: Filters */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="critical-only"
                  checked={showCriticalOnly}
                  onCheckedChange={setShowCriticalOnly}
                />
                <Label
                  htmlFor="critical-only"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  View Critical Only
                </Label>
              </div>

              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[110px] bg-white border-gray-300 h-9">
                  <Clock className="w-3.5 h-3.5 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last 1 hour</SelectItem>
                  <SelectItem value="6h">Last 6 hours</SelectItem>
                  <SelectItem value="24h">Last 24 hours</SelectItem>
                  {/* <SelectItem value="custom">Custom</SelectItem> */}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[145px] bg-white border-gray-300 h-9">
                  <Filter className="w-3.5 h-3.5 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="NORMAL">Healthy</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <button
                  className="text-sm text-gray-700 cursor-pointer hover:text-gray-900"
                  onClick={clearAllFilters}
                >
                  <X className="w-4 h-4 mr-1 inline" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Filter Indicator Section - Only show when filters are active */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 animate-in fade-in-50 slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between">
                {/* Left: Filter Icon + "Filters Applied" + Active Filter Chips */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Filters Applied:
                    </span>
                  </div>

                  {/* Filter Chips Container */}
                  <div className="flex items-center gap-2">
                    {/* Search Term Chip */}
                    {searchTerm && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-md">
                        <span className="text-xs text-blue-700 font-medium">
                          Search: {searchTerm}
                        </span>
                        <button
                          onClick={() => setSearchTerm("")}
                          className="hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                          aria-label="Remove search filter"
                        >
                          <X className="w-3 h-3 text-blue-600" />
                        </button>
                      </div>
                    )}

                    {/* Time Range Chip */}
                    {timeRange !== "1h" && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 border border-purple-200 rounded-md">
                        <span className="text-xs text-purple-700 font-medium">
                          Time:{" "}
                          {timeRange === "6h"
                            ? "Last 6 hours"
                            : timeRange === "24h"
                              ? "Last 24 hours"
                              : "Custom"}
                        </span>
                        <button
                          onClick={() => setTimeRange("1h")}
                          className="hover:bg-purple-100 rounded-full p-0.5 transition-colors"
                          aria-label="Remove time range filter"
                        >
                          <X className="w-3 h-3 text-purple-600" />
                        </button>
                      </div>
                    )}

                    {/* Status Filter Chip */}
                    {statusFilter !== "all" && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md">
                        <span className="text-xs text-amber-700 font-medium">
                          Status:{" "}
                          {statusFilter.charAt(0).toUpperCase() +
                            statusFilter.slice(1)}
                        </span>
                        <button
                          onClick={() => setStatusFilter("all")}
                          className="hover:bg-amber-100 rounded-full p-0.5 transition-colors"
                          aria-label="Remove status filter"
                        >
                          <X className="w-3 h-3 text-amber-600" />
                        </button>
                      </div>
                    )}

                    {/* Critical Only Chip */}
                    {showCriticalOnly && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 border border-red-200 rounded-md">
                        <span className="text-xs text-red-700 font-medium">
                          View Critical Only
                        </span>
                        <button
                          onClick={() => setShowCriticalOnly(false)}
                          className="hover:bg-red-100 rounded-full p-0.5 transition-colors"
                          aria-label="Remove critical only filter"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Clear All Button */}
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <span>Clear All</span>
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-5">
        {/* Primary Tab Navigation */}
        <Tabs defaultValue="cluster" className="space-y-3">
          {/* Segmented Control Style Tabs */}
          <div className="flex justify-start">
            <TabsList className="bg-gray-100 border-0 p-1 rounded-xl inline-flex gap-1">
              <TabsTrigger
                value="cluster"
                className="rounded-lg px-6 py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50"
              >
                Cluster Overview
              </TabsTrigger>
              <TabsTrigger
                value="applications"
                className="rounded-lg px-6 py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:font-semibold data-[state=active]:shadow-sm data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-gray-900 data-[state=inactive]:hover:bg-gray-50"
              >
                Application Overview
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content: Cluster Overview */}
          <TabsContent
            value="cluster"
            className="space-y-5 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
          >
            {/* Cluster Stats Cards - 4 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Card 1: Total Nodes - Added Gray Top Border */}
              <Card className="bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] border-t-[6px] border-t-[#CBD5E1] border-x border-b border-gray-200 stats-card-hover cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-700 mb-1.5">
                        Total Nodes
                      </p>
                      <p className="text-3xl leading-none font-bold text-gray-900">
                        {Array.isArray(clusterNodes) ? clusterNodes.length : 0}
                      </p>
                      <p className="text-xs text-gray-500 mt-1.5">Active</p>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Server className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Healthy Nodes */}
              <Card className="bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] border-t-[6px] border-t-[#22C55E] border-x border-b border-gray-200 stats-card-hover cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-700 mb-1.5">
                        Healthy Nodes
                      </p>
                      <div className="flex items-baseline gap-2 mb-1">
                        <p className="text-3xl leading-none font-bold text-gray-900">
                          {healthyNodesCount}
                        </p>
                        <span className="text-xs font-semibold text-green-600">
                          {healthyPercentage.toFixed(0)}%
                        </span>
                      </div>
                      {/* <div className="flex items-center gap-1 mt-1.5">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">+2%</span>
                      </div> */}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Warning Nodes */}
              <Card className="bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] border-t-[6px] border-t-[#F59E0B] border-x border-b border-gray-200 stats-card-hover cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-700 mb-1.5">
                        Warning Nodes
                      </p>
                      <div className="flex items-baseline gap-2 mb-1">
                        <p className="text-3xl leading-none font-bold text-gray-900">
                          {warningNodesCount}
                        </p>
                        <span className="text-xs font-semibold text-amber-600">
                          {warningPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span className="text-xs text-amber-600 font-medium">
                          Attention
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Critical Nodes */}
              <Card
                className={`bg-white rounded-xl border-t-[6px] border-t-[#EF4444] border-x border-b border-gray-200 stats-card-hover cursor-pointer ${
                  criticalNodes > 0
                    ? "critical-card-glow"
                    : "shadow-[0px_2px_8px_rgba(0,0,0,0.05)]"
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-xs font-medium text-gray-700">
                          Critical Nodes
                        </p>
                        {criticalNodes > 0 && (
                          <div className="w-2 h-2 rounded-full bg-red-500 pulse-status-dot"></div>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <p className="text-3xl leading-none font-bold text-gray-900">
                          {criticalNodesCount}
                        </p>
                        <span className="text-xs font-semibold text-red-600">
                          {criticalPercentage.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-1.5">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        <span className="text-xs text-red-600 font-medium">
                          Action needed
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* View Insights Button */}
            <div className="flex justify-end">
              <Link to="/cluster-insights">
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    View Cluster Insights
                  </span>
                  <TrendingUp className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Cluster Node Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredNodes.map((node) => (
                <div
                  key={node.node_id}
                  className="block stagger-item"
                  onClick={() => handleNavigateCard(node)}
                >
                  <NodeCard node={node} />
                </div>
              ))}
            </div>

            {filteredNodes.length === 0 && (
              <Card className="bg-white border-gray-200 p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">No nodes found</p>
                  <p className="text-sm text-gray-400">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Tab Content: Application Overview */}
          <TabsContent
            value="applications"
            className="space-y-5 animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
          >
            {/* Application Stats Cards - 5 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Card 1: Total Applications - Added Gray Top Border */}
              <Card className="bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] border-t-[6px] border-t-[#CBD5E1] border-x border-b border-gray-200 stats-card-hover cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-700 mb-1.5">
                        Total Apps
                      </p>
                      <p className="text-3xl leading-none font-bold text-gray-900">
                        {totalApps}
                      </p>
                      <p className="text-xs text-gray-500 mt-1.5">Monitored</p>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Activity className="w-4 h-4 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Total Hits */}
              <Card className="bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] border-t-[6px] border-t-blue-500 border-x border-b border-gray-200 stats-card-hover cursor-pointer">
                <CardContent className="p-4">
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-700 mb-1.5">
                      Total Hits
                    </p>
                    <p className="text-2xl leading-none font-bold text-gray-900">
                      {totalHits.toLocaleString()}
                    </p>
                    <div className="h-8 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={hitsSparklineData}>
                          <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Avg Response Time */}
              <Card
                className={`bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] border-t-[6px] ${getResponseTimeBorder(avgResponseTime)} border-x border-b border-gray-200 stats-card-hover cursor-pointer`}
              >
                <CardContent className="p-4">
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-700 mb-1.5">
                      Avg Response
                    </p>
                    <div className="flex items-baseline gap-1.5">
                      <p
                        className={`text-2xl leading-none font-bold ${getResponseTimeColor(avgResponseTime)}`}
                      >
                        {avgResponseTime}
                      </p>
                      <span className="text-xs text-gray-600">ms</span>
                    </div>
                    <div
                      className={`inline-flex items-center gap-1 mt-2 px-1.5 py-0.5 ${getResponseTimeBg(avgResponseTime)} rounded`}
                    >
                      <Clock
                        className={`w-3 h-3 ${getResponseTimeColor(avgResponseTime)}`}
                      />
                      <span
                        className={`text-xs font-medium ${getResponseTimeColor(avgResponseTime)}`}
                      >
                        {avgResponseTime < 200
                          ? "Excellent"
                          : avgResponseTime < 400
                            ? "Fair"
                            : "Poor"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 4: Avg Error Rate */}
              <Card
                className={`bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] border-t-[6px] ${
                  parseFloat(avgErrorRate) > 1
                    ? "border-t-red-500"
                    : "border-t-green-500"
                } border-x border-b border-gray-200 stats-card-hover cursor-pointer`}
              >
                <CardContent className="p-4">
                  <div className="mb-2">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <p className="text-xs font-medium text-gray-700">
                        Error Rate
                      </p>
                      {parseFloat(avgErrorRate) > 1 && (
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <p
                        className={`text-3xl leading-none font-bold ${
                          parseFloat(avgErrorRate) > 1
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {avgErrorRate}
                      </p>
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1.5">
                      {parseFloat(avgErrorRate) > 1
                        ? "Above threshold"
                        : "Within limits"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Card 5: Slow Transactions */}
              <Card className="bg-white rounded-xl shadow-[0px_2px_8px_rgba(0,0,0,0.05)] border-t-[6px] border-t-amber-500 border-x border-b border-gray-200 stats-card-hover cursor-pointer">
                <CardContent className="p-4">
                  <div className="mb-2">
                    <p className="text-xs font-medium text-gray-700 mb-1.5">
                      Slow Apps
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl leading-none font-bold text-gray-900">
                        {slowTransactionsCount}
                      </p>
                      <Flame className="w-5 h-5 text-amber-500" />
                    </div>
                    <p className="text-xs text-amber-600 mt-1.5 font-medium">
                      &gt;300ms
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Application Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {filteredApps.map((app) => (
                <Link
                  key={app.id}
                  to={`/application/${app.id}`}
                  className="block stagger-item"
                >
                  <ApplicationCard application={app} />
                </Link>
              ))}
            </div>

            {filteredApps.length === 0 && (
              <Card className="bg-white border-gray-200 p-12 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    No applications found
                  </p>
                  <p className="text-sm text-gray-400">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      {isLoading && <Loader />}
    </div>
  );
}
