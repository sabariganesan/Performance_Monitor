export type AmbStatus = "NORMAL" | "WARNING";
export type HealthStatus = "NORMAL" | "WARNING" | "CRITICAL";
export type NodeStatus = "online" | "offline";
export type Participation = "primary" | "secondary";

export interface NodeHealthStatus {
  amb_status: string;
  avg_db_time_ms: string;
  avg_queue_length_ms: string;
  avg_transaction_time_ms: string;
  health_status: string;
  last_heartbeat: string;
  node_id: string;
  node_name: string;
  participation: string;
  slow_transaction_percent: string;
  status: string;
  system_id: string;
  total_transactions: number;
}

export type ClusterOverviewResponse = {
  result: {
    data: NodeHealthStatus[];
    count: number;
    start_date: string[];
    end_date: string[];
  };
};

/* ---------- COMMON ---------- */
export interface TimeSeriesBase {
  datetime: string;
  sys_id: string;
}

/* ---------- TIME SERIES ---------- */
export interface ResponseTimeMetric extends TimeSeriesBase {
  response_time_ms: string;
}

export interface DbTimeMetric extends TimeSeriesBase {
  db_time_ms: string;
}

export interface DbQueryCountMetric extends TimeSeriesBase {
  db_query_count: string;
}

export interface CpuTimeMetric extends TimeSeriesBase {
  cpu_time_ms: string;
}

export interface WaitTimeMetric extends TimeSeriesBase {
  wait_time_ms: string;
}

export interface NetworkTimeMetric extends TimeSeriesBase {
  network_time_ms: string;
}

export interface BrowserTimeMetric extends TimeSeriesBase {
  browser_time_ms: string | null;
}

export interface PerformanceMetricsBase {
  total_transactions: number;
  total_db_queries: number;
  avg_transaction_time_ms: string;
  avg_db_time_ms: string;

  response_time_ms: ResponseTimeMetric[];
  db_time_ms: DbTimeMetric[];
  db_query_count: DbQueryCountMetric[];
  cpu_time_ms: CpuTimeMetric[];
  wait_time_ms: WaitTimeMetric[];
  network_time_ms: NetworkTimeMetric[];
  browser_time_ms: BrowserTimeMetric[];
}

/* ---------- MAIN RESPONSE ---------- */
export interface PerformanceMetricsResponse {
  result: {
    data: PerformanceMetricsBase;
    start_date: string[];
    end_date: string[];
  };
}
