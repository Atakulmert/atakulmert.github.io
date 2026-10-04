/**
 * Dokunmatik cihazlarda / dar ekranda telefon ekranı 3D CSS (drei <Html transform>) ile çizilmez:
 * iOS Safari matrix3d + perspective'i telefonun camıyla hizalı çizmiyor ve dokunuşları yanlış yere iletiyor.
 * Bunun yerine Phone her karede ekranın köşelerini projekte eder ve bu katmanı yalnızca
 * 2D translate + scale ile oraya oturtur (App → TrackedScreen).
 */
export const screenOverlay = { el: null as HTMLElement | null }

export const useTrackedScreen = (width: number) =>
  width < 760 || (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)
