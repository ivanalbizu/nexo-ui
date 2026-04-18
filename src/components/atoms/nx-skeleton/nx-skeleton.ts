import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type SkeletonVariant = 'text' | 'rect' | 'circle';

@customElement('nx-skeleton')
export class NxSkeleton extends LitElement {
  static override styles = css`
    :host { display: block; }

    .skeleton {
      background: linear-gradient(
        90deg,
        var(--nx-color-border) 25%,
        color-mix(in srgb, var(--nx-color-border) 60%, var(--nx-color-surface-alt)) 50%,
        var(--nx-color-border) 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.4s ease-in-out infinite;
    }

    .variant-text   { border-radius: var(--nx-radius-sm); height: 1em; }
    .variant-rect   { border-radius: var(--nx-radius-md); }
    .variant-circle { border-radius: 50%; }

    @keyframes shimmer {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .skeleton { animation: none; background: var(--nx-color-border); }
    }
  `;

  @property({ reflect: true }) variant: SkeletonVariant = 'text';
  @property() width  = '100%';
  @property() height = '';

  override render() {
    const style = [
      `width:${this.width}`,
      this.height ? `height:${this.height}` : '',
      this.variant === 'circle' && this.width ? `height:${this.width}` : '',
    ].filter(Boolean).join(';');

    return html`
      <div
        class="skeleton variant-${this.variant}"
        style=${style}
        aria-hidden="true"
      ></div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-skeleton': NxSkeleton; }
}
