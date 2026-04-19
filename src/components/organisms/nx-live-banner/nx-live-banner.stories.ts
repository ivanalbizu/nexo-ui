import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-live-banner.js';
import '@/components/atoms/nx-presenter-avatar/nx-presenter-avatar.js';
import '@/components/molecules/nx-coupon-box/nx-coupon-box.js';

type HeadingTag = 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'div'|'p'|'span';

interface Args {
  claim: string;
  claimAs: HeadingTag;
  highlight: string;
  subClaim: string;
  subClaimAs: HeadingTag;
  brandLogo: string;
  brandAlt: string;
  accent: string;
  background: string;
  contentMax: string;
  radius: string;
  autoContrast: boolean;
}

const meta: Meta<Args> = {
  title: 'Organisms/NxLiveBanner',
  component: 'nx-live-banner',
  argTypes: {
    claim:        { control: 'text',   description: 'Texto principal. Use `highlight` para destacar una palabra dentro.' },
    claimAs:      { control: 'select', options: ['h1','h2','h3','h4','h5','h6','div','p','span'], description: 'Etiqueta HTML del claim. Sólo cambia la semántica; la apariencia la define la clase `.claim`.' },
    highlight:    { control: 'text',   description: 'Palabra (primera ocurrencia, case-sensitive) a la que se aplica el color de acento.' },
    subClaim:     { control: 'text',   description: 'Subtítulo opcional bajo el claim.' },
    subClaimAs:   { control: 'select', options: ['h1','h2','h3','h4','h5','h6','div','p','span'], description: 'Etiqueta HTML del sub-claim.' },
    brandLogo:    { control: 'text',   description: 'URL de logo. Si se omite y hay slot `brand`, se usa el slot.' },
    brandAlt:     { control: 'text',   description: 'Alt del logo.' },
    accent:       { control: 'color',  description: 'Color de marca. Sobrescribe `--nx-color-accent` a nivel instancia.' },
    background:   { control: 'color',  description: 'CSS background (color, gradient, url()…). Sobrescribe `--nx-live-banner-bg`.' },
    contentMax:   { control: 'text',   description: 'Ancho máximo del contenido centrado (CSS length). Default 1000px.' },
    radius:       { control: 'text',   description: 'Radio de borde del host (CSS length). Default 0 (full-bleed).' },
    autoContrast: { control: 'boolean', description: 'Recalcula el color del texto con `contrast-color()` contra el `background`. Requiere soporte del navegador y un background de color sólido.' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Shell para banners "Live presentado por". Zonas (slots): `brand` · `claim` · `presenters` · `feature` · `coupon` · `footer` · `decoration`.',
          'El background va a sangre (ocupa el 100 % del ancho del host), mientras que el contenido se centra con un ancho máximo configurable vía `--nx-live-banner-content-max` (default 1000px).',
          'La prop `accent` (o `--nx-color-accent`) tiñe al highlight del claim, los halos de los avatares y el énfasis del cupón.',
        ].join(' '),
      },
    },
  },
};
export default meta;
type Story = StoryObj<Args>;

/** Construye el `style=` del banner a partir de los args de la toolbar. */
const bannerStyle = (a: Partial<Args>) => [
  a.contentMax ? `--nx-live-banner-content-max:${a.contentMax}` : '',
  a.radius     ? `--nx-live-banner-radius:${a.radius}`          : '',
].filter(Boolean).join(';') || undefined;

/* ─── Playground: todos los controles activos, contenido mínimo ───────── */
export const Playground: Story = {
  args: {
    claim: 'Live presentado por',
    claimAs: 'h2',
    highlight: 'Live',
    subClaim: 'Vive la experiencia en directo.',
    subClaimAs: 'p',
    brandLogo: '',
    brandAlt: '',
    accent: '#6d28d9',
    background: '',
    contentMax: '1000px',
    radius: '0',
    autoContrast: false,
  },
  render: (a) => html`
    <nx-live-banner
      accent=${a.accent}
      background=${a.background}
      claim=${a.claim}
      highlight=${a.highlight}
      sub-claim=${a.subClaim}
      claim-as=${a.claimAs}
      sub-claim-as=${a.subClaimAs}
      ?auto-contrast=${a.autoContrast}
      brand-logo=${a.brandLogo}
      brand-alt=${a.brandAlt}
      style=${bannerStyle(a) ?? ''}
    >
      <strong slot="brand" style="font-size:1.125rem;">NEXO</strong>
      <nx-presenter-avatar slot="presenters" name="Ponente 1" role="Ponente"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" name="Ponente 2" role="Ponente"></nx-presenter-avatar>
      <nx-coupon-box slot="coupon" label="Cupón dto." amount="Hasta 30€" footnote="para asistentes"></nx-coupon-box>
    </nx-live-banner>
  `,
};

/* ─── v01 · Rojo (2 presenters, premio) ───────────────────────────────── */
export const Variant01: Story = {
  name: 'v01 · Rojo',
  args: {
    accent: '#e4002b',
    claim: 'Live presentado por',
    highlight: 'Live',
    subClaim: 'Vive la experiencia en directo.',
    background: '',
    contentMax: '',
    radius: '',
    brandLogo: '',
    brandAlt: '',
    claimAs: 'h2',
    subClaimAs: 'p',
    autoContrast: false,
  },
  render: (a) => html`
    <nx-live-banner
      accent=${a.accent}
      background=${a.background}
      claim=${a.claim}
      highlight=${a.highlight}
      sub-claim=${a.subClaim}
      claim-as=${a.claimAs}
      sub-claim-as=${a.subClaimAs}
      ?auto-contrast=${a.autoContrast}
      style=${bannerStyle(a) ?? ''}
    >
      <strong slot="brand" style="font-size:1.25rem;letter-spacing:0.05em;">MARCA A</strong>

      <nx-presenter-avatar slot="presenters" name="Ponente 1" role="Experto técnico"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" name="Ponente 2" role="Creador de contenido"></nx-presenter-avatar>

      <div slot="feature" style="width:100%;aspect-ratio:16/9;background:radial-gradient(circle at 70% 40%, #3a0808 0%, #0a0a0a 75%);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;opacity:0.6;">
        [producto destacado]
      </div>

      <nx-coupon-box slot="coupon"
        emphasis="text"
        label="¡Podrás ganar un premio exclusivo!"
      ></nx-coupon-box>
    </nx-live-banner>
  `,
};

/* ─── v02 · Verde (4 presenters, cupón + feature fuerte) ──────────────── */
export const Variant02: Story = {
  name: 'v02 · Verde',
  args: {
    accent: '#00a862',
    claim: 'Live presentado por',
    highlight: 'Live',
    subClaim: '',
    background: '',
    contentMax: '',
    radius: '',
    brandLogo: '',
    brandAlt: '',
    claimAs: 'h2',
    subClaimAs: 'p',
    autoContrast: false,
  },
  render: (a) => html`
    <nx-live-banner
      accent=${a.accent}
      background=${a.background}
      claim=${a.claim}
      highlight=${a.highlight}
      sub-claim=${a.subClaim}
      claim-as=${a.claimAs}
      sub-claim-as=${a.subClaimAs}
      ?auto-contrast=${a.autoContrast}
      style=${bannerStyle(a) ?? ''}
    >
      <strong slot="brand" style="font-size:1.25rem;letter-spacing:0.15em;">MARCA B</strong>

      <nx-presenter-avatar slot="presenters" size="sm" name="Ponente 1" role="Experto técnico"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" size="sm" name="Ponente 2" role="Creador de contenido"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" size="sm" name="Ponente 3" role="Invitado especial"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" size="sm" name="Ponente 4" role="Invitado especial"></nx-presenter-avatar>

      <div slot="feature" style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;">
        <div style="font-style:italic;font-size:2rem;font-weight:700;">Ultra</div>
        <div>
          <p style="margin:0;font-weight:700;font-size:1.5rem;letter-spacing:0.05em;">Producto destacado</p>
          <p style="margin:0.25rem 0 0;opacity:0.8;font-size:0.875rem;">Categoría principal</p>
        </div>
      </div>

      <nx-coupon-box slot="coupon"
        variant="solid"
        label="Cupón dto. desde 100€"
        footnote="para asistentes"
      ></nx-coupon-box>
    </nx-live-banner>
  `,
};

/* ─── v03 · Naranja (3 presenters, cupón lateral) ─────────────────────── */
export const Variant03: Story = {
  name: 'v03 · Naranja',
  args: {
    accent: '#ff7800',
    claim: 'Live presentado por',
    highlight: 'Live',
    subClaim: '',
    background: '',
    contentMax: '',
    radius: '',
    brandLogo: '',
    brandAlt: '',
    claimAs: 'h2',
    subClaimAs: 'p',
    autoContrast: false,
  },
  render: (a) => html`
    <nx-live-banner
      accent=${a.accent}
      background=${a.background}
      claim=${a.claim}
      highlight=${a.highlight}
      sub-claim=${a.subClaim}
      claim-as=${a.claimAs}
      sub-claim-as=${a.subClaimAs}
      ?auto-contrast=${a.autoContrast}
      style=${bannerStyle(a) ?? ''}
    >
      <strong slot="brand" style="font-size:1.25rem;letter-spacing:0.1em;">MARCA C</strong>

      <nx-presenter-avatar slot="presenters" name="Ponente 1" role="Experto técnico"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" name="Ponente 2" role="Presentador"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" name="Ponente 3" role="Creador de contenido"></nx-presenter-avatar>

      <div slot="feature" style="display:flex;align-items:center;gap:2rem;">
        <div>
          <h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700;">Producto<br/>modelo 2</h3>
          <p style="margin:0;font-size:0.9375rem;">¡Participa en el concurso<br/>y llévatelo!</p>
        </div>
        <div style="width:140px;height:140px;border-radius:50%;background:radial-gradient(circle, #b02a00 0%, #0a0a0a 80%);opacity:0.65;"></div>
      </div>

      <nx-coupon-box slot="coupon"
        label="Cupón dto."
        amount="Hasta 30€"
        footnote="para asistentes"
      ></nx-coupon-box>
    </nx-live-banner>
  `,
};

/* ─── v04 · Naranja claro (2 presenters, claim largo, decoración) ─────── */
export const Variant04: Story = {
  name: 'v04 · Decorado',
  args: {
    accent: '#ff7900',
    claim: 'Campaña especial. Live presentado por',
    highlight: 'Live',
    subClaim: '',
    background: '',
    contentMax: '',
    radius: '',
    brandLogo: '',
    brandAlt: '',
    claimAs: 'h2',
    subClaimAs: 'p',
    autoContrast: false,
  },
  render: (a) => html`
    <nx-live-banner
      accent=${a.accent}
      background=${a.background}
      claim=${a.claim}
      highlight=${a.highlight}
      sub-claim=${a.subClaim}
      claim-as=${a.claimAs}
      sub-claim-as=${a.subClaimAs}
      ?auto-contrast=${a.autoContrast}
      style=${bannerStyle(a) ?? ''}
    >
      <span slot="brand" style="background:#ff7900;color:#000;font-weight:800;padding:0.375rem 0.5rem;font-size:0.875rem;letter-spacing:0.05em;">marca d</span>

      <!-- Decoración de partículas sobre todo el banner -->
      <div slot="decoration" style="background:radial-gradient(ellipse at 60% 35%, rgba(255,165,0,0.18) 0%, transparent 55%);"></div>

      <nx-presenter-avatar slot="presenters" name="Ponente 1" role="Experta comercial"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" name="Ponente 2" role="Presentadora"></nx-presenter-avatar>

      <div slot="feature" style="display:flex;align-items:center;gap:1rem;opacity:0.75;">
        <span style="font-size:0.8125rem;">[categoría 1 · categoría 2 · categoría 3]</span>
      </div>

      <nx-coupon-box slot="coupon"
        label="Cupón dto. asistentes"
        amount="Hasta 100 €"
      ></nx-coupon-box>
    </nx-live-banner>
  `,
};

/* ─── Demo auto-contrast: dos bloques, claro vs oscuro ────────────────── */
/**
 * Fija un fondo claro (`#fde047`) y uno oscuro (`#0f172a`). Con `auto-contrast`
 * activo, el texto se ajusta (negro sobre amarillo, blanco sobre navy). En
 * navegadores sin soporte para `contrast-color()`, ambos se verán en blanco.
 */
export const AutoContrast: Story = {
  name: 'Auto-contrast (demo)',
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1.5rem;">
      ${[
        { bg: '#fde047', accent: '#7c2d12', label: 'Amarillo (fondo claro)' },
        { bg: '#0f172a', accent: '#38bdf8', label: 'Navy (fondo oscuro)' },
      ].map(({ bg, accent, label }) => html`
        <div>
          <p style="margin:0 0 0.5rem;font-family:sans-serif;font-size:0.8125rem;color:#64748b;">${label}</p>
          <nx-live-banner
            auto-contrast
            accent=${accent}
            background=${bg}
            claim="Live presentado por"
            highlight="Live"
            sub-claim="El color del texto se decide por contrast-color()."
          >
            <strong slot="brand" style="font-size:1.125rem;">NEXO</strong>
            <nx-presenter-avatar slot="presenters" name="Ponente 1" role="Experto"></nx-presenter-avatar>
            <nx-presenter-avatar slot="presenters" name="Ponente 2" role="Creador"></nx-presenter-avatar>
            <nx-coupon-box slot="coupon" label="Cupón dto." amount="Hasta 30€" footnote="para asistentes"></nx-coupon-box>
          </nx-live-banner>
        </div>
      `)}
    </div>
  `,
};

/* ─── Mínimo (solo datos, sin feature ni coupon) ──────────────────────── */
export const Minimal: Story = {
  args: {
    accent: '#6d28d9',
    claim: 'Live presentado por',
    highlight: 'Live',
    subClaim: '',
    background: '',
    contentMax: '800px',
    radius: '',
    brandLogo: '',
    brandAlt: '',
    claimAs: 'h2',
    subClaimAs: 'p',
    autoContrast: false,
  },
  render: (a) => html`
    <nx-live-banner
      accent=${a.accent}
      background=${a.background}
      claim=${a.claim}
      highlight=${a.highlight}
      sub-claim=${a.subClaim}
      claim-as=${a.claimAs}
      sub-claim-as=${a.subClaimAs}
      ?auto-contrast=${a.autoContrast}
      style=${bannerStyle(a) ?? ''}
    >
      <strong slot="brand" style="font-size:1.125rem;">NEXO</strong>
      <nx-presenter-avatar slot="presenters" name="Ponente 1" role="Ponente"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" name="Ponente 2" role="Ponente"></nx-presenter-avatar>
    </nx-live-banner>
  `,
};
