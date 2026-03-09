import api from "../api";
import { DashboardOverviewResponse } from "@/types/dashboard";

export const dashboardKeys = {
    all: ["dashboard"] as const,
    overview: (year: number) => [...dashboardKeys.all, "overview", year] as const,
};

export const getAgentOverview = async (year: number, token?: string): Promise<DashboardOverviewResponse> => {
    const response = await api.get("/dashboard/agent-overview", {
        params: { year },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
};
