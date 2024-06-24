export type Role = 'INTERN' | 'ENGINEER' | 'ADMIN';

export type User = {
  id: number | string;
  name: string;
  email: string;
  role: Role;
};

export type UserNoId = Omit<User, 'id'>;

export type UserNoIdOptional = {
  name?: string;
  email?: string;
  role?: Role;
};
