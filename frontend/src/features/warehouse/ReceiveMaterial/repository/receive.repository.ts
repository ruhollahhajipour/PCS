import { BaseCRUDRepository } from "../../../../core/repositories";
import type { ReceiveMaterial } from "../types/receive";

export class ReceiveRepository
  extends BaseCRUDRepository<ReceiveMaterial> {

  constructor() {
    super("pcs_receive_material");
  }

}

export const receiveRepository =
  new ReceiveRepository();