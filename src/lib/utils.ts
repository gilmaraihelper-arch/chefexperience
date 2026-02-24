import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDistanceToNow(date: Date): string {
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInSecs = Math.floor(diffInMs / 1000)
  const diffInMins = Math.floor(diffInSecs / 60)
  const diffInHours = Math.floor(diffInMins / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInSecs < 60) {
    return 'agora'
  } else if (diffInMins < 60) {
    return `${diffInMins} minutos atrás`
  } else if (diffInHours < 24) {
    return `${diffInHours} horas atrás`
  } else if (diffInDays === 1) {
    return 'ontem'
  } else if (diffInDays < 30) {
    return `${diffInDays} dias atrás`
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30)
    return `${months} meses atrás`
  } else {
    const years = Math.floor(diffInDays / 365)
    return `${years} anos atrás`
  }
}
