import { BaseCRUDRepository } from "../../../../core/repositories";
import type { Issue } from "../types/issue";

export class IssueRepository
  extends BaseCRUDRepository<Issue> {

  constructor() {
    super("pcs_issue_material");
  }

}

export const issueRepository =
  new IssueRepository();