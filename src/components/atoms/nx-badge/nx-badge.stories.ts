import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-badge.ts';
import type { BadgeVariant, BadgeSize } from './nx-badge.ts';

interface BadgeArgs { variant: BadgeVariant; size: BadgeSize; dot: boolean; label: string; }

const meta: Meta<BadgeArgs> = {
  title: 'Atoms/NxBadge',
  component: 'nx-badge',
  argTypes: {
    variant: { control: 'select', options: ['primary','accent','success','warning','error','info','neutral'] },
    size:    { control: 'select', options: ['sm','md'] },
    dot:     { control: 'boolean' },
  },
  parameters: { docs: { description: { component: 'Etiqueta de estado pequeña. Soporta 7 variantes semánticas, tamaño y punto indicador. Cambia de forma con la marca activa vía `--nx-badge-radius`.' } } },
};
export default meta;
type Story = StoryObj<BadgeArgs>;

export const Default: Story = {
  args: { variant: 'primary', size: 'md', dot: false, label: 'Nuevo' },
  render: ({ variant, size, dot, label }) =>
    html`<nx-badge variant=${variant} size=${size} ?dot=${dot}>${label}</nx-badge>`,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
      <nx-badge variant="primary">Primary</nx-badge>
      <nx-badge variant="accent">Accent</nx-badge>
      <nx-badge variant="success">Success</nx-badge>
      <nx-badge variant="warning">Warning</nx-badge>
      <nx-badge variant="error">Error</nx-badge>
      <nx-badge variant="info">Info</nx-badge>
      <nx-badge variant="neutral">Neutral</nx-badge>
    </div>
  `,
};

export const WithDot: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-items:center;">
      <nx-badge variant="success" dot>Activo</nx-badge>
      <nx-badge variant="warning" dot>Pendiente</nx-badge>
      <nx-badge variant="error"   dot>Inactivo</nx-badge>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;align-items:center;">
      <nx-badge size="sm">Small</nx-badge>
      <nx-badge size="md">Medium</nx-badge>
    </div>
  `,
};
