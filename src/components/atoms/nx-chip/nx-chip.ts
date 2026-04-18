import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('nx-chip')
export class NxChip extends LitElement {
  static override styles = css`
    :host { display: inline-flex; }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: var(--nx-space-2);
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      font-weight: 500;
      padding: var(--nx-space-1) var(--nx-space-3);
      border-radius: var(--nx-chip-radius, var(--nx-radius-full));
      border: 1.5px solid var(--nx-color-border);
      background: var(--nx-color-surface-alt);
      color: var(--nx-color-text);
      cursor: default;
      user-select: none;
      transition: background var(--nx-transition), border-color var(--nx-transition), color var(--nx-transition);
      line-height: 1;
    }

    :host([selectable]) .chip {
      cursor: pointer;
    }

    :host([selected]) .chip {
      background: var(--nx-color-primary-subtle);
      border-color: var(--nx-color-primary);
      color: var(--nx-color-primary);
    }

    :host([selectable]:not([selected])) .chip:hover {
      border-color: var(--nx-color-border-strong);
      background: var(--nx-color-surface);
    }

    .chip:focus-visible {
      outline: var(--nx-focus-ring-width) solid var(--nx-focus-ring-color);
      outline-offset: var(--nx-focus-ring-offset);
    }

    .remove-btn:focus-visible {
      outline: var(--nx-focus-ring-width) solid var(--nx-focus-ring-color);
      outline-offset: 1px;
      opacity: 1;
    }

    :host([disabled]) .chip {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .remove-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.1em;
      height: 1.1em;
      border: none;
      background: none;
      padding: 0;
      cursor: pointer;
      color: inherit;
      opacity: 0.6;
      border-radius: 50%;
      transition: opacity var(--nx-transition);
      font-size: 1em;
      line-height: 1;
    }

    .remove-btn:hover { opacity: 1; }
  `;

  @property({ type: Boolean, reflect: true }) selectable = false;
  @property({ type: Boolean, reflect: true }) selected   = false;
  @property({ type: Boolean, reflect: true }) removable  = false;
  @property({ type: Boolean, reflect: true }) disabled   = false;

  override render() {
    return html`
      <div
        class="chip"
        role=${this.selectable ? 'checkbox' : 'none'}
        aria-checked=${this.selectable ? String(this.selected) : nothing}
        tabindex=${this.selectable && !this.disabled ? '0' : nothing}
        @click=${this._handleClick}
        @keydown=${this._handleKeydown}
      >
        <slot></slot>
        ${this.removable ? html`
          <button
            type="button"
            class="remove-btn"
            aria-label="Eliminar"
            @click=${this._handleRemove}
            ?disabled=${this.disabled}
          >✕</button>
        ` : nothing}
      </div>
    `;
  }

  private _handleClick() {
    if (this.disabled || !this.selectable) return;
    this.selected = !this.selected;
    this.dispatchEvent(new CustomEvent('nx-chip-change', {
      bubbles: true, composed: true,
      detail: { selected: this.selected },
    }));
  }

  private _handleKeydown(e: KeyboardEvent) {
    // Solo si el foco está en el chip, no en un hijo (ej. remove-btn).
    // Si no, interceptaríamos el Enter/Space de ese botón con preventDefault().
    if (e.target !== e.currentTarget) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); this._handleClick(); }
  }

  private _handleRemove(e: MouseEvent) {
    e.stopPropagation();
    const event = new CustomEvent('nx-chip-remove', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    const cancelled = !this.dispatchEvent(event);
    if (!cancelled) this.remove();
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-chip': NxChip; }
}
