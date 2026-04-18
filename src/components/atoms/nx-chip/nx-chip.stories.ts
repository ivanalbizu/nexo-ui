import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-chip.ts';

interface ChipArgs { selectable: boolean; selected: boolean; removable: boolean; disabled: boolean; label: string; }

const meta: Meta<ChipArgs> = {
  title: 'Atoms/NxChip',
  component: 'nx-chip',
  argTypes: {
    selectable: { control: 'boolean' },
    selected:   { control: 'boolean' },
    removable:  { control: 'boolean' },
    disabled:   { control: 'boolean' },
  },
  parameters: { docs: { description: { component: 'Chip interactivo para filtros, tags y selección múltiple. Emite `nx-chip-change` al seleccionar y `nx-chip-remove` al eliminar.' } } },
};
export default meta;
type Story = StoryObj<ChipArgs>;

export const Default: Story = {
  args: { selectable: false, selected: false, removable: false, disabled: false, label: 'Etiqueta' },
  render: ({ selectable, selected, removable, disabled, label }) =>
    html`<nx-chip ?selectable=${selectable} ?selected=${selected} ?removable=${removable} ?disabled=${disabled}>${label}</nx-chip>`,
};

export const Selectable: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
      <nx-chip selectable>React</nx-chip>
      <nx-chip selectable selected>TypeScript</nx-chip>
      <nx-chip selectable>Lit</nx-chip>
      <nx-chip selectable>Vite</nx-chip>
    </div>
  `,
};

export const Removable: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
      <nx-chip removable>Frontend</nx-chip>
      <nx-chip removable>UI Kit</nx-chip>
      <nx-chip removable>Design System</nx-chip>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <div style="display:flex;gap:0.5rem;">
      <nx-chip selectable disabled>Desactivado</nx-chip>
      <nx-chip selectable selected disabled>Seleccionado</nx-chip>
    </div>
  `,
};
