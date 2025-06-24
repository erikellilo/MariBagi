export class User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updateAt: Date;
  createdBy?: string;
  lastUpdateBy?: string;
}
