export type ExportReportValue = string | number | boolean | null | undefined;

export interface PieChartValue {
  fill: string;
  [key: string]: string | number;
}

export interface CardInfoValue {
  [key: string]: number;
}

export interface ChartAreaValue {
  [key: string]: string | number;
}

export interface BarChartValue {
  [key: string]: string | number;
}
