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
}

const meta: Meta<Args> = {
  title: 'Organisms/NxLiveBanner',
  component: 'nx-live-banner',
  argTypes: {
    claim:      { control: 'text',  description: 'Texto principal. Use `highlight` para destacar una palabra dentro.' },
    claimAs:    { control: 'select', options: ['h1','h2','h3','h4','h5','h6','div','p','span'], description: 'Etiqueta HTML del claim. Sólo cambia la semántica; la apariencia la define la clase `.claim`.' },
    highlight:  { control: 'text',  description: 'Palabra (primera ocurrencia, case-sensitive) a la que se aplica el color de acento.' },
    subClaim:   { control: 'text',  description: 'Subtítulo opcional bajo el claim.' },
    subClaimAs: { control: 'select', options: ['h1','h2','h3','h4','h5','h6','div','p','span'], description: 'Etiqueta HTML del sub-claim.' },
    brandLogo:  { control: 'text',  description: 'URL de logo. Si se omite y hay slot `brand`, se usa el slot.' },
    brandAlt:   { control: 'text',  description: 'Alt del logo.' },
    accent:     { control: 'color', description: 'Color de marca. Sobrescribe `--nx-color-accent` a nivel instancia.' },
    background: { control: 'text',  description: 'CSS background (color, gradient, url()…). Sobrescribe `--nx-live-banner-bg`.' },
    contentMax: { control: 'text',  description: 'Ancho máximo del contenido centrado (CSS length). Default 1000px.' },
    radius:     { control: 'text',  description: 'Radio de borde del host (CSS length). Default 0 (full-bleed).' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Shell para banners "Live presentado por". Zonas (slots): `brand` · `claim` · `presenters` · `feature` · `coupon` · `footer` · `decoration`.',
          'El background va a sangre (ocupa el 100 % del ancho del host), mientras que el contenido se centra con un ancho máximo configurable vía `--nx-live-banner-content-max` (default 1000px).',
          'La prop `accent` (o `--nx-color-accent`) tiñe al highlight del claim, los halos de los avatares y el énfasis del cupón.',
          'Debajo de cada story hay la imagen original como referencia visual.',
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

/** Imagen de referencia debajo de cada banner para comparar. */
const reference = (src: string) => html`
  <details style="margin-top:1.5rem;max-width:1000px;">
    <summary style="cursor:pointer;color:#64748b;font-family:sans-serif;font-size:0.875rem;">Ver imagen original</summary>
    <img src=${src} alt="Referencia" style="display:block;width:100%;border:1px solid #334155;border-radius:8px;margin-top:0.5rem;" />
  </details>
`;

/* ─── Playground: todos los controles activos, contenido mínimo ───────── */
export const Playground: Story = {
  args: {
    claim: 'Live presentado por',
    highlight: 'Live',
    subClaim: 'Vive la experiencia en directo.',
    brandLogo: '',
    brandAlt: '',
    accent: '#6d28d9',
    background: '',
    contentMax: '1000px',
    radius: '0',
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
      brand-logo=${a.brandLogo}
      brand-alt=${a.brandAlt}
      style=${bannerStyle(a) ?? ''}
    >
      <strong slot="brand" style="font-size:1.125rem;">NEXO</strong>
      <nx-presenter-avatar slot="presenters" name="Invitado 1" role="Ponente"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" name="Invitado 2" role="Ponente"></nx-presenter-avatar>
      <nx-coupon-box slot="coupon" label="Cupón dto." amount="Hasta 30€" footnote="para asistentes"></nx-coupon-box>
    </nx-live-banner>
  `,
};

/* ─── v01 · Therabody (rojo, 2 presenters, premio) ─────────────────────── */
export const TherabodyV1: Story = {
  name: 'v01 · Therabody',
  args: {
    accent: '#e4002b',
    claim: 'Live presentado por',
    highlight: 'Live',
    subClaim: 'Vive la experiencia Therabody en directo.',
    background: '',
    contentMax: '',
    radius: '',
    brandLogo: '',
    brandAlt: '',
    claimAs: 'h2',
    subClaimAs: 'p',
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
      style=${bannerStyle(a) ?? ''}
    >
      <strong slot="brand" style="font-size:1.25rem;letter-spacing:0.05em;">THERABODY</strong>

      <nx-presenter-avatar slot="presenters" name="Luis Hernández"   role="Experto en Therabody"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" name="Claudia Colomer"  role="Creadora de contenido"></nx-presenter-avatar>

      <div slot="feature" style="width:100%;aspect-ratio:16/9;background:radial-gradient(circle at 70% 40%, #3a0808 0%, #0a0a0a 75%);border-radius:8px;display:flex;align-items:center;justify-content:center;color:#fff;opacity:0.6;">
        [producto destacado]
      </div>

      <nx-coupon-box slot="coupon"
        emphasis="text"
        label="¡Podrás ganar una TheraFace Mask Glo!"
      ></nx-coupon-box>
    </nx-live-banner>

    ${reference('/banner/banner-v01.png')}
  `,
};

/* ─── v02 · Xiaomi (verde, 4 presenters, cupón + feature fuerte) ──────── */
export const XiaomiV2: Story = {
  name: 'v02 · Xiaomi',
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
      style=${bannerStyle(a) ?? ''}
    >
      <strong slot="brand" style="font-size:1.25rem;letter-spacing:0.15em;">MI</strong>

      <nx-presenter-avatar slot="presenters" size="sm" name="Tomás Rubiolo"   role="Experto en Xiaomi"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" size="sm" name="Claudia Colomer" role="Creadora de contenido"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" size="sm" name="Ana Furia"       role="Atleta profesional de breaking"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" size="sm" name="Mini Joe"        role="Atleta profesional de breaking"></nx-presenter-avatar>

      <div slot="feature" style="display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap;">
        <div style="font-style:italic;font-size:2rem;font-weight:700;">Ultra</div>
        <div>
          <p style="margin:0;font-weight:700;font-size:1.5rem;letter-spacing:0.05em;">XIAOMI 17 Ultra</p>
          <p style="margin:0.25rem 0 0;opacity:0.8;font-size:0.875rem;">Fotografía Leica</p>
        </div>
      </div>

      <nx-coupon-box slot="coupon"
        variant="solid"
        label="Cupón dto. desde 100€"
        footnote="para asistentes"
      ></nx-coupon-box>
    </nx-live-banner>

    ${reference('/banner/banner-v02.png')}
  `,
};

/* ─── v03 · Huawei (naranja, 3 presenters, cupón lateral) ─────────────── */
export const HuaweiV3: Story = {
  name: 'v03 · Huawei',
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
      style=${bannerStyle(a) ?? ''}
    >
      <strong slot="brand" style="font-size:1.25rem;letter-spacing:0.1em;">HUAWEI</strong>

      <nx-presenter-avatar slot="presenters" name="Roberto Sampalo"       role="Experto en Huawei"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" name="Carlos Santa Engracia" role="Topes de Gama"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" name="Claudia Colomer"       role="Creadora de contenido"></nx-presenter-avatar>

      <div slot="feature" style="display:flex;align-items:center;gap:2rem;">
        <div>
          <h3 style="margin:0 0 0.5rem;font-size:1.5rem;font-weight:700;">HUAWEI WATCH GT<br/>Runner 2</h3>
          <p style="margin:0;font-size:0.9375rem;">¡Participa en el concurso<br/>de este smartwatch!</p>
        </div>
        <div style="width:140px;height:140px;border-radius:50%;background:radial-gradient(circle, #b02a00 0%, #0a0a0a 80%);opacity:0.65;"></div>
      </div>

      <nx-coupon-box slot="coupon"
        label="Cupón dto."
        amount="Hasta 30€"
        footnote="para asistentes"
      ></nx-coupon-box>
    </nx-live-banner>

    ${reference('/banner/banner-v03.jpg')}
  `,
};

/* ─── v04 · Orange (naranja, 2 presenters, claim largo, decoración) ───── */
export const OrangeV4: Story = {
  name: 'v04 · Orange',
  args: {
    accent: '#ff7900',
    claim: 'Una Navidad con Todo. Live presentado por',
    highlight: 'Live',
    subClaim: '',
    background: '',
    contentMax: '',
    radius: '',
    brandLogo: '',
    brandAlt: '',
    claimAs: 'h2',
    subClaimAs: 'p',
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
      style=${bannerStyle(a) ?? ''}
    >
      <span slot="brand" style="background:#ff7900;color:#000;font-weight:800;padding:0.375rem 0.5rem;font-size:0.875rem;letter-spacing:0.05em;">orange™</span>

      <!-- Decoración de partículas sobre todo el banner -->
      <div slot="decoration" style="background:radial-gradient(ellipse at 60% 35%, rgba(255,165,0,0.18) 0%, transparent 55%);"></div>

      <nx-presenter-avatar slot="presenters" name="Eny"          role="Experta comercial en Orange"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" name="Laura Rougé"  role="Presentadora y redactora de @fabricatele"></nx-presenter-avatar>

      <div slot="feature" style="display:flex;align-items:center;gap:1rem;opacity:0.75;">
        <span style="font-size:0.8125rem;">[scooter · móviles · smartwatch]</span>
      </div>

      <nx-coupon-box slot="coupon"
        label="Cupón dto. asistentes"
        amount="Hasta 100 €"
      ></nx-coupon-box>
    </nx-live-banner>

    ${reference('/banner/banner-v04.png')}
  `,
};

/* ─── Con imágenes dummy (logo + fotos de ponentes + feature) ─────────── */
// Dummies externos:
//  · picsum.photos       → imagen de producto (feature).
//  · i.pravatar.cc       → retratos de ponentes.
//  · logo inline (SVG)   → evita dependencias externas para la marca.
const dummyLogo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 40">
       <rect width="160" height="40" rx="6" fill="#fff"/>
       <text x="80" y="27" text-anchor="middle" font-family="Inter, sans-serif" font-weight="800" font-size="20" fill="#111">ACME</text>
     </svg>`,
  );

export const WithImages: Story = {
  name: 'Con imágenes dummy',
  args: {
    accent: '#2563eb',
    claim: 'Live presentado por',
    highlight: 'Live',
    subClaim: 'Conecta con los expertos y descubre las novedades en directo.',
    background: '',
    contentMax: '',
    radius: '',
    brandLogo: dummyLogo,
    brandAlt: 'ACME',
    claimAs: 'h1',
    subClaimAs: 'p',
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
      brand-logo=${a.brandLogo}
      brand-alt=${a.brandAlt}
      style=${bannerStyle(a) ?? ''}
    >
      <nx-presenter-avatar slot="presenters"
        name="Alex Ruiz"       role="Experto técnico"
        photo="https://i.pravatar.cc/240?img=12"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters"
        name="Marta Núñez"     role="Creadora de contenido"
        photo="https://i.pravatar.cc/240?img=47"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters"
        name="Daniel Fuentes"  role="Host del evento"
        photo="https://i.pravatar.cc/240?img=33"></nx-presenter-avatar>

      <img slot="feature"
        src="https://picsum.photos/seed/nexo-live-banner/800/450"
        alt="Producto destacado"
        style="width:100%;max-width:420px;aspect-ratio:16/9;object-fit:cover;border-radius:8px;" />

      <nx-coupon-box slot="coupon"
        variant="dashed"
        label="Cupón dto."
        amount="Hasta 50€"
        footnote="para asistentes"
      ></nx-coupon-box>
    </nx-live-banner>
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
      style=${bannerStyle(a) ?? ''}
    >
      <strong slot="brand" style="font-size:1.125rem;">NEXO</strong>
      <nx-presenter-avatar slot="presenters" name="Invitado 1" role="Ponente"></nx-presenter-avatar>
      <nx-presenter-avatar slot="presenters" name="Invitado 2" role="Ponente"></nx-presenter-avatar>
    </nx-live-banner>
  `,
};
