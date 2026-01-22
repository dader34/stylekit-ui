export { cupertinoTheme } from './cupertino';
export { roseGoldTheme } from './roseGold';
export { glassTheme, glassEffects } from './glass';
export { brutalistTheme } from './brutalist';
export { minimalTheme } from './minimal';
export { retrowaveTheme, retrowaveEffects } from './retrowave';
export { darkLuxeTheme, darkLuxeEffects } from './darkLuxe';
export { forestTheme, forestEffects } from './forest';

import { Theme, ThemeName } from '../types/theme';
import { cupertinoTheme } from './cupertino';
import { roseGoldTheme } from './roseGold';
import { glassTheme } from './glass';
import { brutalistTheme } from './brutalist';
import { minimalTheme } from './minimal';
import { retrowaveTheme } from './retrowave';
import { darkLuxeTheme } from './darkLuxe';
import { forestTheme } from './forest';

export const themes: Record<ThemeName, Theme> = {
  cupertino: cupertinoTheme,
  roseGold: roseGoldTheme,
  glass: glassTheme,
  brutalist: brutalistTheme,
  minimal: minimalTheme,
  retrowave: retrowaveTheme,
  darkLuxe: darkLuxeTheme,
  forest: forestTheme,
};

export const themeNames = Object.keys(themes) as ThemeName[];

export const getTheme = (name: ThemeName): Theme => {
  return themes[name] || themes.cupertino;
};
