import type { Project } from "../../../models/project";


type ProjectAnalytics = {

  total: number;

  active: number;

  completed: number;

  delayed: number;

  totalBudget: number;

  actualCost: number;

  averageProgress: number;

  averageSPI: number;

  averageCPI: number;

};



type ProjectExtended = Project & {

  actualCost?: number;

  progress?: number;

  spi?: number;

  cpi?: number;

};



export default function projectAnalytics(
  projects: ProjectExtended[]
): ProjectAnalytics {


  const total = projects.length;


  const active = projects.filter(
    (x) =>
      x.status === "Active"
  ).length;



  const completed = projects.filter(
    (x) =>
      x.status === "Completed"
  ).length;



  const delayed = projects.filter(
    (x) =>
      x.status === "Delayed"
  ).length;



  const totalBudget = projects.reduce(
    (sum, x) =>
      sum + Number(x.budget ?? 0),
    0
  );



  const actualCost = projects.reduce(
    (sum, x) =>
      sum + Number(x.actualCost ?? 0),
    0
  );



  const averageProgress =
    total === 0
      ? 0
      :
      projects.reduce(
        (sum, x) =>
          sum + Number(x.progress ?? 0),
        0
      ) / total;



  const averageSPI =
    total === 0
      ? 0
      :
      projects.reduce(
        (sum, x) =>
          sum + Number(x.spi ?? 0),
        0
      ) / total;



  const averageCPI =
    total === 0
      ? 0
      :
      projects.reduce(
        (sum, x) =>
          sum + Number(x.cpi ?? 0),
        0
      ) / total;



  return {

    total,

    active,

    completed,

    delayed,

    totalBudget,

    actualCost,

    averageProgress,

    averageSPI,

    averageCPI,

  };

}