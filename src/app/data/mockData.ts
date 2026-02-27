// Mock data for cluster nodes
export interface NodeMetric {
  id: string;
  name: string;
  cpuPercent: number;
  jvmMemoryPercent: number;
  activeTransactions: number;
  transactionTrend: number[];
  dbResponseTime: number;
  dbResponseTrend: number[];
  ambRate: number;
  ambTrend: 'up' | 'down' | 'stable';
  threadQueueDepth: number;
  slowPatternCount: number;
  status: 'healthy' | 'warning' | 'critical';
  applications: string[];
}

// Mock data for applications
export interface ApplicationMetric {
  id: string;
  name: string;
  totalHits: number;
  hitsTrend: number[];
  avgResponseTime: number;
  dbTimePercent: number;
  scriptTimePercent: number;
  topSlowUrls: string[];
  errorRate: number;
  mostExpensiveTransaction: string;
  status: 'healthy' | 'warning' | 'critical';
  nodes: string[];
}

export interface NodeAppDetail {
  nodeId: string;
  nodeName: string;
  cpuPercent: number;
  memoryPercent: number;
  responseTime: number;
  hits: number;
  errorRate: number;
}

export const clusterNodes: NodeMetric[] = [
  {
    id: 'node-01',
    name: 'brightspeeditsm01',
    cpuPercent: 68,
    jvmMemoryPercent: 72,
    activeTransactions: 145,
    transactionTrend: [120, 135, 128, 142, 138, 145, 140, 135, 145],
    dbResponseTime: 125,
    dbResponseTrend: [110, 115, 120, 125, 130, 125, 128, 125],
    ambRate: 2450,
    ambTrend: 'up',
    threadQueueDepth: 12,
    slowPatternCount: 8,
    status: 'warning',
    applications: ['OM Gateway', 'BSW/IQDEV/OM UI', 'Alianza', 'Directory Listing']
  },
  {
    id: 'node-02',
    name: 'brightspeeditsm02',
    cpuPercent: 45,
    jvmMemoryPercent: 58,
    activeTransactions: 98,
    transactionTrend: [92, 95, 88, 98, 94, 96, 98, 95, 98],
    dbResponseTime: 95,
    dbResponseTrend: [88, 90, 92, 95, 93, 91, 93, 95],
    ambRate: 1890,
    ambTrend: 'stable',
    threadQueueDepth: 5,
    slowPatternCount: 3,
    status: 'healthy',
    applications: ['BOSS OM UI', 'Neustar', 'Ring Central', 'O2']
  },
  {
    id: 'node-03',
    name: 'brightspeeditsm03',
    cpuPercent: 82,
    jvmMemoryPercent: 88,
    activeTransactions: 210,
    transactionTrend: [195, 202, 198, 210, 205, 208, 210, 206, 210],
    dbResponseTime: 185,
    dbResponseTrend: [170, 175, 180, 185, 182, 178, 180, 185],
    ambRate: 3250,
    ambTrend: 'up',
    threadQueueDepth: 28,
    slowPatternCount: 15,
    status: 'critical',
    applications: ['Order Validation & Ingestion', 'System Resource Manager', 'Dispatch', 'Case Management']
  },
  {
    id: 'node-04',
    name: 'brightspeeditsm04',
    cpuPercent: 38,
    jvmMemoryPercent: 52,
    activeTransactions: 72,
    transactionTrend: [68, 70, 72, 69, 71, 72, 70, 69, 72],
    dbResponseTime: 82,
    dbResponseTrend: [78, 80, 82, 81, 79, 80, 81, 82],
    ambRate: 1620,
    ambTrend: 'down',
    threadQueueDepth: 4,
    slowPatternCount: 2,
    status: 'healthy',
    applications: ['E911', 'KGP/Context Execution', 'Order Completion', 'Flow Designer']
  },
  {
    id: 'node-05',
    name: 'brightspeeditsm05',
    cpuPercent: 55,
    jvmMemoryPercent: 65,
    activeTransactions: 125,
    transactionTrend: [115, 120, 118, 125, 122, 124, 125, 121, 125],
    dbResponseTime: 110,
    dbResponseTrend: [105, 108, 110, 109, 107, 108, 109, 110],
    ambRate: 2150,
    ambTrend: 'stable',
    threadQueueDepth: 8,
    slowPatternCount: 5,
    status: 'healthy',
    applications: ['Radius/HSPROV', 'Calls SMSI/ONT Activation', 'Billing', 'Execution Workflow Manager']
  },
  {
    id: 'node-06',
    name: 'brightspeeditsm06',
    cpuPercent: 75,
    jvmMemoryPercent: 78,
    activeTransactions: 168,
    transactionTrend: [155, 162, 158, 168, 164, 166, 168, 163, 168],
    dbResponseTime: 145,
    dbResponseTrend: [135, 140, 145, 142, 138, 140, 142, 145],
    ambRate: 2780,
    ambTrend: 'up',
    threadQueueDepth: 18,
    slowPatternCount: 11,
    status: 'warning',
    applications: ['AXON', 'OM to MAESTRO-E', 'IM/C20', 'Calls Cloud/PG Activation']
  }
];

export const applications: ApplicationMetric[] = [
  {
    id: 'app-om-gateway',
    name: 'OM Gateway',
    totalHits: 62500,
    hitsTrend: [58000, 59200, 60100, 61000, 61800, 62500],
    avgResponseTime: 142,
    dbTimePercent: 45,
    scriptTimePercent: 38,
    topSlowUrls: [
      '/api/gateway/auth',
      '/api/gateway/validate',
      '/api/gateway/route'
    ],
    errorRate: 0.4,
    mostExpensiveTransaction: 'GatewayAuthentication',
    status: 'healthy',
    nodes: ['node-01', 'node-02', 'node-03']
  },
  {
    id: 'app-order-validation',
    name: 'Order Validation & Ingestion',
    totalHits: 48920,
    hitsTrend: [45000, 46200, 47100, 47800, 48400, 48920],
    avgResponseTime: 235,
    dbTimePercent: 62,
    scriptTimePercent: 28,
    topSlowUrls: [
      '/order/validate',
      '/order/ingest',
      '/order/rules-check'
    ],
    errorRate: 1.2,
    mostExpensiveTransaction: 'OrderValidation',
    status: 'warning',
    nodes: ['node-03', 'node-04', 'node-05']
  },
  {
    id: 'app-dispatch',
    name: 'Dispatch',
    totalHits: 18750,
    hitsTrend: [17000, 17500, 18000, 18200, 18500, 18750],
    avgResponseTime: 425,
    dbTimePercent: 72,
    scriptTimePercent: 18,
    topSlowUrls: [
      '/dispatch/technician/assign',
      '/dispatch/route/optimize',
      '/dispatch/schedule/update'
    ],
    errorRate: 2.5,
    mostExpensiveTransaction: 'RouteOptimization',
    status: 'critical',
    nodes: ['node-03', 'node-04', 'node-06']
  },
  {
    id: 'app-boss-om-ui',
    name: 'BOSS OM UI',
    totalHits: 72450,
    hitsTrend: [68000, 69500, 70500, 71200, 71900, 72450],
    avgResponseTime: 185,
    dbTimePercent: 42,
    scriptTimePercent: 48,
    topSlowUrls: [
      '/ui/order/dashboard',
      '/ui/order/details',
      '/ui/order/history'
    ],
    errorRate: 0.6,
    mostExpensiveTransaction: 'DashboardLoad',
    status: 'healthy',
    nodes: ['node-02', 'node-03', 'node-04']
  },
  {
    id: 'app-system-resource-manager',
    name: 'System Resource Manager',
    totalHits: 35600,
    hitsTrend: [32000, 33200, 34100, 34800, 35200, 35600],
    avgResponseTime: 312,
    dbTimePercent: 68,
    scriptTimePercent: 22,
    topSlowUrls: [
      '/resource/allocate',
      '/resource/validate',
      '/resource/inventory'
    ],
    errorRate: 1.8,
    mostExpensiveTransaction: 'ResourceAllocation',
    status: 'warning',
    nodes: ['node-03', 'node-05', 'node-06']
  },
  {
    id: 'app-bsw-iqdev',
    name: 'BSW/IQDEV/OM UI',
    totalHits: 28400,
    hitsTrend: [26000, 26800, 27400, 27900, 28200, 28400],
    avgResponseTime: 198,
    dbTimePercent: 52,
    scriptTimePercent: 38,
    topSlowUrls: [
      '/bsw/order/create',
      '/iqdev/validation',
      '/om/workflow'
    ],
    errorRate: 0.9,
    mostExpensiveTransaction: 'OrderWorkflow',
    status: 'healthy',
    nodes: ['node-01', 'node-03', 'node-04']
  },
  {
    id: 'app-case-management',
    name: 'Case Management',
    totalHits: 22150,
    hitsTrend: [20000, 20800, 21300, 21700, 21950, 22150],
    avgResponseTime: 265,
    dbTimePercent: 58,
    scriptTimePercent: 32,
    topSlowUrls: [
      '/case/create',
      '/case/update',
      '/case/resolve'
    ],
    errorRate: 1.1,
    mostExpensiveTransaction: 'CaseCreation',
    status: 'healthy',
    nodes: ['node-03', 'node-04', 'node-05']
  },
  {
    id: 'app-flow-designer',
    name: 'Flow Designer',
    totalHits: 18920,
    hitsTrend: [17000, 17600, 18100, 18500, 18700, 18920],
    avgResponseTime: 342,
    dbTimePercent: 55,
    scriptTimePercent: 38,
    topSlowUrls: [
      '/flow/execute',
      '/flow/validate',
      '/flow/deploy'
    ],
    errorRate: 1.4,
    mostExpensiveTransaction: 'FlowExecution',
    status: 'warning',
    nodes: ['node-04', 'node-05', 'node-06']
  },
  {
    id: 'app-execution-workflow',
    name: 'Execution Workflow Manager',
    totalHits: 41200,
    hitsTrend: [38000, 39100, 39900, 40500, 40900, 41200],
    avgResponseTime: 278,
    dbTimePercent: 64,
    scriptTimePercent: 28,
    topSlowUrls: [
      '/workflow/execute',
      '/workflow/status',
      '/workflow/retry'
    ],
    errorRate: 1.3,
    mostExpensiveTransaction: 'WorkflowExecution',
    status: 'warning',
    nodes: ['node-05', 'node-06', 'node-01']
  },
  {
    id: 'app-customer-comms',
    name: 'Customer Comms',
    totalHits: 56800,
    hitsTrend: [52000, 53500, 54800, 55600, 56200, 56800],
    avgResponseTime: 156,
    dbTimePercent: 38,
    scriptTimePercent: 52,
    topSlowUrls: [
      '/comms/email/send',
      '/comms/sms/send',
      '/comms/notification'
    ],
    errorRate: 0.5,
    mostExpensiveTransaction: 'EmailNotification',
    status: 'healthy',
    nodes: ['node-01', 'node-02', 'node-04']
  },
  {
    id: 'app-jeopardy-manager',
    name: 'Jeopardy Manager',
    totalHits: 14650,
    hitsTrend: [13000, 13600, 14000, 14300, 14500, 14650],
    avgResponseTime: 385,
    dbTimePercent: 72,
    scriptTimePercent: 20,
    topSlowUrls: [
      '/jeopardy/detect',
      '/jeopardy/escalate',
      '/jeopardy/resolve'
    ],
    errorRate: 2.1,
    mostExpensiveTransaction: 'JeopardyDetection',
    status: 'warning',
    nodes: ['node-02', 'node-03', 'node-05']
  },
  {
    id: 'app-o2',
    name: 'O2',
    totalHits: 31200,
    hitsTrend: [28500, 29400, 30100, 30600, 30900, 31200],
    avgResponseTime: 215,
    dbTimePercent: 50,
    scriptTimePercent: 40,
    topSlowUrls: [
      '/o2/provision',
      '/o2/activate',
      '/o2/status'
    ],
    errorRate: 0.8,
    mostExpensiveTransaction: 'O2Provisioning',
    status: 'healthy',
    nodes: ['node-02', 'node-04', 'node-05']
  },
  {
    id: 'app-alianza',
    name: 'Alianza',
    totalHits: 28920,
    hitsTrend: [26500, 27200, 27800, 28200, 28500, 28920],
    avgResponseTime: 168,
    dbTimePercent: 48,
    scriptTimePercent: 38,
    topSlowUrls: [
      '/voip/config',
      '/voip/provisioning',
      '/voip/status'
    ],
    errorRate: 0.5,
    mostExpensiveTransaction: 'VoIPProvisioning',
    status: 'healthy',
    nodes: ['node-01', 'node-02', 'node-05']
  },
  {
    id: 'app-e911',
    name: 'E911',
    totalHits: 15680,
    hitsTrend: [14500, 14800, 15100, 15300, 15500, 15680],
    avgResponseTime: 128,
    dbTimePercent: 38,
    scriptTimePercent: 52,
    topSlowUrls: [
      '/e911/location/validate',
      '/e911/registration',
      '/e911/update'
    ],
    errorRate: 0.2,
    mostExpensiveTransaction: 'LocationValidation',
    status: 'healthy',
    nodes: ['node-04', 'node-05', 'node-06']
  },
  {
    id: 'app-neustar',
    name: 'Neustar',
    totalHits: 24350,
    hitsTrend: [22000, 22800, 23400, 23900, 24100, 24350],
    avgResponseTime: 192,
    dbTimePercent: 46,
    scriptTimePercent: 44,
    topSlowUrls: [
      '/neustar/number/port',
      '/neustar/validation',
      '/neustar/status'
    ],
    errorRate: 0.7,
    mostExpensiveTransaction: 'NumberPorting',
    status: 'healthy',
    nodes: ['node-02', 'node-03', 'node-04']
  },
  {
    id: 'app-radius',
    name: 'Radius/HSPROV',
    totalHits: 38920,
    hitsTrend: [36000, 36800, 37500, 38000, 38500, 38920],
    avgResponseTime: 185,
    dbTimePercent: 58,
    scriptTimePercent: 35,
    topSlowUrls: [
      '/radius/auth',
      '/radius/accounting',
      '/hsprov/provision'
    ],
    errorRate: 1.5,
    mostExpensiveTransaction: 'RadiusAuthentication',
    status: 'warning',
    nodes: ['node-02', 'node-05', 'node-06']
  },
  {
    id: 'app-directory',
    name: 'Directory Listing',
    totalHits: 52300,
    hitsTrend: [48000, 49500, 50200, 51000, 51800, 52300],
    avgResponseTime: 145,
    dbTimePercent: 45,
    scriptTimePercent: 42,
    topSlowUrls: [
      '/directory/search',
      '/directory/update',
      '/directory/sync'
    ],
    errorRate: 0.3,
    mostExpensiveTransaction: 'DirectorySync',
    status: 'healthy',
    nodes: ['node-01', 'node-02', 'node-04', 'node-05']
  },
  {
    id: 'app-axon',
    name: 'AXON',
    totalHits: 19750,
    hitsTrend: [18000, 18600, 19000, 19300, 19500, 19750],
    avgResponseTime: 298,
    dbTimePercent: 65,
    scriptTimePercent: 28,
    topSlowUrls: [
      '/axon/integrate',
      '/axon/sync',
      '/axon/status'
    ],
    errorRate: 1.6,
    mostExpensiveTransaction: 'AxonIntegration',
    status: 'warning',
    nodes: ['node-06', 'node-01', 'node-03']
  },
  {
    id: 'app-calls-smsi',
    name: 'Calls SMSI/ONT Activation',
    totalHits: 26450,
    hitsTrend: [24000, 24800, 25400, 25900, 26200, 26450],
    avgResponseTime: 225,
    dbTimePercent: 54,
    scriptTimePercent: 36,
    topSlowUrls: [
      '/smsi/activate',
      '/ont/provision',
      '/ont/validate'
    ],
    errorRate: 0.9,
    mostExpensiveTransaction: 'ONTActivation',
    status: 'healthy',
    nodes: ['node-05', 'node-06', 'node-01']
  },
  {
    id: 'app-ring-central',
    name: 'Ring Central',
    totalHits: 33600,
    hitsTrend: [31000, 31800, 32400, 32900, 33300, 33600],
    avgResponseTime: 172,
    dbTimePercent: 42,
    scriptTimePercent: 48,
    topSlowUrls: [
      '/ringcentral/provision',
      '/ringcentral/config',
      '/ringcentral/activate'
    ],
    errorRate: 0.6,
    mostExpensiveTransaction: 'RingCentralProvisioning',
    status: 'healthy',
    nodes: ['node-02', 'node-04', 'node-05']
  },
  {
    id: 'app-calls-cloud',
    name: 'Calls Cloud/PG Activation',
    totalHits: 21800,
    hitsTrend: [20000, 20600, 21000, 21400, 21600, 21800],
    avgResponseTime: 248,
    dbTimePercent: 56,
    scriptTimePercent: 34,
    topSlowUrls: [
      '/cloud/activate',
      '/pg/provision',
      '/cloud/validate'
    ],
    errorRate: 1.0,
    mostExpensiveTransaction: 'CloudActivation',
    status: 'healthy',
    nodes: ['node-06', 'node-01', 'node-04']
  },
  {
    id: 'app-om-maestro',
    name: 'OM to MAESTRO-E',
    totalHits: 17920,
    hitsTrend: [16500, 17000, 17400, 17600, 17800, 17920],
    avgResponseTime: 365,
    dbTimePercent: 70,
    scriptTimePercent: 22,
    topSlowUrls: [
      '/maestro/order/push',
      '/maestro/status',
      '/maestro/validate'
    ],
    errorRate: 2.2,
    mostExpensiveTransaction: 'MaestroOrderPush',
    status: 'critical',
    nodes: ['node-06', 'node-03', 'node-05']
  },
  {
    id: 'app-om-usbl',
    name: 'OM to USBL',
    totalHits: 15240,
    hitsTrend: [14000, 14400, 14800, 15000, 15100, 15240],
    avgResponseTime: 285,
    dbTimePercent: 62,
    scriptTimePercent: 30,
    topSlowUrls: [
      '/usbl/order/create',
      '/usbl/sync',
      '/usbl/status'
    ],
    errorRate: 1.4,
    mostExpensiveTransaction: 'USBLOrderSync',
    status: 'warning',
    nodes: ['node-01', 'node-03', 'node-05']
  },
  {
    id: 'app-im-c20',
    name: 'IM/C20',
    totalHits: 29600,
    hitsTrend: [27000, 27800, 28400, 28900, 29300, 29600],
    avgResponseTime: 215,
    dbTimePercent: 52,
    scriptTimePercent: 38,
    topSlowUrls: [
      '/im/inventory/check',
      '/c20/validate',
      '/im/allocate'
    ],
    errorRate: 1.0,
    mostExpensiveTransaction: 'InventoryCheck',
    status: 'healthy',
    nodes: ['node-06', 'node-02', 'node-04']
  },
  {
    id: 'app-kgp',
    name: 'KGP/Context Execution',
    totalHits: 35800,
    hitsTrend: [33000, 34000, 34600, 35100, 35500, 35800],
    avgResponseTime: 195,
    dbTimePercent: 48,
    scriptTimePercent: 42,
    topSlowUrls: [
      '/kgp/execute',
      '/context/load',
      '/kgp/validate'
    ],
    errorRate: 0.8,
    mostExpensiveTransaction: 'ContextExecution',
    status: 'healthy',
    nodes: ['node-04', 'node-05', 'node-06']
  },
  {
    id: 'app-billing',
    name: 'Billing',
    totalHits: 42150,
    hitsTrend: [39000, 40000, 40800, 41200, 41800, 42150],
    avgResponseTime: 298,
    dbTimePercent: 68,
    scriptTimePercent: 25,
    topSlowUrls: [
      '/billing/invoice/generate',
      '/billing/payment/process',
      '/billing/history'
    ],
    errorRate: 0.9,
    mostExpensiveTransaction: 'InvoiceGeneration',
    status: 'warning',
    nodes: ['node-01', 'node-03', 'node-05', 'node-06']
  },
  {
    id: 'app-order-completion',
    name: 'Order Completion',
    totalHits: 38450,
    hitsTrend: [35500, 36500, 37200, 37800, 38200, 38450],
    avgResponseTime: 175,
    dbTimePercent: 44,
    scriptTimePercent: 46,
    topSlowUrls: [
      '/order/complete',
      '/order/notify',
      '/order/close'
    ],
    errorRate: 0.4,
    mostExpensiveTransaction: 'OrderFinalization',
    status: 'healthy',
    nodes: ['node-04', 'node-05', 'node-01']
  }
];

export const getNodeById = (id: string): NodeMetric | undefined => {
  return clusterNodes.find(node => node.id === id);
};

export const getApplicationById = (id: string): ApplicationMetric | undefined => {
  return applications.find(app => app.id === id);
};

export const getApplicationsByNode = (nodeId: string): ApplicationMetric[] => {
  return applications.filter(app => app.nodes.includes(nodeId));
};

export const getNodesByApplication = (appId: string): NodeAppDetail[] => {
  const app = getApplicationById(appId);
  if (!app) return [];
  
  return app.nodes.map(nodeId => {
    const node = getNodeById(nodeId);
    if (!node) return null;
    
    return {
      nodeId: node.id,
      nodeName: node.name,
      cpuPercent: node.cpuPercent,
      memoryPercent: node.jvmMemoryPercent,
      responseTime: app.avgResponseTime + (Math.random() * 40 - 20),
      hits: Math.floor(app.totalHits / app.nodes.length * (0.8 + Math.random() * 0.4)),
      errorRate: app.errorRate * (0.8 + Math.random() * 0.4)
    };
  }).filter(Boolean) as NodeAppDetail[];
};