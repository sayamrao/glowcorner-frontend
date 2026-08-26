import type { ApiResponse, Category, CategoryUpdatePayload, CategoryCreatePayload } from '~/types'
import { apiClient } from '~/services/api'

export interface BackendCategory {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  sort_order: number
  image_url: string | null
  is_active: boolean
  children: BackendCategory[]
}

export function mapBackendCategory(c: BackendCategory): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    imageUrl: c.image_url || undefined,
    parentId: c.parent_id || undefined,
    children: (c.children || []).map(mapBackendCategory),
    sortOrder: c.sort_order,
    isActive: c.is_active
  }
}

export async function listCategories(activeOnly = true): Promise<Category[]> {
  const response = await apiClient.get<ApiResponse<BackendCategory[]>>(
    '/categories',
    { active_only: activeOnly },
    false,
  )
  return (response.data || []).map(mapBackendCategory)
}

export async function getCategory(id: string): Promise<Category> {
  const response = await apiClient.get<ApiResponse<BackendCategory>>(
    `/categories/${id}`,
    undefined,
    false,
  )
  return mapBackendCategory(response.data)
}


export async function updateCategory(
  categoryId: string,
  payload: CategoryUpdatePayload,
): Promise<Category> {
  const response = await apiClient.put<ApiResponse<Category>>(
    `/categories/${categoryId}`,
    payload,
  )

  return response.data
}

export async function createCategory(
  payload: CategoryCreatePayload,
): Promise<Category> {
  const response = await apiClient.post<ApiResponse<Category>>(
    '/categories',
    payload,
  )

  return response.data.data
}

export async function deleteCategory(
  categoryId: string,
): Promise<void> {
  await apiClient.delete(
    `/categories/${categoryId}`,
  )
}