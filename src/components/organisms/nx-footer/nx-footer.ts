import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface FooterLink  { label: string; href: string; }
export interface FooterGroup { title: string; links: FooterLink[]; }

@customElement('nx-footer')
export class NxFooter extends LitElement {
  static override styles = css`
    :host { display: block; }

    footer {
      background: var(--nx-color-surface-alt);
      border-top: 1px solid var(--nx-color-border);
      padding: var(--nx-space-12) var(--nx-space-8) var(--nx-space-8);
    }

    .grid {
      display: grid;
      grid-template-columns: 2fr repeat(var(--cols, 3), 1fr);
      gap: var(--nx-space-8);
      margin-bottom: var(--nx-space-10);
    }

    .brand-col { display: flex; flex-direction: column; gap: var(--nx-space-3); }

    .brand-name {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-xl);
      font-weight: 800;
      color: var(--nx-color-primary);
      letter-spacing: -0.02em;
      text-decoration: none;
    }

    .tagline {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      color: var(--nx-color-text-muted);
      line-height: var(--nx-leading-normal);
      max-width: 220px;
    }

    .group-title {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-xs);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--nx-color-text-muted);
      margin: 0 0 var(--nx-space-4);
    }

    .links {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--nx-space-2);
    }

    .links a {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      color: var(--nx-color-text-muted);
      text-decoration: none;
      transition: color var(--nx-transition);
    }
    .links a:hover { color: var(--nx-color-text); }

    .bottom {
      border-top: 1px solid var(--nx-color-border);
      padding-top: var(--nx-space-6);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--nx-space-4);
      flex-wrap: wrap;
    }

    .copyright {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      color: var(--nx-color-text-muted);
    }

    .legal-links {
      display: flex;
      gap: var(--nx-space-4);
    }

    .legal-links a {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      color: var(--nx-color-text-muted);
      text-decoration: none;
    }
    .legal-links a:hover { color: var(--nx-color-text); }

    @media (max-width: 768px) {
      .grid { grid-template-columns: 1fr 1fr; }
      .brand-col { grid-column: 1 / -1; }
      footer { padding: var(--nx-space-8) var(--nx-space-4); }
    }

    @media (max-width: 480px) {
      .grid { grid-template-columns: 1fr; }
    }
  `;

  @property() brandName = 'nexo';
  @property() brandHref = '/';
  @property() tagline   = '';
  @property() copyright = '';
  @property({ type: Array }) groups: FooterGroup[] = [];
  @property({ type: Array }) legalLinks: FooterLink[] = [];

  override render() {
    const year = new Date().getFullYear();
    const copyright = this.copyright || `© ${year} ${this.brandName}. Todos los derechos reservados.`;

    return html`
      <footer style="--cols:${this.groups.length || 3}">
        <div class="grid">
          <div class="brand-col">
            <a class="brand-name" href=${this.brandHref}>${this.brandName}</a>
            ${this.tagline ? html`<p class="tagline">${this.tagline}</p>` : nothing}
            <slot name="brand"></slot>
          </div>

          ${this.groups.map(group => html`
            <div>
              <p class="group-title">${group.title}</p>
              <ul class="links">
                ${group.links.map(link => html`
                  <li><a href=${link.href}>${link.label}</a></li>
                `)}
              </ul>
            </div>
          `)}
        </div>

        <div class="bottom">
          <p class="copyright">${copyright}</p>
          ${this.legalLinks.length ? html`
            <nav class="legal-links" aria-label="Legal">
              ${this.legalLinks.map(link => html`<a href=${link.href}>${link.label}</a>`)}
            </nav>
          ` : nothing}
          <slot name="bottom-right"></slot>
        </div>
      </footer>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-footer': NxFooter; }
}
