import { PaginationMeta } from '../modules/common/interfaces/api-response.interface';

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit) || 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export function getSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function sanitizeUser<T extends { password?: string }>(
  user: T,
): Omit<T, 'password'> {
  const { password: _, ...rest } = user;
  return rest;
}
