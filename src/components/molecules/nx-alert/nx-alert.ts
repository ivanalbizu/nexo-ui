import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

const ICONS: Record<AlertVariant, string> = {
  info:    'ℹ',
  success: '✓',
  warning: '⚠',
  error:   '✕',
};

@customElement('nx-alert')
export class NxAlert extends LitElement {
  static override styles = css`
    :host { display: block; }
    :host([hidden]) { display: none; }

    .alert {
      display: flex;
      gap: var(--nx-space-3);
      align-items: flex-start;
      padding: var(--nx-space-4);
      border-radius: var(--nx-alert-radius, var(--nx-radius-md));
      border-left: 4px solid;
    }

    .variant-info    { background: var(--nx-color-info-subtle);    border-color: var(--nx-color-info);    color: var(--nx-color-info); }
    .variant-success { background: var(--nx-color-success-subtle); border-color: var(--nx-color-success); color: var(--nx-color-success); }
    .variant-warning { background: var(--nx-color-warning-subtle); border-color: var(--nx-color-warning); color: color-mix(in srgb, var(--nx-color-warning) 80%, black); }
    .variant-error   { background: var(--nx-color-error-subtle);   border-color: var(--nx-color-error);   color: var(--nx-color-error); }

    .icon {
      font-size: 1.1em;
      font-weight: 700;
      flex-shrink: 0;
      line-height: 1.4;
    }

    .body { flex: 1; }

    .title {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-base);
      font-weight: 700;
      color: inherit;
      margin: 0 0 var(--nx-space-1);
    }

    .content {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      color: var(--nx-color-text);
      line-height: var(--nx-leading-normal);
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
      font-size: 1rem;
      color: var(--nx-color-text-muted);
      line-height: 1;
      flex-shrink: 0;
      opacity: 0.6;
      transition: opacity var(--nx-transition);
    }
    .close-btn:hover { opacity: 1; }
  `;

  @property({ reflect: true }) variant: AlertVariant = 'info';
  @property() title = '';
  @property({ type: Boolean }) dismissible = false;
  @state() private _dismissed = false;

  override render() {
    if (this._dismissed) return nothing;
    return html`
      <div class="alert variant-${this.variant}" role="alert">
        <span class="icon" aria-hidden="true">${ICONS[this.variant]}</span>
        <div class="body">
          ${this.title ? html`<p class="title">${this.title}</p>` : nothing}
          <div class="content"><slot></slot></div>
        </div>
        ${this.dismissible ? html`
          <button type="button" class="close-btn" aria-label="Cerrar" @click=${this._dismiss}>✕</button>
        ` : nothing}
      </div>
    `;
  }

  private _dismiss() {
    this._dismissed = true;
    this.dispatchEvent(new CustomEvent('nx-alert-dismiss', { bubbles: true, composed: true }));
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-alert': NxAlert; }
}
