import { Raw } from 'typeorm';

export const Contains = (query: string) =>
  Raw((alias) => `:query = any(${alias})`, {
    query,
  });
