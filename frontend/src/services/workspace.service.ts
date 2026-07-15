import type {
  Workspace,
} from "../types/workspace";


let workspace: Workspace = {

  company: {
    id: 1,
    code: "COMP-001",
    name: "Default Company",
  },


  plant: {
    id: 1,
    code: "PLANT-001",
    name: "Default Plant",
  },


  project: {
    id: 1,
    code: "PROJECT-001",
    name: "Default Project",
  },

};



class WorkspaceService {


  async get(): Promise<Workspace> {

    return Promise.resolve(
      workspace
    );

  }



  async set(
    data: Workspace
  ): Promise<void> {

    workspace = data;

    return Promise.resolve();

  }



  async reset(): Promise<void> {


    workspace = {

      company: {
        id: 1,
        code: "COMP-001",
        name: "Default Company",
      },


      plant: {
        id: 1,
        code: "PLANT-001",
        name: "Default Plant",
      },


      project: {
        id: 1,
        code: "PROJECT-001",
        name: "Default Project",
      },

    };


    return Promise.resolve();

  }

}



export default new WorkspaceService();