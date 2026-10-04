import { OverlayCoordinates } from '../types/certificate';

// Default percentage coordinates with text raised ~2cm upward and underlines removed
export const DEFAULT_OVERLAY_COORDINATES: OverlayCoordinates = {
  name: {
    x: 54.5,
    y: 51.2, // Raised ~2cm upward from the former underline
    fontSize: 26,
    align: 'center'
  },
  department: {
    x: 59.0,
    y: 56.4, // Raised ~2cm upward from the former underline
    fontSize: 20,
    align: 'center'
  },
  team: {
    x: 56.2,
    y: 61.2, // Raised ~2cm upward from the former underline
    fontSize: 20,
    align: 'center'
  },
  certId: {
    x: 83.5,
    y: 15.0,
    fontSize: 11,
    align: 'right'
  },
  qrCode: {
    x: 79.5,
    y: 85.5,
    size: 9.5
  }
};

const STORAGE_KEY = 'startathon_overlay_coords_v4';

export function getOverlayCoordinates(): OverlayCoordinates {
  if (typeof window === 'undefined') return DEFAULT_OVERLAY_COORDINATES;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_OVERLAY_COORDINATES, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Could not read overlay coordinates from localStorage', e);
  }
  return DEFAULT_OVERLAY_COORDINATES;
}

export function saveOverlayCoordinates(coords: OverlayCoordinates): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
  } catch (e) {
    console.warn('Could not save overlay coordinates to localStorage', e);
  }
}

export function resetOverlayCoordinates(): OverlayCoordinates {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not reset overlay coordinates', e);
  }
  return DEFAULT_OVERLAY_COORDINATES;
}
