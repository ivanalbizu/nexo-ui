import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type SpinnerSize = 'sm' | 'md' | 'lg';

@customElement('nx-spinner')
export class NxSpinner extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      border-radius: 50%;
      border-style: solid;
      border-color: color-mix(in srgb, var(--nx-color-primary) 20%, transparent);
      border-top-color: var(--nx-color-primary);
      animation: spin 0.7s linear infinite;
      flex-shrink: 0;
    }

    .size-sm { width: 1rem;   height: 1rem;   border-width: 2px; }
    .size-md { width: 1.5rem; height: 1.5rem; border-width: 2.5px; }
    .size-lg { width: 2.5rem; height: 2.5rem; border-width: 3px; }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* No detenerlo del todo: el usuario sigue necesitando saber que hay actividad */
    @media (prefers-reduced-motion: reduce) {
      .spinner { animation-duration: 3s; }
    }
  `;

  @property({ reflect: true }) size: SpinnerSize = 'md';
  @property() label = 'Cargando…';

  override render() {
    return html`
      <span
        class="spinner size-${this.size}"
        role="status"
        aria-label=${this.label}
      ></span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-spinner': NxSpinner; }
}
