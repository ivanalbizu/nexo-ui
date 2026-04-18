import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-spinner.ts';
import type { SpinnerSize } from './nx-spinner.ts';

interface SpinnerArgs { size: SpinnerSize; }

const meta: Meta<SpinnerArgs> = {
  title: 'Atoms/NxSpinner',
  component: 'nx-spinner',
  argTypes: { size: { control: 'select', options: ['sm','md','lg'] } },
  parameters: { docs: { description: { component: 'Indicador de carga circular. El color sigue `--nx-color-primary` de la marca activa.' } } },
};
export default meta;
type Story = StoryObj<SpinnerArgs>;

export const Default: Story = {
  args: { size: 'md' },
  render: ({ size }) => html`<nx-spinner size=${size}></nx-spinner>`,
};

export const AllSizes: Story = {
  render: () => html`
    <div style="display:flex;gap:1.5rem;align-items:center;">
      <nx-spinner size="sm"></nx-spinner>
      <nx-spinner size="md"></nx-spinner>
      <nx-spinner size="lg"></nx-spinner>
    </div>
  `,
};

export const InlineWithText: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:0.5rem;font-family:var(--nx-font-sans);color:var(--nx-color-text-muted);">
      <nx-spinner size="sm"></nx-spinner>
      Cargando tarifas…
    </div>
  `,
};
