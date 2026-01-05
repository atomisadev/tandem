export const StatusService = {
  getSystemHealth: () => {
    return {
      status: "operational",
      timestamp: new Date().toISOString(),
      system: "Tandem Backend",
    };
  },
};
