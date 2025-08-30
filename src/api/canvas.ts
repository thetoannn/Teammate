import { CanvasData, Message, Session } from '@/types/types'
import { ToolInfo } from '@/api/model'
import { BASE_API_URL } from '../constants'

export type ListCanvasesResponse = {
  id: string
  name: string
  description?: string
  thumbnail?: string
  created_at: string
}

export async function listCanvases(): Promise<ListCanvasesResponse[]> {
  alert(BASE_API_URL)
  const response = await fetch(`${BASE_API_URL}/api/canvas/list`)
  return await response.json()
}

export async function createCanvas(data: {
  name: string
  canvas_id: string
  messages: Message[]
  session_id: string
  text_model: {
    provider: string
    model: string
    url: string
  }
  tool_list: ToolInfo[]

  system_prompt: string
}): Promise<{ id: string }> {
  const response = await fetch(`${BASE_API_URL}/api/canvas/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return await response.json()
}

export async function getCanvas(
  id: string
): Promise<{ data: CanvasData; name: string; sessions: Session[] }> {
  const response = await fetch(`${BASE_API_URL}/api/canvas/${id}`)
  return await response.json()
}

export async function saveCanvas(
  id: string,
  payload: {
    data: CanvasData
    thumbnail: string
  }
): Promise<void> {
  const response = await fetch(`${BASE_API_URL}/api/canvas/${id}/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return await response.json()
}

export async function renameCanvas(id: string, name: string): Promise<void> {
  const response = await fetch(`${BASE_API_URL}/api/canvas/${id}/rename`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  })
  return await response.json()
}

export async function deleteCanvas(id: string): Promise<void> {
  const response = await fetch(`${BASE_API_URL}/api/canvas/${id}/delete`, {
    method: 'DELETE',
  })
  return await response.json()
}
