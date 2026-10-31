export default function statusColor(status: string) {
  switch (status) {
    case "Active":
    case "Approved":
    case "Completed":
    case "Available":
      return "success";

    case "Pending":
    case "Planning":
    case "Low Stock":
      return "warning";

    case "Rejected":
    case "Inactive":
      return "error";

    default:
      return "default";
  }
}