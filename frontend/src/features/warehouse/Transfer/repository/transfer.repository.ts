import { BaseCRUDRepository } from "../../../../core/repositories";
import type { TransferMaterial } from "../types/transfer";

export class TransferRepository
  extends BaseCRUDRepository<TransferMaterial> {

  constructor() {
    super("pcs_transfer_material");
  }

}

export const transferRepository =
  new TransferRepository();