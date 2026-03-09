import api from "../api";

export interface DashboardOverviewData {
    totalProperty: number;
    activeProperty: number;
    upCommingSiteViste: number;
}

export const dashboardKeys = {
    overview: () => ["dashboard", "overview"] as const,
};

export const getAgentOverview = async (token?: string): Promise<{ data: DashboardOverviewData }> => {
    const response = await api.get("/dashboard/agent-overview", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
};
