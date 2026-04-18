import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-footer.ts';
import type { FooterGroup, FooterLink } from './nx-footer.ts';

const GROUPS: FooterGroup[] = [
  { title: 'Producto', links: [
    { label: 'Planes',         href: '/planes' },
    { label: 'Funcionalidades', href: '/funcionalidades' },
    { label: 'Novedades',       href: '/novedades' },
  ]},
  { title: 'Empresa', links: [
    { label: 'Sobre nosotros', href: '/sobre-nosotros' },
    { label: 'Blog',           href: '/blog' },
    { label: 'Trabaja con nosotros', href: '/empleo' },
  ]},
  { title: 'Soporte', links: [
    { label: 'Centro de ayuda', href: '/ayuda' },
    { label: 'Contacto',        href: '/contacto' },
    { label: 'Estado del servicio', href: '/estado' },
  ]},
];

const LEGAL: FooterLink[] = [
  { label: 'Privacidad',    href: '/privacidad' },
  { label: 'Términos',      href: '/terminos' },
  { label: 'Cookies',       href: '/cookies' },
];

const meta: Meta = {
  title: 'Organisms/NxFooter',
  component: 'nx-footer',
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: 'Footer multi-columna con grupos de enlaces, copyright y links legales. Totalmente responsive.' } },
  },
};
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <nx-footer
      brandName="nexo"
      tagline="Servicios digitales para empresas que quieren crecer."
      .groups=${GROUPS}
      .legalLinks=${LEGAL}
    ></nx-footer>
  `,
};

export const Minimal: Story = {
  render: () => html`
    <nx-footer brandName="nexo" .groups=${[]} .legalLinks=${[]}></nx-footer>
  `,
};
