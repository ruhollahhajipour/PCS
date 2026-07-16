import type { User } from "../../../models/user";

const users: User[] = [
  {
    id: 1,
    companyId: 1,
    plantId: 1,
    projectId: 1,
    username: "admin",
    fullName: "Administrator",
    email: "admin@kgn.ir",
    mobile: "09120000000",
    department: "IT",
    position: "System Administrator",
    role: "Admin",
    status: "Active",
    lastLogin: "2026-07-15 08:00",
    createdAt: "2026-01-01",
    updatedAt: "2026-07-15",
  },
  {
    id: 2,
    companyId: 1,
    plantId: 1,
    projectId: 2,
    username: "planner",
    fullName: "Planning Engineer",
    email: "planner@kgn.ir",
    mobile: "09121111111",
    department: "Planning",
    position: "Planning Engineer",
    role: "Engineer",
    status: "Active",
    lastLogin: "2026-07-14 16:20",
    createdAt: "2026-01-10",
    updatedAt: "2026-07-14",
  },
];

class UserService {
  async getAll(): Promise<User[]> {
    return Promise.resolve(users);
  }

  async getById(id: number): Promise<User | undefined> {
    return Promise.resolve(users.find((u) => u.id === id));
  }

  async create(user: User): Promise<User> {
    users.push(user);
    return Promise.resolve(user);
  }

  async update(user: User): Promise<User> {
    const index = users.findIndex((u) => u.id === user.id);

    if (index >= 0) {
      users[index] = user;
    }

    return Promise.resolve(user);
  }

  async delete(id: number): Promise<void> {
    const index = users.findIndex((u) => u.id === id);

    if (index >= 0) {
      users.splice(index, 1);
    }

    return Promise.resolve();
  }
}

export default new UserService();