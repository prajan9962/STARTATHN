import { OverlayCoordinates } from '../types/certificate';

// Default percentage coordinates (0% to 100%) for accurate placement
export const DEFAULT_OVERLAY_COORDINATES: OverlayCoordinates = {
  name: {
    x: 50,
    y: 50.5,
    fontSize: 28, // Relative base points
    align: 'center'
  },
  department: {
    x: 50,
    y: 58.0,
    fontSize: 22,
    align: 'center'
  },
  team: {
    x: 50,
    y: 65.0,
    fontSize: 21,
    align: 'center'
  },
  certId: {
    x: 86.0,
    y: 11.5,
    fontSize: 12,
    align: 'right'
  },
  qrCode: {
    x: 86.5,
    y: 77.0,
    size: 11.5 // Percent of width
  }
};

const STORAGE_KEY = 'startathon_overlay_coords_v1';

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
