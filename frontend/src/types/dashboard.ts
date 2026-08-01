export interface DashboardCard {
  title: string;

  value: number | string;

  color: string;

  icon?: string;

  change?: number;
}

export interface DashboardChartPoint {
  name: string;

  value: number;
}

export interface DashboardTrendPoint {
  month: string;

  value: number;
}

export interface RecentActivity {
  id: number;

  title: string;

  user: string;

  date: string;
}