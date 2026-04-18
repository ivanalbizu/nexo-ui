import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Plan } from '@/services/contentful.types.js';
import '@/components/molecules/nx-plan-card/nx-plan-card.js';
import '@/components/atoms/nx-spinner/nx-spinner.js';

@customElement('nx-plan-grid')
export class NxPlanGrid extends LitElement {
  static override styles = css`
    :host { display: block; }

    .header {
      text-align: center;
      margin-bottom: var(--nx-space-8);
    }

    .header-title {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-3xl);
      font-weight: 800;
      color: var(--nx-color-text);
      margin: 0 0 var(--nx-space-3);
      line-height: var(--nx-leading-tight);
    }

    .header-subtitle {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-lg);
      color: var(--nx-color-text-muted);
      margin: 0 auto;
      max-width: 480px;
      line-height: var(--nx-leading-normal);
    }

    .toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--nx-space-3);
      margin-bottom: var(--nx-space-8);
    }

    .toggle-label {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      font-weight: 500;
      color: var(--nx-color-text-muted);
    }

    .toggle-label.active { color: var(--nx-color-text); font-weight: 600; }

    .toggle-switch {
      position: relative;
      width: 48px;
      height: 26px;
      background: var(--nx-color-border);
      border-radius: var(--nx-radius-full);
      border: none;
      cursor: pointer;
      transition: background var(--nx-transition);
      padding: 0;
    }

    .toggle-switch[aria-checked="true"] { background: var(--nx-color-primary); }

    .toggle-knob {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: transform var(--nx-transition);
      box-shadow: var(--nx-shadow-sm);
    }

    .toggle-switch[aria-checked="true"] .toggle-knob { transform: translateX(22px); }

    .save-badge {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-xs);
      font-weight: 700;
      background: var(--nx-color-accent);
      color: var(--nx-color-text-on-accent);
      padding: 2px var(--nx-space-2);
      border-radius: var(--nx-radius-full);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--nx-space-6);
      align-items: start;
    }

    .empty {
      text-align: center;
      padding: var(--nx-space-16);
      color: var(--nx-color-text-muted);
      font-family: var(--nx-font-sans);
    }

    .loading {
      display: flex;
      justify-content: center;
      padding: var(--nx-space-16);
    }
  `;

  @property() heading  = 'Elige tu plan';
  @property() subheading = '';
  @property({ type: Array }) plans: Plan[] = [];
  @property({ type: Boolean }) loading = false;
  @property({ type: Boolean }) showBillingToggle = false;
  @property() yearlyDiscount = '20%';

  @state() private _yearly = false;

  override render() {
    if (this.loading) return html`<div class="loading"><nx-spinner size="lg"></nx-spinner></div>`;

    return html`
      ${this.heading ? html`
        <div class="header">
          <h2 class="header-title">${this.heading}</h2>
          ${this.subheading ? html`<p class="header-subtitle">${this.subheading}</p>` : nothing}
        </div>
      ` : nothing}

      ${this.showBillingToggle ? html`
        <div class="toggle">
          <span class="toggle-label ${!this._yearly ? 'active' : ''}">Mensual</span>
          <button
            type="button"
            class="toggle-switch"
            role="switch"
            aria-checked=${String(this._yearly)}
            aria-label="Cambiar a facturación anual"
            @click=${this._toggleBilling}
          >
            <span class="toggle-knob"></span>
          </button>
          <span class="toggle-label ${this._yearly ? 'active' : ''}">
            Anual <span class="save-badge">-${this.yearlyDiscount}</span>
          </span>
        </div>
      ` : nothing}

      <div class="grid">
        ${this.plans.length === 0
          ? html`<p class="empty">No hay planes disponibles.</p>`
          : this.plans.map(plan => html`
            <nx-plan-card
              title=${plan.title}
              .price=${this._yearly ? plan.price * 12 * 0.8 : plan.price}
              billingPeriod=${this._yearly ? 'yearly' : 'monthly'}
              .features=${plan.features}
              badge=${plan.badge ?? ''}
              ?highlighted=${plan.highlighted ?? false}
              @nx-plan-card-select=${(e: CustomEvent) => this._onPlanSelect(e, plan)}
            ></nx-plan-card>
          `)
        }
      </div>
    `;
  }

  private _toggleBilling() {
    this._yearly = !this._yearly;
    this.dispatchEvent(new CustomEvent('nx-plan-grid-billing-change', {
      bubbles: true, composed: true, detail: { yearly: this._yearly },
    }));
  }

  private _onPlanSelect(_e: CustomEvent, plan: Plan) {
    this.dispatchEvent(new CustomEvent('nx-plan-grid-select', {
      bubbles: true, composed: true, detail: { plan },
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-plan-grid': NxPlanGrid; }
}
