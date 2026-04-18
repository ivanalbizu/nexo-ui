import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-card.ts';

interface CardArgs {
  interactive: boolean;
}

const meta: Meta<CardArgs> = {
  title: 'Molecules/NxCard',
  component: 'nx-card',
  argTypes: {
    interactive: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Contenedor de tarjeta genérico con slots para media, contenido principal y footer. Soporta modo interactivo con hover elevado.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<CardArgs>;

export const Default: Story = {
  args: { interactive: false },
  render: ({ interactive }) => html`
    <nx-card ?interactive=${interactive} style="max-width:320px;">
      <h3 style="margin:0 0 0.5rem;font-family:var(--nx-font-sans);color:var(--nx-color-text);">Título de la tarjeta</h3>
      <p style="margin:0;color:var(--nx-color-text-muted);font-family:var(--nx-font-sans);">
        Descripción breve del contenido de la tarjeta. Puede incluir cualquier elemento HTML.
      </p>
    </nx-card>
  `,
};

export const WithFooter: Story = {
  render: () => html`
    <nx-card style="max-width:320px;">
      <h3 style="margin:0 0 0.5rem;font-family:var(--nx-font-sans);color:var(--nx-color-text);">Con footer</h3>
      <p style="margin:0;color:var(--nx-color-text-muted);font-family:var(--nx-font-sans);">Contenido principal de la tarjeta.</p>
      <div slot="footer" style="display:flex;justify-content:flex-end;">
        <button style="padding:0.5rem 1rem;background:var(--nx-color-primary);color:#fff;border:none;border-radius:var(--nx-radius-full);cursor:pointer;font-family:var(--nx-font-sans);">Acción</button>
      </div>
    </nx-card>
  `,
};

export const Interactive: Story = {
  args: { interactive: true },
  render: ({ interactive }) => html`
    <nx-card ?interactive=${interactive} style="max-width:320px;">
      <h3 style="margin:0 0 0.5rem;font-family:var(--nx-font-sans);color:var(--nx-color-text);">Tarjeta interactiva</h3>
      <p style="margin:0;color:var(--nx-color-text-muted);font-family:var(--nx-font-sans);">Pasa el ratón sobre esta tarjeta para ver el efecto hover.</p>
    </nx-card>
  `,
};
