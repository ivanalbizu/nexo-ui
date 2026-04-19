import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-presenter-avatar.js';
import type { PresenterSize } from './nx-presenter-avatar.js';

interface Args { name: string; role: string; photo: string; size: PresenterSize; }

const meta: Meta<Args> = {
  title: 'Atoms/NxPresenterAvatar',
  component: 'nx-presenter-avatar',
  argTypes: { size: { control: 'select', options: ['sm', 'md', 'lg'] } },
  parameters: { docs: { description: { component: 'Avatar circular con halo de color acento + nombre y rol. Hereda `--nx-color-accent` del contenedor para respetar la marca.' } } },
};
export default meta;
type Story = StoryObj<Args>;

const DARK = 'style="background:#0a0a0a;padding:2rem;display:inline-flex;gap:2rem;"';

export const Default: Story = {
  args: { name: 'Anónimo Uno', role: 'Creadora de contenido', photo: '', size: 'md' },
  render: ({ name, role, photo, size }) => html`
    <div ${DARK}>
      <nx-presenter-avatar name=${name} role=${role} photo=${photo} size=${size}></nx-presenter-avatar>
    </div>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div ${DARK} style="background:#0a0a0a;padding:2rem;display:inline-flex;gap:2rem;align-items:flex-start;">
      <nx-presenter-avatar size="sm" name="Small"  role="rol"></nx-presenter-avatar>
      <nx-presenter-avatar size="md" name="Medium" role="rol"></nx-presenter-avatar>
      <nx-presenter-avatar size="lg" name="Large"  role="rol"></nx-presenter-avatar>
    </div>
  `,
};

export const AccentOverride: Story = {
  render: () => html`
    <div style="background:#0a0a0a;padding:2rem;display:inline-flex;gap:2rem;">
      <nx-presenter-avatar style="--nx-color-accent:#e4002b"  name="Rojo"     role="Therabody"></nx-presenter-avatar>
      <nx-presenter-avatar style="--nx-color-accent:#00a862"  name="Verde"    role="Xiaomi"></nx-presenter-avatar>
      <nx-presenter-avatar style="--nx-color-accent:#ff7900"  name="Naranja"  role="Orange"></nx-presenter-avatar>
    </div>
  `,
};
