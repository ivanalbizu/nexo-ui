import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-alert.ts';
import type { AlertVariant } from './nx-alert.ts';

interface AlertArgs { variant: AlertVariant; title: string; dismissible: boolean; message: string; }

const meta: Meta<AlertArgs> = {
  title: 'Molecules/NxAlert',
  component: 'nx-alert',
  argTypes: {
    variant:     { control: 'select', options: ['info','success','warning','error'] },
    dismissible: { control: 'boolean' },
  },
  parameters: { docs: { description: { component: 'Alerta contextual con 4 variantes semánticas. Soporta título, mensaje rich-text (slot) y botón de cierre.' } } },
};
export default meta;
type Story = StoryObj<AlertArgs>;

export const Default: Story = {
  args: { variant: 'info', title: 'Información', dismissible: false, message: 'Tu suscripción se renovará automáticamente el próximo mes.' },
  render: ({ variant, title, dismissible, message }) =>
    html`<nx-alert variant=${variant} title=${title} ?dismissible=${dismissible}>${message}</nx-alert>`,
};

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:0.75rem;max-width:480px;">
      <nx-alert variant="info"    title="Información">Los cambios se aplicarán en el próximo ciclo de facturación.</nx-alert>
      <nx-alert variant="success" title="¡Listo!">Tu plan ha sido actualizado correctamente.</nx-alert>
      <nx-alert variant="warning" title="Atención">Tu tarjeta expira en 7 días. Actualízala para evitar interrupciones.</nx-alert>
      <nx-alert variant="error"   title="Error">No se ha podido procesar el pago. Comprueba los datos de tu tarjeta.</nx-alert>
    </div>
  `,
};

export const Dismissible: Story = {
  args: { variant: 'success', title: '¡Plan activado!', dismissible: true, message: 'Ya tienes acceso a todas las funciones del plan Pro.' },
  render: ({ variant, title, dismissible, message }) =>
    html`<nx-alert variant=${variant} title=${title} ?dismissible=${dismissible} style="max-width:480px;">${message}</nx-alert>`,
};
