import http from "../../../api/http";

const API = "/pms";

class WbsSetupService {
  async downloadTemplate() {
    const response =
      await http.get(
        `${API}/template`,
        {
          responseType: "blob",
        }
      );

    return response.data;
  }

  async importExcel(
    projectId: string,
    file: File
  ) {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    const response =
      await http.post(
        `${API}/import?projectId=${projectId}`,
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
}

export default new WbsSetupService();