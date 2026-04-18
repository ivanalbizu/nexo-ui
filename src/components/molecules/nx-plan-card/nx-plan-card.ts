import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@/components/atoms/nx-button/nx-button.js';

@customElement('nx-plan-card')
export class NxPlanCard extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .card {
      position: relative;
      background: var(--nx-color-surface-alt);
      border-width: var(--nx-card-border-width, 2px);
      border-style: solid;
      border-color: var(--nx-color-border);
      border-radius: var(--nx-card-radius, var(--nx-radius-card));
      box-shadow: var(--nx-shadow-card);
      padding: var(--nx-card-padding, var(--nx-space-8));
      display: flex;
      flex-direction: column;
      gap: var(--nx-card-gap, var(--nx-space-4));
      transition: box-shadow var(--nx-transition), border-color var(--nx-transition), transform var(--nx-transition);
    }

    :host([highlighted]) .card {
      border-color: var(--nx-color-primary);
      box-shadow: 0 4px 24px rgba(109, 40, 217, 0.18);
    }

    .card:hover {
      box-shadow: 0 8px 32px rgba(0,0,0,0.12);
      transform: translateY(-3px);
    }

    @media (prefers-reduced-motion: reduce) {
      .card:hover { transform: none; }
    }

    .badge {
      position: absolute;
      top: -1px;
      right: var(--nx-space-6);
      background: var(--nx-color-primary);
      color: var(--nx-color-text-inverse);
      font-family: var(--nx-font-sans);
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: var(--nx-space-1) var(--nx-space-3);
      border-radius: 0 0 var(--nx-radius-md) var(--nx-radius-md);
    }

    :host([highlighted]) .badge {
      background: var(--nx-color-accent);
      color: var(--nx-color-text);
    }

    .title {
      font-family: var(--nx-font-sans);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--nx-color-text);
      margin: 0;
    }

    .price-row {
      display: flex;
      align-items: baseline;
      gap: var(--nx-space-1);
    }

    .price {
      font-family: var(--nx-font-sans);
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--nx-color-text);
      line-height: 1;
    }

    .price-currency {
      font-family: var(--nx-font-sans);
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--nx-color-text-muted);
      align-self: flex-start;
      margin-top: 0.4rem;
    }

    .price-period {
      font-family: var(--nx-font-sans);
      font-size: 0.875rem;
      color: var(--nx-color-text-muted);
    }

    .divider {
      border: none;
      border-top: 1px solid var(--nx-color-border);
      margin: 0;
    }

    .features {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--nx-space-3);
      flex: 1;
    }

    .feature {
      display: flex;
      align-items: center;
      gap: var(--nx-space-3);
      font-family: var(--nx-font-sans);
      font-size: 0.9375rem;
      color: var(--nx-color-text);
    }

    .feature::before {
      content: '';
      display: inline-block;
      width: 1.1em;
      height: 1.1em;
      min-width: 1.1em;
      background: var(--nx-color-primary);
      mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/%3E%3C/svg%3E");
      mask-size: contain;
      mask-repeat: no-repeat;
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clip-rule='evenodd'/%3E%3C/svg%3E");
      -webkit-mask-size: contain;
      -webkit-mask-repeat: no-repeat;
    }

    .cta {
      margin-top: var(--nx-space-2);
    }

    .cta nx-button {
      width: 100%;
    }
  `;

  @property() title = '';
  @property({ type: Number }) price = 0;
  @property() billingPeriod: 'monthly' | 'yearly' = 'monthly';
  @property({ type: Array }) features: string[] = [];
  @property() badge = '';
  @property({ type: Boolean, reflect: true }) highlighted = false;
  @property() currency = '€';
  @property() ctaLabel = 'Contratar';

  override render() {
    const period = this.billingPeriod === 'monthly' ? 'mes' : 'año';

    return html`
      <div class="card">
        ${this.badge ? html`<span class="badge">${this.badge}</span>` : nothing}

        <p class="title">${this.title}</p>

        <div class="price-row">
          <span class="price-currency">${this.currency}</span>
          <span class="price">${this.price.toFixed(2)}</span>
          <span class="price-period">/ ${period}</span>
        </div>

        <hr class="divider" />

        <ul class="features">
          ${this.features.map(f => html`<li class="feature">${f}</li>`)}
        </ul>

        <div class="cta">
          <nx-button
            variant=${this.highlighted ? 'primary' : 'secondary'}
            size="md"
            @click=${this._handleCta}
            style="width:100%;"
          >${this.ctaLabel}</nx-button>
        </div>
      </div>
    `;
  }

  private _handleCta() {
    this.dispatchEvent(new CustomEvent('nx-plan-card-select', {
      bubbles: true,
      composed: true,
      detail: { title: this.title, price: this.price, billingPeriod: this.billingPeriod },
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nx-plan-card': NxPlanCard;
  }
}
