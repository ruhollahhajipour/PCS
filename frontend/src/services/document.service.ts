import type { Document } from "../models/document";

const documents: Document[] = [
  {
    id: 1,
    companyId: 1,
    plantId: 1,
    projectId: 1,
    documentNo: "DOC-0001",
    title: "Plot Plan",
    discipline: "Civil",
    revision: "A",
    type: "Drawing",
    status: "Approved",
    fileName: "PlotPlan.pdf",
    fileSize: 2540000,
    createdBy: "Planning",
    approvedBy: "Engineering Manager",
    issueDate: "2026-07-01",
    createdAt: "2026-07-01",
    updatedAt: "2026-07-10",
  },
  {
    id: 2,
    companyId: 1,
    plantId: 1,
    projectId: 1,
    documentNo: "DOC-0002",
    title: "P&ID Unit 100",
    discipline: "Process",
    revision: "0",
    type: "Drawing",
    status: "Review",
    fileName: "PID-100.pdf",
    fileSize: 1920000,
    createdBy: "Process",
    approvedBy: "",
    issueDate: "",
    createdAt: "2026-07-05",
    updatedAt: "2026-07-12",
  },
];

class DocumentService {
  async getAll(): Promise<Document[]> {
    return Promise.resolve(documents);
  }

  async getById(
    id: number
  ): Promise<Document | undefined> {
    return Promise.resolve(
      documents.find((d) => d.id === id)
    );
  }

  async create(
    document: Document
  ): Promise<Document> {
    documents.push(document);
    return Promise.resolve(document);
  }

  async update(
    document: Document
  ): Promise<Document> {
    const index = documents.findIndex(
      (d) => d.id === document.id
    );

    if (index >= 0) {
      documents[index] = document;
    }

    return Promise.resolve(document);
  }

  async delete(id: number): Promise<void> {
    const index = documents.findIndex(
      (d) => d.id === id
    );

    if (index >= 0) {
      documents.splice(index, 1);
    }

    return Promise.resolve();
  }
}

export default new DocumentService();