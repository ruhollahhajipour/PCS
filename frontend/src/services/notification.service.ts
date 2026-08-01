export interface NotificationItem {
  id: number;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  createdAt: string;
}

const notifications: NotificationItem[] = [];

class NotificationService {
  getAll(): NotificationItem[] {
    return notifications;
  }

  push(
    title: string,
    message: string,
    type: NotificationItem["type"] = "info"
  ) {
    notifications.unshift({
      id: Date.now(),
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
    });
  }

  remove(id: number) {
    const index = notifications.findIndex(
      (n) => n.id === id
    );

    if (index >= 0) {
      notifications.splice(index, 1);
    }
  }

  clear() {
    notifications.length = 0;
  }
}

export default new NotificationService();