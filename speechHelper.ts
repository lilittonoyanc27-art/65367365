/**
 * Web Speech API helper for pronouncing Spanish words and lyrics.
 */
export function speakSpanish(text: string, rate = 0.85): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis is not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate; // Slightly slower for language learners
  utterance.pitch = 1.0;

  // Try to find a Spanish voice (preferably Latin American or Spain)
  const voices = window.speechSynthesis.getVoices();
  const esVoice =
    voices.find((v) => v.lang.startsWith('es-UY') || v.lang.startsWith('es-AR')) ||
    voices.find((v) => v.lang.startsWith('es-419')) ||
    voices.find((v) => v.lang.startsWith('es'));

  if (esVoice) {
    utterance.voice = esVoice;
    utterance.lang = esVoice.lang;
  } else {
    utterance.lang = 'es-ES';
  }

  window.speechSynthesis.speak(utterance);
}
