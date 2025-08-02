import { qaData } from './qaData'

// Stopwords giữ lại WH-words (what, how, why...)
const STOP_WORDS = new Set([
  'is', 'the', 'a', 'an', 'do', 'you', 'i', 'can', 'are',
  'to', 'of', 'and', 'in', 'on', 'for', 'with', 'be', 'have', 'has'
])

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // remove punctuation
    .split(/\s+/)
    .filter(word => word && !STOP_WORDS.has(word))
}

function countSequentialMatches(a: string[], b: string[]): number {
  let count = 0
  for (let i = 0; i < a.length - 1; i++) {
    if (b.includes(a[i]) && b.includes(a[i + 1])) {
      count++
    }
  }
  return count
}

export function findBestAnswer(userQuestion: string): string | null {
  const cleaned = userQuestion.trim().toLowerCase()

  // Step 1: Exact match
  for (const item of qaData) {
    if (item.question.trim().toLowerCase() === cleaned) {
      return item.answer
    }
  }

  const userTokens = tokenize(cleaned)
  if (userTokens.length === 0) return null

  let bestMatch = null
  let bestScore = 0

  for (const item of qaData) {
    const qaTokens = tokenize(item.question)
    const commonWords = qaTokens.filter(word => userTokens.includes(word))
    const matchRatio = commonWords.length / Math.max(userTokens.length, qaTokens.length)

    const sequenceBonus = countSequentialMatches(userTokens, qaTokens) * 0.05

    const totalScore = matchRatio + sequenceBonus

    if (totalScore > bestScore) {
      bestScore = totalScore
      bestMatch = item.answer
    }
  }

  // Step 3: Threshold to avoid false match
  const MIN_SCORE_THRESHOLD = 0.25
  return bestScore >= MIN_SCORE_THRESHOLD ? bestMatch : null
}
