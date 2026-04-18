import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@/components/atoms/nx-button/nx-button.js';

@customElement('nx-promo-banner')
export class NxPromoBanner extends LitElement {
  static override styles = css`
    :host { display: block; }

    .banner {
      position: relative;
      overflow: hidden;
      border-radius: var(--nx-card-radius, var(--nx-radius-card));
      background: linear-gradient(
        135deg,
        var(--nx-color-primary) 0%,
        color-mix(in srgb, var(--nx-color-primary) 70%, var(--nx-color-accent)) 100%
      );
      color: var(--nx-color-text-inverse);
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: var(--nx-space-6);
      padding: var(--nx-space-8);
    }

    .banner.has-image {
      grid-template-columns: 1fr auto auto;
    }

    .content { display: flex; flex-direction: column; gap: var(--nx-space-3); }

    .title {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-2xl);
      font-weight: 800;
      margin: 0;
      line-height: var(--nx-leading-tight);
    }

    .subtitle {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-base);
      margin: 0;
      opacity: 0.9;
      line-height: var(--nx-leading-normal);
    }

    .badge-expires {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-xs);
      font-weight: 600;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .cta { flex-shrink: 0; }

    .image {
      width: 120px;
      height: 120px;
      object-fit: contain;
      border-radius: var(--nx-radius-md);
      flex-shrink: 0;
    }

    /* Decorative circles */
    .banner::before, .banner::after {
      content: '';
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.06);
      pointer-events: none;
    }
    .banner::before { width: 200px; height: 200px; top: -60px; right: 40%; }
    .banner::after  { width: 140px; height: 140px; bottom: -50px; right: 20%; }

    @media (max-width: 600px) {
      .banner, .banner.has-image {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto;
      }
      .image { width: 80px; height: 80px; }
    }
  `;

  @property() title    = '';
  @property() subtitle = '';
  @property() ctaLabel = 'Ver oferta';
  @property() ctaUrl   = '';
  @property() imageUrl = '';
  @property() imageAlt = '';
  @property() expiresAt = '';

  override render() {
    const expiresLabel = this._formatExpiry();
    return html`
      <div class="banner ${this.imageUrl ? 'has-image' : ''}">
        <div class="content">
          <h2 class="title">${this.title}</h2>
          ${this.subtitle ? html`<p class="subtitle">${this.subtitle}</p>` : nothing}
          ${expiresLabel ? html`<span class="badge-expires">Oferta hasta el ${expiresLabel}</span>` : nothing}
        </div>

        ${this.ctaLabel ? html`
          <div class="cta">
            <nx-button
              variant="secondary"
              size="md"
              style="--nx-color-primary:#fff;--nx-button-bg:transparent;border-color:#fff;color:#fff;"
              @click=${this._handleCta}
            >${this.ctaLabel}</nx-button>
          </div>
        ` : nothing}

        ${this.imageUrl ? html`
          <img class="image" src=${this.imageUrl} alt=${this.imageAlt} />
        ` : nothing}
      </div>
    `;
  }

  private _formatExpiry(): string {
    if (!this.expiresAt) return '';
    try {
      return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long' }).format(new Date(this.expiresAt));
    } catch { return ''; }
  }

  private _handleCta() {
    this.dispatchEvent(new CustomEvent('nx-promo-banner-cta', {
      bubbles: true, composed: true, detail: { url: this.ctaUrl },
    }));
    if (this.ctaUrl) window.location.href = this.ctaUrl;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-promo-banner': NxPromoBanner; }
}
