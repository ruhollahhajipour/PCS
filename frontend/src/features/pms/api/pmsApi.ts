import http from "../../../api/http";

// =====================================================
// TYPES
// =====================================================

export interface PmsActivity {
  id: string;
  code: string;
  name: string;

  wbsNodeId: string;
  wbsCode: string;
  wbsName?: string | null;
  wbsLevel: number;

  duration: number;
  remainingDuration: number;

  plannedStart?: string | null;
  plannedFinish?: string | null;

  actualStart?: string | null;
  actualFinish?: string | null;

  constraintType: string;
  constraintDate?: string | null;

  progress: number;

  weightFactor: number;
  weightValue: number;
  weight: number;
  weightedProgress: number;

  budget: number;
  actualCost: number;
  earnedValue: number;
  plannedValue: number;

  costVariance: number;
  scheduleVariance: number;

  cpi: number;
  spi: number;

  earlyStart: number;
  earlyFinish: number;
  lateStart: number;
  lateFinish: number;

  totalFloat: number;
  freeFloat: number;
  drivingFloat: number;

  isCritical: boolean;
  isMilestone: boolean;

  status: string;
}


// =====================================================
// WBS
// =====================================================

export interface WbsNode {
  id: string;

  parentId?: string | null;

  code: string;
  parentCode?: string | null;
  path: string;
  name: string;

  level: number;
  sortOrder: number;

  isActivity: boolean;

  budget: number;
  actualCost: number;
  plannedValue: number;
  earnedValue: number;

  weightFactor: number;
  weightValue: number;
  weight: number;

  progress: number;

  cpi: number;
  spi: number;

  children: WbsNode[];
}


// =====================================================
// DASHBOARD
// =====================================================

export interface PmsDashboard {
  projectId: string;
  projectName: string;

  progress: number;

  budget: number;
  actualCost: number;
  earnedValue: number;

  cpi: number;
  spi: number;

  totalActivities: number;
  completedActivities: number;
}


// =====================================================
// EVM
// =====================================================

export interface PmsEvm {
  projectId: string;
  reportDate: string;
  baselineId: string;
  baselineName: string;
  baselineVersion: number;
  baselineActivityCount: number;
  baselineBudget: number;
  dataQualityNote?: string | null;

  plannedValue: number;
  earnedValue: number;
  actualCost: number;

  scheduleVariance: number;
  costVariance: number;

  spi: number;
  cpi: number;
}

export interface ProjectBaseline {
  id: string;
  projectId: string;
  name: string;
  description?: string | null;
  version: number;
  plannedStart?: string | null;
  plannedFinish?: string | null;
  plannedDuration: number;
  totalBudget: number;
  isApproved: boolean;
  isActive: boolean;
  approvedAt?: string | null;
  approvedBy?: string | null;
  activityCount: number;
}

export interface CreateProjectBaselineRequest {
  name: string;
  description?: string;
}


// =====================================================
// PROGRESS
// =====================================================

export interface ProjectProgress {
  projectId: string;
  progress: number;
}


// =====================================================
// SCHEDULING RESULT
// =====================================================

export interface SchedulingResult {
  [key: string]: unknown;
}


// =====================================================
// IMPORT RESULT
// =====================================================

export interface PmsImportResult {
  success: boolean;
  message: string;
  fileName?: string;
}


// =====================================================
// GET DASHBOARD
// =====================================================

export async function getPmsDashboard(
  projectId: string
): Promise<PmsDashboard> {
  const response = await http.get(
    `/pms/dashboard/${projectId}`
  );

  return response.data;
}


// =====================================================
// GET ACTIVITIES
// =====================================================

export async function getPmsActivities(
  projectId: string
): Promise<PmsActivity[]> {
  const response = await http.get(
    `/pms/${projectId}/activities`
  );

  return response.data;
}


// =====================================================
// GET WBS
// =====================================================

export async function getPmsWbs(
  projectId: string
): Promise<WbsNode[]> {
  const response = await http.get(
    `/pms/${projectId}/wbs`
  );

  return response.data;
}


// =====================================================
// GET EVM
// =====================================================

export async function getPmsEvm(
  projectId: string,
  reportDate?: Date
): Promise<PmsEvm> {
  // Default reports use the same UTC data date as the backend; explicit Date values
  // are treated as calendar dates selected by the user.
  const localReportDate = reportDate
    ? [
        reportDate.getFullYear(),
        String(reportDate.getMonth() + 1).padStart(2, "0"),
        String(reportDate.getDate()).padStart(2, "0"),
      ].join("-")
    : new Date().toISOString().slice(0, 10);

  const response = await http.get(
    `/pms/evm/${projectId}`,
    {
      params: {
        reportDate: localReportDate,
      },
    }
  );

  return response.data;
}


// =====================================================
// PROJECT BASELINES
// =====================================================

export async function getProjectBaselines(
  projectId: string
): Promise<ProjectBaseline[]> {
  const response = await http.get(
    `/pms/${projectId}/baselines`
  );

  return response.data;
}

export async function createProjectBaseline(
  projectId: string,
  request: CreateProjectBaselineRequest
): Promise<ProjectBaseline> {
  const response = await http.post(
    `/pms/${projectId}/baselines`,
    request
  );

  return response.data;
}

export async function approveProjectBaseline(
  projectId: string,
  baselineId: string
): Promise<ProjectBaseline> {
  const response = await http.post(
    `/pms/${projectId}/baselines/${baselineId}/approve`
  );

  return response.data;
}


// =====================================================
// GET PROJECT PROGRESS
// =====================================================

export async function getProjectProgress(
  projectId: string
): Promise<ProjectProgress> {
  const response = await http.get(
    `/pms/progress/project/${projectId}`
  );

  return response.data;
}


// =====================================================
// RUN CPM / SCHEDULING
// =====================================================

export async function runPmsScheduling(
  projectId: string
): Promise<SchedulingResult> {
  const response = await http.post(
    `/pms/scheduling/${projectId}/run`
  );

  return response.data;
}


// =====================================================
// IMPORT PMS EXCEL
// =====================================================

export async function importPmsExcel(
  projectId: string,
  file: File
): Promise<PmsImportResult> {
  const formData = new FormData();

  formData.append(
    "file",
    file
  );

  const response = await http.post(
    `/pms/import?projectId=${projectId}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;
}


// =====================================================
// DOWNLOAD PMS TEMPLATE
// =====================================================

export async function downloadPmsTemplate(): Promise<Blob> {
  const response = await http.get(
    `/pms/template`,
    {
      responseType: "blob",
    }
  );

  return response.data;
}


// =====================================================
// EXPORT PMS EXCEL
// =====================================================

export async function exportPmsExcel(
  projectId: string
): Promise<Blob> {
  const response = await http.get(
    `/pms/export/${projectId}`,
    {
      responseType: "blob",
    }
  );

  return response.data;
}


// =====================================================
// EXPORT PMS PDF
// =====================================================

export async function exportPmsPdf(
  projectId: string
): Promise<Blob> {
  const response = await http.get(
    `/pms/export/${projectId}/pdf`,
    {
      responseType: "blob",
    }
  );

  return response.data;
}
