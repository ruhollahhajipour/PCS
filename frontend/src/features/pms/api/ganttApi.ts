import http from "../../../api/http";

export interface GanttActivity {
  id: string;
  code: string;
  name: string;
  start: number;
  finish: number;
  duration: number;
  progress: number;
  float: number;
  isCritical: boolean;
  isMilestone: boolean;
}

export interface GanttProject {
  projectId: string;
  duration: number;
  activities: GanttActivity[];
}

export async function getProjectGantt(
  projectId: string
): Promise<GanttProject> {
  const response = await http.get(
    `/pms/gantt/${projectId}`
  );

  return response.data;
}