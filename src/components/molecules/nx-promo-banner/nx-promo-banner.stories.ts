import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-promo-banner.ts';
import { mockBanners } from '@/mocks/banners.js';

interface BannerArgs { title: string; subtitle: string; ctaLabel: string; expiresAt: string; }

const meta: Meta<BannerArgs> = {
  title: 'Molecules/NxPromoBanner',
  component: 'nx-promo-banner',
  parameters: { docs: { description: { component: 'Banner promocional con gradiente de marca, CTA y fecha de expiración. El gradiente usa `--nx-color-primary` + `--nx-color-accent` para adaptarse automáticamente a cada marca.' } } },
};
export default meta;
type Story = StoryObj<BannerArgs>;

const [b] = mockBanners;

export const Default: Story = {
  args: { title: b.title, subtitle: b.subtitle ?? '', ctaLabel: b.ctaLabel, expiresAt: b.expiresAt ?? '' },
  render: ({ title, subtitle, ctaLabel, expiresAt }) => html`
    <nx-promo-banner
      title=${title}
      subtitle=${subtitle}
      ctaLabel=${ctaLabel}
      expiresAt=${expiresAt}
    ></nx-promo-banner>
  `,
};

export const Minimal: Story = {
  render: () => html`
    <nx-promo-banner
      title="Prueba Pro gratis 14 días"
      ctaLabel="Empezar gratis"
    ></nx-promo-banner>
  `,
};

export const NoCta: Story = {
  render: () => html`
    <nx-promo-banner
      title="Nueva integración disponible"
      subtitle="Conecta tu CRM favorito en un solo clic."
      ctaLabel=""
    ></nx-promo-banner>
  `,
};
