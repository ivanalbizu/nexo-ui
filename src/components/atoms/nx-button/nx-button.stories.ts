import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-button.ts';
import type { ButtonVariant, ButtonSize } from './nx-button.ts';

interface ButtonArgs {
  variant: ButtonVariant;
  size: ButtonSize;
  disabled: boolean;
  autoContrast: boolean;
  label: string;
}

const meta: Meta<ButtonArgs> = {
  title: 'Atoms/NxButton',
  component: 'nx-button',
  argTypes: {
    variant:      { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size:         { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled:     { control: 'boolean' },
    autoContrast: { control: 'boolean', description: 'Usa CSS `contrast-color()` para calcular el color del texto del variant primary contra `--nx-color-primary`. Sólo aplica en navegadores con soporte; si no, mantiene `--nx-color-text-inverse` como fallback.' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Botón multipropósito con variantes primary, secondary y ghost. Soporta tres tamaños, estado desactivado y contraste automático (`auto-contrast`) en navegadores con soporte para `contrast-color()`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<ButtonArgs>;

const renderButton = ({ variant, size, disabled, autoContrast, label }: ButtonArgs) => html`
  <nx-button
    variant=${variant}
    size=${size}
    ?disabled=${disabled}
    ?auto-contrast=${autoContrast}
  >${label}</nx-button>
`;

export const Default: Story = {
  args: { variant: 'primary', size: 'md', disabled: false, autoContrast: false, label: 'Ver tarifas' },
  render: renderButton,
};

export const Secondary: Story = {
  args: { variant: 'secondary', size: 'md', disabled: false, autoContrast: false, label: 'Más información' },
  render: renderButton,
};

export const Ghost: Story = {
  args: { variant: 'ghost', size: 'md', disabled: false, autoContrast: false, label: 'Cancelar' },
  render: renderButton,
};

export const Small: Story = {
  args: { variant: 'primary', size: 'sm', disabled: false, autoContrast: false, label: 'Pequeño' },
  render: renderButton,
};

export const Large: Story = {
  args: { variant: 'primary', size: 'lg', disabled: false, autoContrast: false, label: 'Botón grande' },
  render: renderButton,
};

export const Disabled: Story = {
  args: { variant: 'primary', size: 'md', disabled: true, autoContrast: false, label: 'No disponible' },
  render: renderButton,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;gap:1rem;align-items:center;flex-wrap:wrap;">
      <nx-button variant="primary">Primary</nx-button>
      <nx-button variant="secondary">Secondary</nx-button>
      <nx-button variant="ghost">Ghost</nx-button>
    </div>
  `,
};

/**
 * Demo de `auto-contrast`. Cada botón sobrescribe `--nx-color-primary` con un
 * color de fondo distinto; con `auto-contrast` activo, el texto se ajusta a
 * blanco o negro según el contraste. En navegadores sin soporte para
 * `contrast-color()` todos mantienen el color de fallback.
 */
export const AutoContrast: Story = {
  name: 'Auto-contrast (demo)',
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;">
      ${[
        { bg: '#0f172a', name: 'Navy' },
        { bg: '#e4002b', name: 'Rojo' },
        { bg: '#00a862', name: 'Verde' },
        { bg: '#ff7900', name: 'Naranja' },
        { bg: '#fde047', name: 'Amarillo' },
        { bg: '#f8fafc', name: 'Blanco' },
      ].map(({ bg, name }) => html`
        <div style="display:flex;flex-direction:column;gap:0.5rem;align-items:center;">
          <nx-button auto-contrast style=${`--nx-color-primary:${bg};`}>${name}</nx-button>
          <span style="font-family:sans-serif;font-size:0.75rem;color:#64748b;">${bg}</span>
        </div>
      `)}
    </div>
    <p style="margin-top:1.5rem;font-family:sans-serif;font-size:0.8125rem;color:#64748b;max-width:520px;">
      Si tu navegador no soporta <code>contrast-color()</code>, todos se verán con
      el color de fallback (<code>--nx-color-text-inverse</code>).
    </p>
  `,
};
