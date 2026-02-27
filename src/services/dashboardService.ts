export const getClusterOverview = async (
  startDate: string,
  endDate: string,
) => {
  try {
    const response = await fetch(
      `https://brightspeedtsmnonprod1.service-now.com/api/fobr/system_health/cluster?start_date=${encodeURIComponent(startDate)}&end_date=${encodeURIComponent(endDate)}`,
    );
    return response?.json();
  } catch (error) {
    console.error("Error fetching cluster overview:", error);
    throw error;
  }
};

export const getNodeDetails = async (
  nodeId: string,
  dateRange: { start: string; end: string },
) => {
  try {
    const response = await fetch(
      `https://brightspeedtsmnonprod1.service-now.com/api/fobr/system_health/cluster/${nodeId}?start_date=${encodeURIComponent(dateRange.start)}&end_date=${encodeURIComponent(dateRange.end)}`,
    );
    return response?.json();
  } catch (error) {
    console.error(`Error fetching details for node ${nodeId}:`, error);
    throw error;
  }
};
