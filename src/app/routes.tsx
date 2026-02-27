import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/Dashboard";
import NodeDetails from "./pages/NodeDetails";
import ApplicationDetails from "./pages/ApplicationDetails";
import ClusterInsights from "./pages/ClusterInsights";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Dashboard,
  },
  {
    path: "/cluster-insights",
    Component: ClusterInsights,
  },
  {
    path: "/node/:nodeId",
    Component: NodeDetails,
  },
  {
    path: "/application/:appId",
    Component: ApplicationDetails,
  },
]);