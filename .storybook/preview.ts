/// <reference types="vite/client" />
import type { Preview, Decorator } from '@storybook/web-components-vite';
import '../src/css/tokens.css';
import '../src/css/global.css';

const DARK_BG  = '#0f172a';
const LIGHT_BG = '#f8fafc';

const withColorScheme: Decorator = (story, context) => {
  const raw = context.globals['backgrounds'];
  const bg  = typeof raw === 'object' && raw !== null
    ? String((raw as Record<string, unknown>).value ?? '')
    : String(raw ?? '');

  if (bg === 'dark' || bg === DARK_BG)        document.documentElement.dataset.theme = 'dark';
  else if (bg === 'light' || bg === LIGHT_BG) document.documentElement.dataset.theme = 'light';
  else                                         delete document.documentElement.dataset.theme;

  return story();
};

const withBrand: Decorator = (story, context) => {
  const brand = context.globals['brand'] as string | undefined;
  if (brand && brand !== 'nexo') document.documentElement.dataset.brand = brand;
  else                           delete document.documentElement.dataset.brand;
  return story();
};

const withShape: Decorator = (story, context) => {
  const shape = context.globals['shape'] as string | undefined;
  if (shape) document.documentElement.dataset.shape = shape;
  else       delete document.documentElement.dataset.shape;
  return story();
};

const withDensity: Decorator = (story, context) => {
  const density = context.globals['density'] as string | undefined;
  if (density) document.documentElement.dataset.density = density;
  else         delete document.documentElement.dataset.density;
  return story();
};

const preview: Preview = {
  decorators: [withBrand, withShape, withDensity, withColorScheme],
  tags: ['autodocs'],

  globalTypes: {
    brand: {
      description: 'Marca activa',
      toolbar: {
        title: 'Marca',
        icon: 'paintbrush',
        items: [
          { value: 'nexo',      title: 'Nexo',      right: '🟣' },
          { value: 'corporate', title: 'Corporate', right: '🔵' },
          { value: 'fresh',     title: 'Fresh',     right: '🟢' },
          { value: 'editorial', title: 'Editorial', right: '⬛' },
        ],
        dynamicTitle: true,
      },
    },

    shape: {
      description: 'Forma de los componentes (override sobre el brand)',
      toolbar: {
        title: 'Forma',
        icon: 'circle',
        items: [
          { value: '',        title: 'Brand default', right: '—' },
          { value: 'rounded', title: 'Rounded',       right: '⬤' },
          { value: 'sharp',   title: 'Sharp',         right: '■' },
          { value: 'flat',    title: 'Flat',          right: '▬' },
        ],
        dynamicTitle: true,
      },
    },

    density: {
      description: 'Densidad espacial (override sobre el brand)',
      toolbar: {
        title: 'Densidad',
        icon: 'menu',
        items: [
          { value: '',         title: 'Brand default', right: '—' },
          { value: 'compact',  title: 'Compact',       right: '▤' },
          { value: 'normal',   title: 'Normal',        right: '▥' },
          { value: 'spacious', title: 'Spacious',      right: '▦' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    brand:   'nexo',
    shape:   '',
    density: '',
  },

  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light',  value: LIGHT_BG },
        { name: 'dark',   value: DARK_BG  },
        { name: 'system', value: 'transparent' },
      ],
    },
    a11y: { test: 'todo' },
  },
};

export default preview;
