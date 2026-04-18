import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

let _counter = 0;

@customElement('nx-input')
export class NxInput extends LitElement {
  static formAssociated = true;
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  private readonly _internals = this.attachInternals();
  private readonly _uid = `nx-input-${++_counter}`;

  static override styles = css`
    :host {
      display: block;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    label {
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      font-weight: 600;
      color: var(--nx-color-text);
    }

    /* Oculto visualmente pero presente en el árbol de accesibilidad */
    :host([hide-label]) label {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }

    .required-mark {
      color: var(--nx-color-error);
      margin-left: var(--nx-space-1);
      font-size: var(--nx-text-base);
      line-height: 1;
    }

    .input-row {
      position: relative;
      display: flex;
      align-items: center;
    }

    input {
      width: 100%;
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-base);
      color: var(--nx-color-text);
      background: var(--nx-input-bg, var(--nx-color-surface-alt));
      border-width: var(--nx-input-border-width, 1.5px);
      border-style: solid;
      border-color: var(--nx-input-border, var(--nx-color-border));
      border-radius: var(--nx-input-radius, var(--nx-radius-md));
      padding: 0 var(--nx-input-px, var(--nx-space-4));
      height: var(--nx-input-height, 2.75rem);
      box-sizing: border-box;
      outline: none;
      transition: border-color var(--nx-transition), box-shadow var(--nx-transition);
    }

    input::placeholder {
      color: var(--nx-color-text-muted);
    }

    input:focus-visible {
      border-color: var(--nx-color-primary);
      box-shadow: var(--nx-shadow-focus);
    }

    input:disabled {
      background: var(--nx-color-surface);
      opacity: 0.55;
      cursor: not-allowed;
    }

    input.has-error {
      border-color: var(--nx-color-error);
    }

    input.has-error:focus-visible {
      /* Reutiliza la estética del focus, pero cambia el color de anillo a error */
      --nx-focus-ring-color: var(--nx-color-error);
      box-shadow: var(--nx-shadow-focus);
    }

    /* prefix / suffix icon slots */
    .prefix, .suffix {
      position: absolute;
      display: flex;
      align-items: center;
      color: var(--nx-color-text-muted);
      pointer-events: none;
    }
    .prefix { left: var(--nx-space-3); }
    .suffix { right: var(--nx-space-3); }

    :host([has-prefix]) input { padding-left: 2.5rem; }
    :host([has-suffix]) input { padding-right: 2.5rem; }

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

  @property() type: InputType          = 'text';
  @property() label                     = '';
  @property() value                     = '';
  @property() placeholder               = '';
  @property() name                      = '';
  @property() autocomplete              = '';
  @property() error                     = '';
  @property({ type: Boolean, reflect: true }) disabled   = false;
  @property({ type: Boolean, reflect: true }) required   = false;
  @property({ type: Boolean, reflect: true }) readonly   = false;
  @property({ type: Boolean, reflect: true }) hideLabel  = false;
  @property({ reflect: true, attribute: 'has-prefix', type: Boolean }) hasPrefix = false;
  @property({ reflect: true, attribute: 'has-suffix', type: Boolean }) hasSuffix = false;

  /* Numeric constraints — solo aplican cuando type === 'number' */
  @property() min: string | number = '';
  @property() max: string | number = '';
  @property() step: string | number = '';

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('error') || changed.has('required')) {
      this._internals.setFormValue(this.value);
      this._updateValidity();
    }
  }

  formResetCallback() {
    this.value = '';
    this._internals.setFormValue('');
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private _updateValidity() {
    const input = this.shadowRoot?.querySelector('input') ?? undefined;
    if (this.required && !this.value) {
      this._internals.setValidity({ valueMissing: true }, 'Este campo es obligatorio', input);
    } else if (this.error) {
      this._internals.setValidity({ customError: true }, this.error, input);
    } else {
      this._internals.setValidity({});
    }
  }

  override render() {
    const errorId = `${this._uid}-error`;

    return html`
      <div class="wrapper">
        ${this.label ? html`
          <label for=${this._uid}>
            ${this.label}
            ${this.required ? html`<span class="required-mark" aria-hidden="true">*</span>` : ''}
          </label>
        ` : ''}

        <div class="input-row">
          <slot name="prefix" class="prefix" @slotchange=${this._onPrefixSlot}></slot>
          <input
            id=${this._uid}
            type=${this.type}
            name=${this.name}
            placeholder=${this.placeholder}
            autocomplete=${this.autocomplete}
            .value=${this.value}
            ?disabled=${this.disabled}
            ?required=${this.required}
            ?readonly=${this.readonly}
            min=${this.type === 'number' && this.min !== '' ? this.min : nothing}
            max=${this.type === 'number' && this.max !== '' ? this.max : nothing}
            step=${this.type === 'number' && this.step !== '' ? this.step : nothing}
            class=${this.error ? 'has-error' : ''}
            aria-invalid=${this.error ? 'true' : 'false'}
            aria-describedby=${this.error ? errorId : ''}
            @input=${this._onInput}
            @change=${this._onChange}
          />
          <slot name="suffix" class="suffix" @slotchange=${this._onSuffixSlot}></slot>
        </div>

        ${this.error ? html`
          <span class="error-msg" id=${errorId} role="alert">${this.error}</span>
        ` : ''}
      </div>
    `;
  }

  private _onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('nx-input-input', {
      bubbles: true, composed: true, detail: { value: this.value },
    }));
  }

  private _onChange(e: Event) {
    this.value = (e.target as HTMLInputElement).value;
    this.dispatchEvent(new CustomEvent('nx-input-change', {
      bubbles: true, composed: true, detail: { value: this.value },
    }));
  }

  private _onPrefixSlot(e: Event) {
    this.hasPrefix = (e.target as HTMLSlotElement).assignedNodes().length > 0;
  }

  private _onSuffixSlot(e: Event) {
    this.hasSuffix = (e.target as HTMLSlotElement).assignedNodes().length > 0;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-input': NxInput; }
}
