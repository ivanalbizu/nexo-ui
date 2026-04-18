import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('nx-form-field')
export class NxFormField extends LitElement {
  static override styles = css`
    :host { display: block; }

    .field { display: flex; flex-direction: column; gap: var(--nx-space-1); }

    label {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      font-weight: 600;
      color: var(--nx-color-text);
      display: flex;
      align-items: center;
      gap: var(--nx-space-1);
    }

    .required-mark {
      color: var(--nx-color-error);
      font-size: var(--nx-text-base);
      line-height: 1;
    }

    .hint {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      color: var(--nx-color-text-muted);
    }

    .error-msg {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      color: var(--nx-color-error);
      display: flex;
      align-items: center;
      gap: var(--nx-space-1);
    }

    .error-msg::before {
      content: '⚠';
      font-size: 0.875em;
    }
  `;

  @property() label    = '';
  @property() hint     = '';
  @property() error    = '';
  @property() fieldId  = '';
  @property({ type: Boolean }) required = false;

  override render() {
    return html`
      <div class="field">
        ${this.label ? html`
          <label for=${this.fieldId || nothing}>
            ${this.label}
            ${this.required ? html`<span class="required-mark" aria-hidden="true">*</span>` : nothing}
          </label>
        ` : nothing}

        <slot></slot>

        ${this.error
          ? html`<span class="error-msg" role="alert">${this.error}</span>`
          : this.hint
            ? html`<span class="hint">${this.hint}</span>`
            : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-form-field': NxFormField; }
}
