export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  pagination?: PaginationMeta;
}

export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  fees: number;
  pgFees?: number | null;
  rating: number;
  academicScore?: number | null;
  accommodationScore?: number | null;
  facultyScore?: number | null;
  infrastructureScore?: number | null;
  placementScore?: number | null;
  socialLifeScore?: number | null;
  overview: string;
  establishedYear?: number | null;
  createdAt: string;
  _count?: { reviews: number };
}

export interface Course {
  id: string;
  collegeId: string;
  name: string;
  duration: string;
  fees: number;
}

export interface Placement {
  id: string;
  collegeId: string;
  averagePackage: number;
  highestPackage: number;
  placementPercentage: number;
}

export interface Review {
  id: string;
  userId: string;
  collegeId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; name: string };
}

export interface CollegeDetail extends College {
  courses: Course[];
  placement: Placement | null;
  reviews: Review[];
}

export interface CollegeFilters {
  search?: string;
  location?: string;
  state?: string;
  minFees?: number;
  maxFees?: number;
  rating?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CompareCollege {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  establishedYear?: number;
  courses: Pick<Course, "id" | "name" | "duration" | "fees">[];
  placement: {
    averagePackage: number;
    highestPackage: number;
    placementPercentage: number;
  } | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export type NavItem = {
  label: string;
  href: string;
  icon: string;
};
