export interface MonthlyListing {
    month: string;
    total: number;
}

export interface AgentDashboardOverview {
    totalProperty: number;
    activeProperty: number;
    upCommingSiteViste: number;
    selectedYear: number;
    totalListingsByMonth: MonthlyListing[];
}

export interface DashboardOverviewResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: AgentDashboardOverview;
}
