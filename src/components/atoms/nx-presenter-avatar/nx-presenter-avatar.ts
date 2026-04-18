import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type PresenterSize = 'sm' | 'md' | 'lg';

@customElement('nx-presenter-avatar')
export class NxPresenterAvatar extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      gap: var(--nx-space-2);
      text-align: center;
      font-family: var(--nx-font-sans);
      color: var(--nx-color-text-inverse, #fff);
      --_size: var(--nx-presenter-size, 7rem);
    }

    :host([size="sm"]) { --_size: 5rem; }
    :host([size="lg"]) { --_size: 9rem; }

    .halo {
      width: var(--_size);
      height: var(--_size);
      border-radius: 50%;
      background: var(--nx-color-accent);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center top;
      display: block;
    }

    .placeholder {
      width: 60%;
      height: 60%;
      align-self: center;
      color: color-mix(in srgb, var(--nx-color-text-inverse, #fff) 55%, transparent);
    }

    .name {
      font-weight: 700;
      font-size: var(--nx-text-base);
      color: var(--nx-color-accent);
      margin: 0;
      line-height: 1.2;
    }

    .role {
      font-weight: 400;
      font-size: var(--nx-text-sm);
      color: var(--nx-color-text-inverse, #fff);
      margin: 0;
      line-height: 1.3;
      max-width: calc(var(--_size) * 1.6);
    }
  `;

  @property() photo = '';
  @property() name = '';
  @property() role = '';
  @property() alt = '';
  @property({ reflect: true }) size: PresenterSize = 'md';

  override render() {
    return html`
      <div class="halo" aria-hidden=${this.name ? 'false' : 'true'}>
        ${this.photo
          ? html`<img class="photo" src=${this.photo} alt=${this.alt || this.name} />`
          : html`<svg class="placeholder" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-8 2-8 6v1h16v-1c0-4-4-6-8-6Z"/></svg>`}
      </div>
      ${this.name ? html`<p class="name">${this.name}</p>` : ''}
      ${this.role ? html`<p class="role">${this.role}</p>` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-presenter-avatar': NxPresenterAvatar; }
}
