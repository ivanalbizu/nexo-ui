import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type CouponEmphasis = 'amount' | 'text';

@customElement('nx-coupon-box')
export class NxCouponBox extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
      font-family: var(--nx-font-sans);
      color: var(--nx-color-text-inverse, #fff);
    }

    .box {
      border: 2px solid var(--nx-coupon-border, var(--nx-color-text-inverse, #fff));
      border-radius: var(--nx-coupon-radius, var(--nx-radius-sm));
      padding: var(--nx-space-4) var(--nx-space-5);
      background: var(--nx-coupon-bg, transparent);
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--nx-space-1);
      min-width: 12rem;
    }

    :host([variant="dashed"]) .box { border-style: dashed; }
    :host([variant="solid"]) .box {
      background: var(--nx-coupon-bg, rgba(0, 0, 0, 0.35));
      border-color: transparent;
    }

    .label {
      font-size: var(--nx-text-sm);
      font-weight: 500;
      margin: 0;
      opacity: 0.9;
    }

    .amount {
      font-size: 1.5rem;
      font-weight: 800;
      margin: 0;
      line-height: 1;
      letter-spacing: 0.01em;
    }

    :host([emphasis="amount"]) .amount { color: var(--nx-color-accent); }
    :host([emphasis="text"])   .label   { color: var(--nx-color-accent); font-size: var(--nx-text-base); font-weight: 700; }

    .footnote {
      font-size: var(--nx-text-xs);
      margin: 0;
      opacity: 0.85;
    }
  `;

  @property() label = '';
  @property() amount = '';
  @property() footnote = '';
  @property({ reflect: true }) variant: 'solid' | 'dashed' | 'outline' = 'outline';
  @property({ reflect: true }) emphasis: CouponEmphasis = 'amount';

  override render() {
    return html`
      <div class="box">
        ${this.label    ? html`<p class="label">${this.label}</p>`       : nothing}
        ${this.amount   ? html`<p class="amount">${this.amount}</p>`     : nothing}
        ${this.footnote ? html`<p class="footnote">${this.footnote}</p>` : nothing}
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-coupon-box': NxCouponBox; }
}
