import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-input.ts';
import type { InputType } from './nx-input.ts';

interface InputArgs {
  type: InputType;
  label: string;
  placeholder: string;
  error: string;
  disabled: boolean;
  required: boolean;
  value: string;
}

const meta: Meta<InputArgs> = {
  title: 'Atoms/NxInput',
  component: 'nx-input',
  argTypes: {
    type:     { control: 'select', options: ['text','email','password','number','tel','url','search'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Input nativo con `formAssociated + ElementInternals`.',
          'Auto-genera un UID por instancia para vincular `<label for>` ↔ `<input id>` dentro del Shadow DOM.',
          '`aria-describedby` apunta al mensaje de error. `setValidity` recibe la referencia al `<input>` para anclar el tooltip nativo.',
          'Se puede usar standalone (label + error integrados) o dentro de `nx-form-field`.',
        ].join(' '),
      },
    },
  },
};
export default meta;
type Story = StoryObj<InputArgs>;

export const Default: Story = {
  args: { type: 'text', label: 'Nombre', placeholder: 'Tu nombre completo', error: '', disabled: false, required: false, value: '' },
  render: ({ type, label, placeholder, error, disabled, required, value }) => html`
    <nx-input
      type=${type}
      label=${label}
      placeholder=${placeholder}
      error=${error}
      ?disabled=${disabled}
      ?required=${required}
      value=${value}
      style="max-width:360px;display:block;"
    ></nx-input>
  `,
};

export const WithError: Story = {
  args: { type: 'email', label: 'Correo electrónico', placeholder: 'tu@empresa.com', error: 'Introduce un email válido.', disabled: false, required: true, value: 'no-es-email' },
  render: ({ type, label, placeholder, error, required, value }) => html`
    <nx-input
      type=${type}
      label=${label}
      placeholder=${placeholder}
      error=${error}
      ?required=${required}
      value=${value}
      style="max-width:360px;display:block;"
    ></nx-input>
  `,
};

export const Required: Story = {
  args: { type: 'text', label: 'Empresa', placeholder: 'Nombre de tu empresa', error: '', disabled: false, required: true, value: '' },
  render: ({ type, label, placeholder, required }) => html`
    <nx-input
      type=${type}
      label=${label}
      placeholder=${placeholder}
      ?required=${required}
      style="max-width:360px;display:block;"
    ></nx-input>
  `,
};

export const Disabled: Story = {
  args: { type: 'text', label: 'Plan actual', placeholder: '', error: '', disabled: true, required: false, value: 'Pro · Mensual' },
  render: ({ type, label, disabled, value }) => html`
    <nx-input
      type=${type}
      label=${label}
      ?disabled=${disabled}
      value=${value}
      style="max-width:360px;display:block;"
    ></nx-input>
  `,
};

export const HiddenLabel: Story = {
  render: () => html`
    <nx-input
      label="Buscar"
      ?hide-label=${true}
      placeholder="Buscar…"
      type="search"
      style="max-width:360px;display:block;"
    ></nx-input>
  `,
};

export const Readonly: Story = {
  render: () => html`
    <nx-input
      label="ID de cliente"
      value="CUST-9F4A-2B77"
      ?readonly=${true}
      style="max-width:360px;display:block;"
    ></nx-input>
  `,
};

export const NumberWithConstraints: Story = {
  name: 'Number · con min/max/step',
  render: () => html`
    <nx-input
      type="number"
      label="Cantidad"
      placeholder="1–100"
      min="1"
      max="100"
      step="1"
      value="10"
      style="max-width:360px;display:block;"
    ></nx-input>
  `,
};

export const WithPrefixSuffix: Story = {
  name: 'Con slots prefix / suffix',
  parameters: { docs: { description: { story: 'Los slots `prefix` y `suffix` aceptan cualquier contenido (iconos SVG, texto, …). El componente reacciona vía `slotchange` y añade padding lateral automáticamente.' } } },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1rem;max-width:360px;">
      <nx-input type="search" label="Buscar" placeholder="Buscar productos…">
        <svg slot="prefix" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
        </svg>
      </nx-input>

      <nx-input type="email" label="Email" placeholder="tu@empresa.com">
        <svg slot="prefix" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 5L2 7"/>
        </svg>
      </nx-input>

      <nx-input type="number" label="Precio" placeholder="0.00" min="0" step="0.01">
        <span slot="prefix" style="font-weight:600;">€</span>
        <span slot="suffix" style="font-size:0.8125rem;opacity:0.7;">IVA incl.</span>
      </nx-input>
    </div>
  `,
};

export const AllTypes: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1rem;max-width:360px;">
      <nx-input type="text"     label="Texto"       placeholder="Texto libre"></nx-input>
      <nx-input type="email"    label="Email"        placeholder="tu@email.com"></nx-input>
      <nx-input type="password" label="Contraseña"   placeholder="••••••••"></nx-input>
      <nx-input type="number"   label="Número"       placeholder="0"></nx-input>
      <nx-input type="tel"      label="Teléfono"     placeholder="+34 600 000 000"></nx-input>
      <nx-input type="search"   label="Búsqueda"     placeholder="Buscar…" ?hide-label=${true}></nx-input>
    </div>
  `,
};
