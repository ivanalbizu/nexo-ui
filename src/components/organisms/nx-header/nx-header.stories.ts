import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-header.ts';
import type { NavItem } from './nx-header.ts';

interface HeaderArgs { brandName: string; ctaPrimaryLabel: string; ctaSecondaryLabel: string; }

const NAV: NavItem[] = [
  { label: 'Inicio',    href: '/' },
  { label: 'Planes',    href: '/planes', active: true },
  { label: 'Blog',      href: '/blog' },
  { label: 'Contacto',  href: '/contacto' },
];

const meta: Meta<HeaderArgs> = {
  title: 'Organisms/NxHeader',
  component: 'nx-header',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Cabecera sticky con logo, navegación principal y CTAs. Responsive con menú hamburguesa en mobile.' } },
  },
};
export default meta;
type Story = StoryObj<HeaderArgs>;

export const Default: Story = {
  args: { brandName: 'nexo', ctaPrimaryLabel: 'Empezar gratis', ctaSecondaryLabel: 'Iniciar sesión' },
  render: ({ brandName, ctaPrimaryLabel, ctaSecondaryLabel }) => html`
    <nx-header
      brandName=${brandName}
      ctaPrimaryLabel=${ctaPrimaryLabel}
      ctaSecondaryLabel=${ctaSecondaryLabel}
      .navItems=${NAV}
    ></nx-header>
  `,
};

export const Minimal: Story = {
  render: () => html`<nx-header brandName="nexo" .navItems=${NAV}></nx-header>`,
};

export const NoNav: Story = {
  render: () => html`
    <nx-header
      brandName="nexo"
      ctaPrimaryLabel="Empezar gratis"
      .navItems=${[]}
    ></nx-header>
  `,
};
