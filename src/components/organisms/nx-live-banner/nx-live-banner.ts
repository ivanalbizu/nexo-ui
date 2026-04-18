import { LitElement, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { html, unsafeStatic } from 'lit/static-html.js';
import '@/components/atoms/nx-presenter-avatar/nx-presenter-avatar.js';
import '@/components/molecules/nx-coupon-box/nx-coupon-box.js';

/** Etiquetas HTML permitidas para el claim y el sub-claim. */
export type LiveBannerHeading = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p' | 'span';
const ALLOWED_HEADINGS: readonly LiveBannerHeading[] = ['h1','h2','h3','h4','h5','h6','div','p','span'] as const;
const safeTag = (value: string, fallback: LiveBannerHeading): LiveBannerHeading =>
  (ALLOWED_HEADINGS as readonly string[]).includes(value) ? (value as LiveBannerHeading) : fallback;

/**
 * Layout shell para banners "Live presentado por" (marca + claim + presenters + producto + cupón).
 *
 * Uso simple (props):
 *   <nx-live-banner brandLogo="..." claim="Live presentado por" highlight="Live" accent="#e4002b">
 *     <nx-presenter-avatar slot="presenters" ...></nx-presenter-avatar>
 *     ...
 *   </nx-live-banner>
 *
 * Uso avanzado (slots nombrados): brand · claim · presenters · feature · coupon · decoration
 * La prop `accent` sobrescribe `--nx-color-accent` localmente para que cascadee a hijos.
 */
@customElement('nx-live-banner')
export class NxLiveBanner extends LitElement {
  static override styles = css`
    /* ── Host: ocupa todo el ancho disponible, el background va a sangre ── */
    :host {
      display: block;
      width: 100%;
      font-family: var(--nx-font-sans);
      color: var(--nx-color-text-inverse, #fff);
      background: var(--nx-live-banner-bg, #0a0a0a);
      border-radius: var(--nx-live-banner-radius, 0);
      overflow: hidden;
      position: relative;
    }

    /* ── Wrapper: contenido centrado con un ancho máximo configurable ── */
    /* container-type aquí para que las @container queries respondan al ancho
       del contenido (no al ancho total del host/viewport). */
    .wrapper {
      display: grid;
      grid-template-areas:
        "header"
        "claim"
        "presenters"
        "feature"
        "coupon"
        "footer";
      grid-template-columns: 1fr;
      gap: clamp(var(--nx-space-4), 4cqi, var(--nx-space-6));
      padding: clamp(var(--nx-space-4), 5cqi, var(--nx-space-10));
      max-width: var(--nx-live-banner-content-max, 1000px);
      margin-inline: auto;
      position: relative;
      z-index: 1;
      container-type: inline-size;
    }

    .zone-header      { grid-area: header;     display: flex; align-items: center; gap: var(--nx-space-3); flex-wrap: wrap; }
    .zone-claim       { grid-area: claim;      }
    .zone-presenters  {
      grid-area: presenters;
      display: flex;
      flex-wrap: wrap;
      gap: clamp(var(--nx-space-3), 3cqi, var(--nx-space-8));
      justify-content: center;
      align-items: flex-start;
    }
    .zone-feature     { grid-area: feature;    display: flex; align-items: center; justify-content: center; min-height: 0; }
    .zone-coupon      { grid-area: coupon;     display: flex; align-items: center; justify-content: center; }
    .zone-footer      { grid-area: footer;     }

    /* ── ≥30rem (≈480px): presenters y feature se alinean a la izquierda ── */
    @container (min-width: 30rem) {
      .zone-presenters { justify-content: flex-start; }
      .zone-feature    { justify-content: flex-start; }
    }

    /* ── ≥40rem (≈640px): feature y coupon conviven en fila ── */
    @container (min-width: 40rem) {
      .wrapper {
        grid-template-areas:
          "header     header"
          "claim      claim"
          "presenters presenters"
          "feature    coupon"
          "footer     footer";
        grid-template-columns: 1fr auto;
      }
      .zone-coupon { justify-content: flex-end; }
    }

    /* Decoración: se posiciona absolute sobre todo el banner, fuera del flow */
    ::slotted([slot="decoration"]) {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }

    /* Brand */
    .brand-logo {
      height: var(--nx-live-banner-logo-h, 2rem);
      width: auto;
      object-fit: contain;
    }

    /* Claim */
    .claim {
      font-size: clamp(1.5rem, 3.5cqi, 2.5rem);
      font-weight: 700;
      line-height: 1.15;
      margin: 0;
    }
    .claim .highlight { color: var(--nx-color-accent); }

    .sub-claim {
      font-size: clamp(1rem, 2cqi, 1.25rem);
      font-weight: 500;
      color: color-mix(in srgb, var(--nx-color-text-inverse, #fff) 85%, transparent);
      margin: var(--nx-space-2) 0 0;
    }
  `;

  @property({ attribute: 'brand-logo' }) brandLogo = '';
  @property({ attribute: 'brand-alt'  }) brandAlt  = '';
  @property()                            claim     = '';
  @property()                            highlight = '';
  @property({ attribute: 'sub-claim'  }) subClaim  = '';
  @property()                            accent    = '';

  /** CSS background (color, gradient, url(), …). Si se omite, usa el default oscuro del token. */
  @property() background = '';

  /** Etiqueta HTML para el claim. Sólo afecta a la semántica — la apariencia la da la clase `.claim`. */
  @property({ attribute: 'claim-as'     }) claimAs:    LiveBannerHeading = 'h2';
  /** Etiqueta HTML para el sub-claim. */
  @property({ attribute: 'sub-claim-as' }) subClaimAs: LiveBannerHeading = 'p';

  override updated(changed: Map<string, unknown>) {
    // Las custom properties van al host para que `--nx-live-banner-bg` aplique al
    // background (full bleed) y `--nx-color-accent` cascadee a TODO el contenido,
    // incluida la decoración (que vive fuera del wrapper).
    if (changed.has('accent')) {
      this.style.setProperty('--nx-color-accent', this.accent || '');
    }
    if (changed.has('background')) {
      this.style.setProperty('--nx-live-banner-bg', this.background || '');
    }
  }

  override render() {
    const claimTag    = unsafeStatic(safeTag(this.claimAs,    'h2'));
    const subClaimTag = unsafeStatic(safeTag(this.subClaimAs, 'p'));

    return html`
      <slot name="decoration"></slot>
      <div class="wrapper">
        <div class="zone-header">
          <slot name="brand">
            ${this.brandLogo
              ? html`<img class="brand-logo" src=${this.brandLogo} alt=${this.brandAlt} />`
              : nothing}
          </slot>
        </div>

        <div class="zone-claim">
          <slot name="claim">
            ${this.claim ? html`
              <${claimTag} class="claim">${this._renderClaim()}</${claimTag}>
              ${this.subClaim ? html`<${subClaimTag} class="sub-claim">${this.subClaim}</${subClaimTag}>` : nothing}
            ` : nothing}
          </slot>
        </div>

        <div class="zone-presenters">
          <slot name="presenters"></slot>
        </div>

        <div class="zone-feature">
          <slot name="feature"></slot>
        </div>

        <div class="zone-coupon">
          <slot name="coupon"></slot>
        </div>

        <div class="zone-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  /** Renderiza el claim destacando la palabra `highlight` (primera ocurrencia, case-sensitive). */
  private _renderClaim() {
    if (!this.highlight) return this.claim;
    const idx = this.claim.indexOf(this.highlight);
    if (idx === -1) return this.claim;
    const before = this.claim.slice(0, idx);
    const after  = this.claim.slice(idx + this.highlight.length);
    return html`${before}<span class="highlight">${this.highlight}</span>${after}`;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-live-banner': NxLiveBanner; }
}
