import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType    = 'button' | 'submit' | 'reset';

@customElement('nx-button')
export class NxButton extends LitElement {
  constructor() {
    super();
    this._internals = this.attachInternals();
  }
  static override styles = css`
    :host {
      display: inline-block;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--nx-space-2);
      font-family: var(--nx-font-sans);
      font-weight: var(--nx-button-font-weight, 600);
      letter-spacing: var(--nx-button-letter-spacing, 0);
      border: none;
      border-radius: var(--nx-button-radius, var(--nx-radius-full));
      cursor: pointer;
      transition: opacity var(--nx-transition), transform var(--nx-transition), background-color var(--nx-transition);
      text-decoration: none;
      white-space: nowrap;
    }

    .btn:focus-visible {
      outline: var(--nx-focus-ring-width) solid var(--nx-focus-ring-color);
      outline-offset: var(--nx-focus-ring-offset);
      box-shadow: var(--nx-shadow-focus);
    }

    .btn:active:not(:disabled) {
      transform: scale(0.97);
    }

    .btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    /* Sizes — consumen tokens de densidad */
    .btn.size-sm {
      font-size: var(--nx-text-sm);
      padding: 0 var(--nx-button-px-sm, var(--nx-space-3));
      height: var(--nx-button-height-sm, 2rem);
    }
    .btn.size-md {
      font-size: var(--nx-text-base);
      padding: 0 var(--nx-button-px-md, var(--nx-space-6));
      height: var(--nx-button-height-md, 2.5rem);
    }
    .btn.size-lg {
      font-size: 1rem;
      padding: 0 var(--nx-button-px-lg, var(--nx-space-8));
      height: var(--nx-button-height-lg, 3rem);
    }

    /* Variants */
    .btn.variant-primary {
      background: var(--nx-color-primary);
      color: var(--nx-color-text-inverse);
    }
    .btn.variant-primary:hover:not(:disabled) {
      background: color-mix(in srgb, var(--nx-color-primary) 85%, black);
    }

    /* auto-contrast: usa contrast-color() donde el navegador lo soporte.
       Sólo aplica al variant-primary, que es donde el fondo es el color de marca.
       Si no hay soporte, se conserva el color: var(--nx-color-text-inverse) de arriba. */
    @supports (color: contrast-color(red)) {
      :host([auto-contrast]) .btn.variant-primary {
        color: contrast-color(var(--nx-color-primary));
      }
    }

    .btn.variant-secondary {
      background: transparent;
      color: var(--nx-color-primary);
      border: 2px solid var(--nx-color-primary);
    }
    .btn.variant-secondary:hover:not(:disabled) {
      background: color-mix(in srgb, var(--nx-color-primary) 10%, transparent);
    }

    .btn.variant-ghost {
      background: transparent;
      color: var(--nx-color-text);
    }
    .btn.variant-ghost:hover:not(:disabled) {
      background: color-mix(in srgb, var(--nx-color-text) 8%, transparent);
    }

    .spinner {
      width: 1em;
      height: 1em;
      border-radius: 50%;
      border: 2px solid currentColor;
      border-right-color: transparent;
      animation: nx-button-spin 0.6s linear infinite;
      flex-shrink: 0;
    }
    @keyframes nx-button-spin {
      to { transform: rotate(360deg); }
    }
    @media (prefers-reduced-motion: reduce) {
      .spinner { animation-duration: 2s; }
    }
  `;

  @property({ reflect: true }) variant: ButtonVariant = 'primary';
  @property({ reflect: true }) size: ButtonSize = 'md';
  @property() href = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() type: ButtonType = 'button';
  /**
   * Cuando es `true`, el color del texto del variant primary se calcula con
   * CSS `contrast-color()` contra `--nx-color-primary`. En navegadores sin
   * soporte se conserva `--nx-color-text-inverse` como fallback.
   */
  @property({ type: Boolean, reflect: true, attribute: 'auto-contrast' }) autoContrast = false;
  @property({ type: Boolean }) loading = false;
  
  static formAssociated = true;
  private _internals: ElementInternals;

  private get _isDisabled() {
    return this.disabled || this.loading;
  }
  private get _inner() {
    return html`
      ${this.loading ? html`<span class="spinner"></span>` : ''}
      <slot></slot>
    `;
  }
  private _handleClick(e: Event) {
    if (this._isDisabled) {
      e.preventDefault();
      return;
    }

    // 1. Emitir tu evento personalizado (para lógica general)
    this.dispatchEvent(new CustomEvent('nx-button-click', {
      bubbles: true,
      composed: true,
      detail: { 
        originalEvent: e
      } 
    }));

    // 2. Si es tipo "submit", buscar el formulario y enviarlo
    if (this.type === 'submit') {
      this._internals.form?.requestSubmit();
    }
  }

  override render() {
    if (this.href) {
      return html`
        <a
          class="btn variant-${this.variant} size-${this.size}"
          href=${this._isDisabled ? nothing : this.href}
          aria-disabled=${this._isDisabled ? 'true' : nothing}
          tabindex=${this._isDisabled ? '-1' : nothing}
          @click=${this._handleClick}
        >${this._inner}</a>
      `;
    }
    return html`
      <button
        class="btn variant-${this.variant} size-${this.size}"
        type=${this.type}
        ?disabled=${this._isDisabled}
        @click=${this._handleClick}
      >${this._inner}</button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nx-button': NxButton;
  }
}
