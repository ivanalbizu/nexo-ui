import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('nx-card')
export class NxCard extends LitElement {
  static override styles = css`
    :host {
      display: block;
    }

    .card {
      background: var(--nx-color-surface-alt);
      border-width: var(--nx-card-border-width, 1px);
      border-style: solid;
      border-color: var(--nx-color-border);
      border-radius: var(--nx-card-radius, var(--nx-radius-card));
      box-shadow: var(--nx-shadow-card);
      overflow: hidden;
      transition: box-shadow var(--nx-transition), transform var(--nx-transition);
    }

    :host([interactive]) .card:hover {
      box-shadow: var(--nx-shadow-lg);
      transform: translateY(-2px);
      cursor: pointer;
    }

    .card-media {
      width: 100%;
      overflow: hidden;
    }

    .card-media ::slotted(img) {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .card-body {
      padding: var(--nx-card-padding, var(--nx-space-6));
    }

    .card-footer {
      padding: var(--nx-space-4) var(--nx-card-padding, var(--nx-space-6));
      border-top: 1px solid var(--nx-color-border);
    }

    .card-footer:empty {
      display: none;
    }
  `;

  @property({ type: Boolean, reflect: true }) interactive = false;

  override render() {
    return html`
      <div class="card" @click=${this._handleClick}>
        <slot name="media" class="card-media"></slot>
        <div class="card-body">
          <slot></slot>
        </div>
        <div class="card-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    `;
  }

  private _handleClick(e: MouseEvent) {
    if (!this.interactive) return;
    this.dispatchEvent(new CustomEvent('nx-card-click', {
      bubbles: true,
      composed: true,
      detail: { originalEvent: e },
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nx-card': NxCard;
  }
}
