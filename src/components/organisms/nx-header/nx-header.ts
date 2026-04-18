import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@/components/atoms/nx-button/nx-button.js';

export interface NavItem { label: string; href: string; active?: boolean; }

@customElement('nx-header')
export class NxHeader extends LitElement {
  static override styles = css`
    :host { display: block; }

    header {
      background: var(--nx-header-bg, var(--nx-color-surface-alt));
      border-bottom: 1px solid var(--nx-color-border);
      height: var(--nx-header-height, 4rem);
      display: flex;
      align-items: center;
      padding: 0 var(--nx-space-8);
      gap: var(--nx-space-8);
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: var(--nx-space-2);
      text-decoration: none;
      flex-shrink: 0;
    }

    .brand-name {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-lg);
      font-weight: 800;
      color: var(--nx-color-primary);
      letter-spacing: -0.02em;
    }

    nav {
      display: flex;
      align-items: center;
      gap: var(--nx-space-1);
      flex: 1;
    }

    .nav-link {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      font-weight: 500;
      color: var(--nx-color-text-muted);
      text-decoration: none;
      padding: var(--nx-space-2) var(--nx-space-3);
      border-radius: var(--nx-radius-md);
      transition: color var(--nx-transition), background var(--nx-transition);
      white-space: nowrap;
    }

    .nav-link:hover  { color: var(--nx-color-text); background: var(--nx-color-surface); }
    .nav-link.active { color: var(--nx-color-primary); font-weight: 600; }

    .actions {
      display: flex;
      align-items: center;
      gap: var(--nx-space-3);
      margin-left: auto;
      flex-shrink: 0;
    }

    /* Mobile hamburger */
    .menu-btn {
      display: none;
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--nx-space-2);
      color: var(--nx-color-text);
      border-radius: var(--nx-radius-md);
    }

    @media (max-width: 768px) {
      header { padding: 0 var(--nx-space-4); }

      nav { display: none; }
      nav.open {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        position: absolute;
        top: var(--nx-header-height, 4rem);
        left: 0;
        right: 0;
        background: var(--nx-header-bg, var(--nx-color-surface-alt));
        border-bottom: 1px solid var(--nx-color-border);
        padding: var(--nx-space-4);
        gap: var(--nx-space-2);
        z-index: 99;
      }

      .menu-btn { display: flex; }
      .actions  { gap: var(--nx-space-2); }
    }
  `;

  @property() brandName = 'nexo';
  @property() brandHref = '/';
  @property({ type: Array }) navItems: NavItem[] = [];
  @property() ctaPrimaryLabel = '';
  @property() ctaSecondaryLabel = '';

  @state() private _menuOpen = false;

  override render() {
    return html`
      <header>
        <a class="brand" href=${this.brandHref}>
          <span class="brand-name">${this.brandName}</span>
        </a>

        <button
          type="button"
          class="menu-btn"
          aria-label=${this._menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded=${String(this._menuOpen)}
          @click=${() => { this._menuOpen = !this._menuOpen; }}
        >
          ${this._menuOpen ? '✕' : '☰'}
        </button>

        <nav class=${this._menuOpen ? 'open' : ''}>
          ${this.navItems.map(item => html`
            <a
              class="nav-link ${item.active ? 'active' : ''}"
              href=${item.href}
              aria-current=${item.active ? 'page' : nothing}
            >${item.label}</a>
          `)}
        </nav>

        <div class="actions">
          ${this.ctaSecondaryLabel ? html`
            <nx-button variant="ghost" size="sm"
              @click=${() => this._emit('secondary')}
            >${this.ctaSecondaryLabel}</nx-button>
          ` : nothing}
          ${this.ctaPrimaryLabel ? html`
            <nx-button variant="primary" size="sm"
              @click=${() => this._emit('primary')}
            >${this.ctaPrimaryLabel}</nx-button>
          ` : nothing}
          <slot name="actions"></slot>
        </div>
      </header>
    `;
  }

  private _emit(cta: 'primary' | 'secondary') {
    this.dispatchEvent(new CustomEvent('nx-header-cta', {
      bubbles: true, composed: true, detail: { cta },
    }));
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-header': NxHeader; }
}
