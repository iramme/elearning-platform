/**
 * Extrait le tableau de résultats d'une réponse API DRF,
 * qu'elle soit paginée ({results: [...]}) ou non (tableau direct).
 */
export function extractResults(data) {
  return data?.results || data || [];
}