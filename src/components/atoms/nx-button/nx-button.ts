import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

@customElement('nx-button')
export class NxButton extends LitElement {
  static override styles = css`
    :host {
      display: inline-block;
    }

    button {
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

    button:focus-visible {
      outline: var(--nx-focus-ring-width) solid var(--nx-focus-ring-color);
      outline-offset: var(--nx-focus-ring-offset);
      box-shadow: var(--nx-shadow-focus);
    }

    button:active:not(:disabled) {
      transform: scale(0.97);
    }

    button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    /* Sizes — consumen tokens de densidad */
    button.size-sm {
      font-size: var(--nx-text-sm);
      padding: 0 var(--nx-button-px-sm, var(--nx-space-3));
      height: var(--nx-button-height-sm, 2rem);
    }
    button.size-md {
      font-size: var(--nx-text-base);
      padding: 0 var(--nx-button-px-md, var(--nx-space-6));
      height: var(--nx-button-height-md, 2.5rem);
    }
    button.size-lg {
      font-size: 1rem;
      padding: 0 var(--nx-button-px-lg, var(--nx-space-8));
      height: var(--nx-button-height-lg, 3rem);
    }

    /* Variants */
    button.variant-primary {
      background: var(--nx-color-primary);
      color: var(--nx-color-text-inverse);
    }
    button.variant-primary:hover:not(:disabled) {
      background: color-mix(in srgb, var(--nx-color-primary) 85%, black);
    }

    /* auto-contrast: usa contrast-color() donde el navegador lo soporte.
       Sólo aplica al variant-primary, que es donde el fondo es el color de marca.
       Si no hay soporte, se conserva el color: var(--nx-color-text-inverse) de arriba. */
    @supports (color: contrast-color(red)) {
      :host([auto-contrast]) button.variant-primary {
        color: contrast-color(var(--nx-color-primary));
      }
    }

    button.variant-secondary {
      background: transparent;
      color: var(--nx-color-primary);
      border: 2px solid var(--nx-color-primary);
    }
    button.variant-secondary:hover:not(:disabled) {
      background: color-mix(in srgb, var(--nx-color-primary) 10%, transparent);
    }

    button.variant-ghost {
      background: transparent;
      color: var(--nx-color-text);
    }
    button.variant-ghost:hover:not(:disabled) {
      background: color-mix(in srgb, var(--nx-color-text) 8%, transparent);
    }
  `;

  @property({ reflect: true }) variant: ButtonVariant = 'primary';
  @property({ reflect: true }) size: ButtonSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property() type: 'button' | 'submit' | 'reset' = 'button';

  /**
   * Cuando es `true`, el color del texto del variant primary se calcula con
   * CSS `contrast-color()` contra `--nx-color-primary`. En navegadores sin
   * soporte se conserva `--nx-color-text-inverse` como fallback.
   */
  @property({ type: Boolean, reflect: true, attribute: 'auto-contrast' }) autoContrast = false;

  override render() {
    return html`
      <button
        class="variant-${this.variant} size-${this.size}"
        type=${this.type}
        ?disabled=${this.disabled}
      >
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nx-button': NxButton;
  }
}
