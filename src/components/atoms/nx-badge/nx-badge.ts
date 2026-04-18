import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type BadgeVariant = 'primary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md';

@customElement('nx-badge')
export class NxBadge extends LitElement {
  static override styles = css`
    :host { display: inline-flex; }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--nx-space-1);
      font-family: var(--nx-font-sans);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-radius: var(--nx-badge-radius, var(--nx-radius-full));
      white-space: nowrap;
      line-height: 1;
    }

    .size-sm { font-size: var(--nx-text-xs);  padding: 2px var(--nx-space-2); }
    .size-md { font-size: var(--nx-text-xs);  padding: var(--nx-space-1) var(--nx-space-3); }

    .variant-primary  { background: var(--nx-color-primary-subtle); color: var(--nx-color-primary); }
    .variant-accent   { background: color-mix(in srgb, var(--nx-color-accent) 15%, transparent); color: var(--nx-color-accent-hover); }
    .variant-success  { background: var(--nx-color-success-subtle); color: var(--nx-color-success); }
    .variant-warning  { background: var(--nx-color-warning-subtle); color: color-mix(in srgb, var(--nx-color-warning) 80%, black); }
    .variant-error    { background: var(--nx-color-error-subtle);   color: var(--nx-color-error); }
    .variant-info     { background: var(--nx-color-info-subtle);    color: var(--nx-color-info); }
    .variant-neutral  { background: var(--nx-color-border);         color: var(--nx-color-text-muted); }

    .dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      flex-shrink: 0;
    }
  `;

  @property({ reflect: true }) variant: BadgeVariant = 'primary';
  @property({ reflect: true }) size: BadgeSize = 'md';
  @property({ type: Boolean }) dot = false;

  override render() {
    return html`
      <span class="badge variant-${this.variant} size-${this.size}">
        ${this.dot ? html`<span class="dot"></span>` : ''}
        <slot></slot>
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-badge': NxBadge; }
}
