import { useApp } from '../context/AppContext'

/*
 * useSpacedRepetition — the shared retention engine (v3).
 *
 * Tracks ANY reviewable item behind one schedule, keyed by `${type}:${itemId}`.
 * Item shape (persisted in AppContext.srs):
 *   { type, itemId, lastReviewedAt, nextDueAt, strength }
 *
 * A simple Leitner-style schedule (3d → 7d → 21d → 45d). Success bumps the
 * strength up (longer interval); failure resets it to the start. Flashcards,
 * module quizzes, Challenge Library and Debugging Gauntlet items all flow
 * through this one engine — no per-feature ad-hoc logic.
 */
export const DAY = 86400000
export const SRS_INTERVALS = [3 * DAY, 7 * DAY, 21 * DAY, 45 * DAY]
export const MASTERED_STRENGTH = 2 // strength at which an item counts as "mastered"

export function srsKey(type, itemId) {
  return `${type}:${itemId}`
}

export function useSpacedRepetition() {
  const { state, dispatch } = useApp()
  const srs = state.srs

  function getItem(type, itemId) {
    return srs[srsKey(type, itemId)] || null
  }

  // Record a review outcome (and seed the item if it's new).
  function review(type, itemId, success) {
    dispatch({ type: 'SRS_REVIEW', srsType: type, itemId, success, now: Date.now() })
  }

  // Ensure an item is scheduled (first review soon) without recording a result.
  function schedule(type, itemId) {
    dispatch({ type: 'SRS_SEED', srsType: type, itemId, now: Date.now() })
  }

  // All items whose nextDueAt has passed, optionally filtered by types.
  function dueItems(now = Date.now(), types = null) {
    return Object.values(srs)
      .filter((it) => it.nextDueAt <= now && (!types || types.includes(it.type)))
      .sort((a, b) => a.nextDueAt - b.nextDueAt)
  }

  function allItems() {
    return Object.values(srs)
  }

  return { srs, getItem, review, schedule, dueItems, allItems, MASTERED_STRENGTH }
}
