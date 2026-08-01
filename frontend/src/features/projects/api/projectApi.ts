import api from "../../../services/api";

import type { Project }
from "../../../models/project";





export async function getProjects():

Promise<Project[]> {


  const response =
    await api.get<Project[]>(
      "/Projects"
    );


  return response.data;

}








export async function getProject(

  id:string

):

Promise<Project> {


  const response =
    await api.get<Project>(

      `/Projects/${id}`

    );


  return response.data;

}








export async function createProject(

  project:Project

):

Promise<string> {


  const response =
    await api.post<string>(

      "/Projects",

      project

    );


  return response.data;

}








export async function updateProject(

  project:Project

):

Promise<void> {


  await api.put(

    `/Projects/${project.id}`,

    project

  );


}








export async function deleteProject(

  id:string

):

Promise<void> {


  await api.delete(

    `/Projects/${id}`

  );


}