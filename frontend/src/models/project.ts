export interface Project {

  id: string;


  code: string;

  name: string;

  shortName?: string;

  description?: string;



  companyId: string;

  plantId?: string;



  contractNo?: string;

  client?: string;

  contractor?: string;

  consultant?: string;



  startDate: string;

  finishDate?: string;

  endDate?: string;



  budget: number;

  actualCost: number;

  currency: string;



  progress: number;

  spi: number;

  cpi: number;



  status?: string;


  isActive: boolean;



  createdAt?: string;

  updatedAt?: string;

}