import { qaData } from './qaData'

const STOP_WORDS = new Set([
  'what', 'is', 'the', 'a', 'an', 'do', 'you', 'i', 'can', 'are', 'how', 'to', 'of', 'and', 'in', 'on', 'for'
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // remove punctuation
    .split(/\s+/)
    .filter(word => word && !STOP_WORDS.has(word)) // remove stop words
}

/**
 * Find the best answer based on keyword scoring with stopword filtering.
 * @param userQuestion - The user's question
 * @returns the best matched answer or null
 */
export function findBestAnswer(userQuestion: string): string | null {
  const cleanedUserQuestion = userQuestion.trim().toLowerCase()

  // Check for exact match
  for (const item of qaData) {
    if (item.question.toLowerCase() === cleanedUserQuestion) {
      return item.answer
    }
  }

  const userWords = tokenize(cleanedUserQuestion)

  let bestMatch = null
  let bestScore = 0

  for (const item of qaData) {
    const questionWords = tokenize(item.question)
    const commonWords = questionWords.filter(word => userWords.includes(word))
    const score = commonWords.length

    if (score > bestScore) {
      bestScore = score
      bestMatch = item.answer
    }
  }

  return bestScore > 0 ? bestMatch : null
}