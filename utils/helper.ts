import { FinalPost } from "../components/editor"
import { PostDetail } from "./types"

export const generateFormData = (post: FinalPost) => {
  const formData = new FormData()
  for (const key in post) {
    let value = (post as any)[key]
    if (key === 'tags' && value.trim()) {
      value = JSON.stringify(value.split(',').map((tag: string) => tag.trim()))
    }
    formData.append(key, value)
  }
  return formData
}

export const filterPost = (posts: PostDetail[], postToFilter: PostDetail) => {
  return posts.filter((post) => post.id !== postToFilter.id)
}

export const trimText = (text: string, trimBy: number) => {
  if (text.length > trimBy) {
    return `${text.substring(0, trimBy).trim()}...`;
  }
  return text;
}

export const getFirstLetter = (text?: string) => {
  return (text) ? text[0].toUpperCase() : ''
}

export const getFirstName = (name?: string) => {
  return (name) ? name.split(' ')[0] : ''
}