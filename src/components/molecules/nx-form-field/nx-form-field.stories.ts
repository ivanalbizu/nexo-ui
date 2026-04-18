import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-form-field.ts';
import '@/components/atoms/nx-input/nx-input.js';

interface FormFieldArgs { label: string; hint: string; error: string; required: boolean; }

const meta: Meta<FormFieldArgs> = {
  title: 'Molecules/NxFormField',
  component: 'nx-form-field',
  argTypes: { required: { control: 'boolean' } },
  parameters: { docs: { description: { component: 'Envuelve cualquier control de formulario añadiendo label accesible, hint y mensaje de error.' } } },
};
export default meta;
type Story = StoryObj<FormFieldArgs>;

export const Default: Story = {
  args: { label: '', hint: 'Nunca compartiremos tu email.', error: '', required: false },
  render: ({ hint, error, required }) => html`
    <nx-form-field hint=${hint} error=${error} ?required=${required} style="max-width:360px;display:block;">
      <nx-input type="email" label="Correo electrónico" placeholder="tu@empresa.com" ?required=${required}></nx-input>
    </nx-form-field>
  `,
};

export const WithError: Story = {
  args: { label: '', hint: '', error: 'Introduce un email válido.', required: true },
  render: ({ error }) => html`
    <nx-form-field style="max-width:360px;display:block;">
      <nx-input type="email" label="Correo electrónico" placeholder="tu@empresa.com" value="no-valido" error=${error} required></nx-input>
    </nx-form-field>
  `,
};

export const FullForm: Story = {
  render: () => html`
    <form style="display:flex;flex-direction:column;gap:1.25rem;max-width:400px;">
      <nx-input label="Nombre"       placeholder="Tu nombre"        required></nx-input>
      <nx-input label="Email"        placeholder="tu@email.com"     type="email" required></nx-input>
      <nx-input label="Contraseña"   placeholder="••••••••"         type="password" required></nx-input>
    </form>
  `,
};
