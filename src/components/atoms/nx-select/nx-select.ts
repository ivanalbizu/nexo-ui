import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { utilities } from '@/css/utilities.ts';
import '@/components/atoms/nx-badge/nx-badge.js';

/** Cada opción del select. `disabled` permite vetar entradas individuales. */
export interface NxSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/** Grupo de opciones — se pinta como `<optgroup>` o como sección del listbox. */
export interface NxSelectGroup {
  label: string;
  options: NxSelectOption[];
}

/** Un item de `options` puede ser una opción suelta o un grupo. */
export type NxSelectItem = NxSelectOption | NxSelectGroup;

/** Tamaños — alineados con `nx-button` / `nx-input`. */
export type NxSelectSize = 'sm' | 'md' | 'lg';

const isGroup = (item: NxSelectItem): item is NxSelectGroup =>
  Array.isArray((item as NxSelectGroup).options);

let _counter = 0;

/**
 * Select form-associated con dos modos:
 *
 *  · Por defecto — `<select>` nativo. Path moderno con `appearance: base-select`
 *    (Chrome 130+) para popup estilizado; fallback al popup nativo del SO.
 *
 *  · `searchable` — combobox ARIA propio (`role="combobox"` + `role="listbox"`)
 *    con filter en vivo. Necesario porque el `<select>` nativo no admite un
 *    `<input>` dentro del popup en navegadores actuales.
 *
 * En ambos modos la asociación con `<form>` se hace vía `ElementInternals`.
 */
@customElement('nx-select')
export class NxSelect extends LitElement {
  static formAssociated = true;
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  private readonly _internals = this.attachInternals();
  private readonly _uid = `nx-select-${++_counter}`;

  static override styles = [utilities, css`
    :host {
      display: block;
      /* Tamaño 'md' por defecto. Los selectores :host([size=...]) sólo
         reescriben estas vars; el control las consume siempre igual y los
         tokens públicos --nx-input-* siguen ganando por ir primero en var(). */
      --nx-select-px: var(--nx-space-4);
      --nx-select-py: var(--nx-space-2);
      --nx-select-fs: var(--nx-text-base);
      --nx-select-control-h: 1.5rem;
      /* line-height del <select>. Por defecto = altura del control (centra
         bien en md/lg). En sm se sube porque Chrome descentra el texto del
         <select> con fuentes pequeñas aunque line-height == height. */
      --nx-select-control-lh: var(--nx-select-control-h);
    }

    :host([size="sm"]) {
      --nx-select-px: var(--nx-space-3);
      --nx-select-py: var(--nx-space-1);
      --nx-select-fs: var(--nx-text-sm);
      --nx-select-control-h: 1.375rem;
      --nx-select-control-lh: 2;
    }

    :host([size="lg"]) {
      --nx-select-px: var(--nx-space-6);
      --nx-select-py: var(--nx-space-3);
      --nx-select-fs: 1rem;
      --nx-select-control-h: 1.625rem;
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

    /* Caja visual: borde, fondo y padding viven en .field para que el control
       interno (select | input) sea transparente y el centrado se controle
       desde aquí. Grid de dos columnas (control + caret) evita overlap.
       La altura nace del contenido + padding-block. */
    .field {
      display: flex;
      align-items: center;
      gap: var(--nx-space-2);
      background: var(--nx-input-bg, var(--nx-color-surface-alt));
      border-width: var(--nx-input-border-width, 1.5px);
      border-style: solid;
      border-color: var(--nx-input-border, var(--nx-color-border));
      border-radius: var(--nx-input-radius, var(--nx-radius-md));
      padding-inline: var(--nx-input-px, var(--nx-select-px));
      padding-block: var(--nx-input-py, var(--nx-select-py));
      box-sizing: border-box;
      cursor: pointer;
      transition: border-color var(--nx-transition), box-shadow var(--nx-transition);
    }

    .field:focus-within {
      border-color: var(--nx-color-primary);
      box-shadow: var(--nx-shadow-focus);
    }

    .field.has-error {
      border-color: var(--nx-color-error);
    }

    .field.has-error:focus-within {
      --nx-focus-ring-color: var(--nx-color-error);
      box-shadow: var(--nx-shadow-focus);
    }

    :host([disabled]) .field {
      background: var(--nx-color-surface);
      opacity: 0.55;
      cursor: not-allowed;
    }

    select,
    input[role="combobox"] {
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      border: none;
      outline: none;
      font-family: var(--nx-font-sans);
      font-size: var(--nx-select-fs);
      color: var(--nx-color-text);
      cursor: inherit;
      padding: 0;
      margin: 0;
    }

    /* <select>: altura explícita + line-height igual a esa altura. El
       navegador centra el texto de la opción de forma determinista cuando el
       <select> tiene height explícito; dejarlo en auto (line-height unitless)
       descentra el texto, sobre todo en fuentes pequeñas. */
    select {
      height: var(--nx-select-control-h);
      line-height: var(--nx-select-control-lh);
    }

    /* Control principal (select | .content): ocupa el espacio libre del flex
       del .field; prefix/suffix/caret se quedan a tamaño contenido. */
    select,
    .content {
      flex: 1;
      min-width: 0;
    }

    input[role="combobox"] {
      cursor: text;
      line-height: 1.5;
    }

    input[role="combobox"]::placeholder {
      color: var(--nx-color-text-muted);
    }

    /* Cuando no hay valor, mostramos el placeholder más tenue. */
    select.is-placeholder {
      color: var(--nx-color-text-muted);
    }

    /* Caret manual (SVG inline para centrado óptico predecible). Se oculta en
       el path moderno SOLO cuando hay un <select> con appearance: base-select;
       en modo searchable seguimos pintándolo nosotros y rota cuando _open. */
    .caret {
      display: flex;
      width: 0.75rem;
      height: 0.75rem;
      color: var(--nx-color-text-muted);
      pointer-events: none;
    }
    .caret svg {
      width: 100%;
      height: 100%;
      display: block;
      transition: transform var(--nx-transition);
    }
    .field.is-open .caret svg {
      transform: rotate(180deg);
    }

    /* Trailing area: agrupa slot suffix + clear-btn + caret. */
    .trailing {
      display: flex;
      align-items: center;
      gap: var(--nx-space-2);
    }

    /* Slots decorativos prefix/suffix. Se ocultan (sin hueco de gap, por ser
       flex) cuando no hay contenido — has-prefix/has-suffix se reflejan desde
       los slotchange. */
    .affix {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      color: var(--nx-color-text-muted);
    }
    :host(:not([has-prefix])) .affix-prefix { display: none; }
    :host(:not([has-suffix])) .affix-suffix { display: none; }

    .clear-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: var(--nx-color-text-muted);
      cursor: pointer;
      transition: background var(--nx-transition), color var(--nx-transition);
    }
    .clear-btn:hover {
      color: var(--nx-color-text);
      background: color-mix(in srgb, var(--nx-color-text) 10%, transparent);
    }
    .clear-btn:focus-visible {
      outline: var(--nx-focus-ring-width) solid var(--nx-focus-ring-color);
      outline-offset: 1px;
    }
    .clear-btn svg {
      width: 0.625rem;
      height: 0.625rem;
      display: block;
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
      font-size: 0.875rem;
    }

    /* ─── Modo searchable / multi: combobox + listbox propio ─────────────── */
    .combo-anchor {
      position: relative;
    }

    /* Wrapper flex-wrap que ocupa la primera columna del grid: deja que chips
       e input convivan en una línea, envuelvan cuando excedan el ancho, y
       que el .trailing siga fijo a la derecha sin reorganizar nada. */
    .content {
      display: flex;
      flex-wrap: wrap;
      gap: var(--nx-space-1);
      align-items: center;
      min-width: 0;
    }

    .content input[role="combobox"] {
      /* basis 10rem + min-width igual: el input siempre tiene ≥10rem reales
         para teclear cómodo. Si en la fila actual no caben 10rem, envuelve a
         la siguiente fila en vez de quedarse comprimido a 7-8rem. */
      flex: 1 1 10rem;
      min-width: 10rem;
    }

    /* Botón × dentro de cada chip. Hereda color via currentColor del badge. */
    .chip-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1rem;
      height: 1rem;
      margin-left: var(--nx-space-1);
      margin-right: calc(var(--nx-space-2) * -0.5);
      padding: 0;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: inherit;
      cursor: pointer;
      opacity: 0.65;
      transition: opacity var(--nx-transition), background var(--nx-transition);
    }
    .chip-close:hover {
      opacity: 1;
      background: color-mix(in srgb, currentColor 15%, transparent);
    }
    .chip-close:focus-visible {
      outline: var(--nx-focus-ring-width) solid var(--nx-focus-ring-color);
      outline-offset: 1px;
    }
    .chip-close svg {
      width: 0.5rem;
      height: 0.5rem;
      display: block;
    }

    /* Popup: la caja flotante. Contiene el header opcional (multi) y el
       listbox scrollable. La posición absolute y el flip viven aquí. */
    .popup {
      position: absolute;
      top: calc(100% + var(--nx-space-1));
      left: 0;
      right: 0;
      background: var(--nx-color-surface-alt);
      border: 1px solid var(--nx-color-border);
      border-radius: var(--nx-select-picker-radius, var(--nx-input-radius, var(--nx-radius-md)));
      box-shadow: var(--nx-shadow-card);
      z-index: 10;
      overflow: hidden; /* recorta header/listbox al border-radius */
    }

    .popup[hidden] {
      display: none;
    }

    .popup.is-flipped {
      top: auto;
      bottom: calc(100% + var(--nx-space-1));
    }

    /* Header con acciones "Seleccionar todo" / "Limpiar" (sólo multi). */
    .popup-header {
      display: flex;
      gap: var(--nx-space-1);
      padding: var(--nx-space-1);
      border-bottom: 1px solid var(--nx-color-border);
    }

    .popup-action {
      flex: 1;
      padding: var(--nx-space-1) var(--nx-space-2);
      border: none;
      border-radius: var(--nx-select-option-radius, var(--nx-input-radius, var(--nx-radius-sm)));
      background: transparent;
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-sm);
      font-weight: 600;
      color: var(--nx-color-primary);
      cursor: pointer;
      transition: background var(--nx-transition);
    }
    .popup-action:hover:not(:disabled) {
      background: var(--nx-color-primary-subtle);
    }
    .popup-action:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .popup-action:focus-visible {
      outline: var(--nx-focus-ring-width) solid var(--nx-focus-ring-color);
      outline-offset: -2px;
    }

    .listbox {
      margin: 0;
      padding: var(--nx-space-1);
      max-height: 16rem;
      overflow-y: auto;
      /* Reserva el alto de la .group-label sticky para que scrollIntoView no
         deje la opción activa tapada por la cabecera al navegar con teclado. */
      scroll-padding-top: calc(var(--nx-text-xs) * 1.5 + var(--nx-space-2) * 2);
      font-family: var(--nx-font-sans);
      font-size: var(--nx-select-fs);
      color: var(--nx-color-text);
    }

    .listbox [role="option"] {
      padding: var(--nx-space-2) var(--nx-space-3);
      border-radius: var(--nx-select-option-radius, var(--nx-input-radius, var(--nx-radius-sm)));
      cursor: pointer;
      line-height: 1.5;
    }

    .listbox [role="option"].is-active {
      background: var(--nx-color-primary-subtle);
    }

    /* Single: la opción elegida se rellena con el color de marca. */
    .listbox [role="option"][aria-selected="true"] {
      background: var(--nx-color-primary);
      color: var(--nx-color-text-inverse);
    }

    .listbox [role="option"][aria-disabled="true"] {
      opacity: 0.45;
      cursor: not-allowed;
    }

    .listbox .empty {
      padding: var(--nx-space-3);
      color: var(--nx-color-text-muted);
      cursor: default;
      text-align: center;
    }

    /* Cabecera de grupo (optgroup). Sticky para no perder el contexto al
       hacer scroll dentro de una lista larga. */
    .group-label {
      position: sticky;
      top: 0;
      padding: var(--nx-space-1) var(--nx-space-3);
      background: var(--nx-color-surface-alt);
      font-size: var(--nx-text-xs);
      line-height: 1.5;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--nx-color-text-muted);
    }

    /* Multi: la selección se señala con un checkmark, no con relleno.
       El fondo queda libre para el estado activo (teclado). */
    .listbox.is-multiple [role="option"] {
      display: flex;
      align-items: center;
      gap: var(--nx-space-2);
    }
    .listbox.is-multiple [role="option"][aria-selected="true"] {
      background: transparent;
      color: var(--nx-color-text);
    }
    .listbox.is-multiple [role="option"][aria-selected="true"].is-active {
      background: var(--nx-color-primary-subtle);
    }
    .listbox.is-multiple [role="option"] .check {
      display: flex;
      width: 0.875rem;
      height: 0.875rem;
      flex-shrink: 0;
      color: var(--nx-color-primary);
      visibility: hidden;
    }
    .listbox.is-multiple [role="option"][aria-selected="true"] .check {
      visibility: visible;
    }
    .listbox.is-multiple [role="option"] .check svg {
      width: 100%;
      height: 100%;
      display: block;
    }

    /* Chip "+N más" / "Ver menos": botón con aspecto de badge neutral. */
    .chip-more {
      display: inline-flex;
      align-items: center;
      padding: 2px var(--nx-space-2);
      border: none;
      border-radius: var(--nx-badge-radius, var(--nx-radius-full));
      background: var(--nx-color-border);
      color: var(--nx-color-text-muted);
      font-family: var(--nx-font-sans);
      font-size: var(--nx-text-xs);
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      transition: color var(--nx-transition);
    }
    .chip-more:hover {
      color: var(--nx-color-text);
    }
    .chip-more:focus-visible {
      outline: var(--nx-focus-ring-width) solid var(--nx-focus-ring-color);
      outline-offset: 1px;
    }

    /* ─── Path moderno: appearance: base-select ────────────────────────────
       Sólo navegadores con soporte. Activa el popup totalmente custom y
       estiliza ::picker(select) con los mismos tokens. */
    @supports (appearance: base-select) {
      select {
        appearance: base-select;
      }

      /* Sólo ocultar el caret manual cuando hay un <select> nativo (path
         estándar) — el navegador pinta su propio ::picker-icon. En modo
         searchable no hay <select> y el caret debe verse. */
      select ~ .trailing .caret {
        display: none;
      }

      ::picker(select) {
        appearance: base-select;
        background: var(--nx-color-surface-alt);
        border: 1px solid var(--nx-color-border);
        border-radius: var(--nx-select-picker-radius, var(--nx-input-radius, var(--nx-radius-md)));
        box-shadow: var(--nx-shadow-card);
        padding: var(--nx-space-1);
        font-family: var(--nx-font-sans);
        font-size: var(--nx-text-base);
        color: var(--nx-color-text);
        min-width: anchor-size(width);
      }

      option {
        padding: var(--nx-space-2) var(--nx-space-3);
        border-radius: var(--nx-select-option-radius, var(--nx-input-radius, var(--nx-radius-sm)));
        cursor: pointer;
      }

      option:hover:not(:disabled) {
        background: var(--nx-color-primary-subtle);
      }

      option:checked {
        background: var(--nx-color-primary);
        color: var(--nx-color-text-inverse);
      }

      option:disabled {
        opacity: 0.45;
        cursor: not-allowed;
      }
    }
  `];

  @property() name        = '';
  @property() value       = '';
  @property() label       = '';
  @property() placeholder = '';
  @property() error       = '';
  @property({ type: Array }) options: NxSelectItem[] = [];
  @property({ type: Boolean, reflect: true }) disabled  = false;
  @property({ type: Boolean, reflect: true }) required  = false;
  @property({ type: Boolean, reflect: true }) searchable = false;
  /** Si > 0 y `options.length` lo iguala o supera, fuerza el modo searchable
      aunque la prop `searchable` sea false. 0 = nunca auto-activar. */
  @property({ type: Number, attribute: 'searchable-after' }) searchableAfter = 0;
  /** Modo multi-select. Cuando true, fuerza la UI custom (combobox) y usa
      `values: string[]` como fuente de verdad en lugar de `value`. */
  @property({ type: Boolean, reflect: true }) multiple = false;
  /** Valores seleccionados en modo multi. Ignorado cuando `multiple` es false. */
  @property({ type: Array }) values: string[] = [];
  /** Multi: nº máximo de chips visibles antes de colapsar el resto en "+N más".
      0 = sin límite (muestra todos). */
  @property({ type: Number, attribute: 'chip-limit' }) chipLimit = 0;
  /** Multi: tope de valores seleccionables. 0 = sin tope. */
  @property({ type: Number, attribute: 'max-selected' }) maxSelected = 0;
  /** Tamaño del control — ajusta padding y tipografía vía tokens internos. */
  @property({ reflect: true }) size: NxSelectSize = 'md';
  @property({ type: Boolean, reflect: true, attribute: 'hide-label' }) hideLabel = false;
  /** Reflejados desde los `slotchange` de prefix/suffix para CSS. */
  @property({ type: Boolean, reflect: true, attribute: 'has-prefix' }) hasPrefix = false;
  @property({ type: Boolean, reflect: true, attribute: 'has-suffix' }) hasSuffix = false;

  /* Estado interno del modo searchable. */
  @state() private _open = false;
  @state() private _query = '';
  @state() private _activeIndex = -1;
  /** Verdadero cuando el usuario ha tecleado desde el último focus/selección.
      Mientras sea false, el filter está inactivo y se ve la lista completa. */
  @state() private _editing = false;
  /** Cuando no cabe el popup abajo, se posiciona arriba del field. */
  @state() private _flipped = false;
  /** Multi: si los chips colapsados por `chipLimit` están desplegados. */
  @state() private _chipsExpanded = false;

  /** Todas las opciones aplanadas (los grupos se expanden en su sitio).
      Es la fuente de verdad para lookups por value, índices y filter. */
  private get _flatOptions(): NxSelectOption[] {
    return this.options.flatMap(item => isGroup(item) ? item.options : [item]);
  }

  /** Searchable efectivo: prop explícita o auto-activado por umbral. */
  private get _isSearchable(): boolean {
    return this.searchable || (this.searchableAfter > 0 && this._flatOptions.length >= this.searchableAfter);
  }

  /** ¿Hay que pintar la UI custom? Sí cuando hay search o cuando es multi
      (porque <select multiple> nativo no es la UX que queremos). */
  private get _isCombobox(): boolean {
    return this._isSearchable || this.multiple;
  }

  /** Etiqueta de un value, si existe en options. */
  private _labelOf(value: string): string {
    return this._flatOptions.find(o => o.value === value)?.label ?? value;
  }

  /** ¿La opción pasa el filter activo? Sin filter (o sin query), todo pasa. */
  private _matchesQuery(opt: NxSelectOption): boolean {
    if (!this._editing || !this._query) return true;
    return this._normalize(opt.label).includes(this._normalize(this._query));
  }

  /** Multi: ¿se alcanzó el tope `maxSelected`? */
  private get _isMaxed(): boolean {
    return this.multiple && this.maxSelected > 0 && this.values.length >= this.maxSelected;
  }

  /** Multi: ¿están todas las opciones seleccionables ya elegidas (o tope lleno)? */
  private get _allSelected(): boolean {
    const selectable = this._flatOptions.filter(o => !o.disabled);
    if (selectable.length === 0) return false;
    if (this.maxSelected > 0) return this.values.length >= this.maxSelected;
    return selectable.every(o => this.values.includes(o.value));
  }

  private _refocusInput() {
    requestAnimationFrame(() => {
      this.shadowRoot?.querySelector('input')?.focus();
    });
  }

  private _selectAll = () => {
    const selectable = this._flatOptions.filter(o => !o.disabled).map(o => o.value);
    this.values = this.maxSelected > 0 ? selectable.slice(0, this.maxSelected) : selectable;
    this._dispatchChange();
    this._refocusInput();
  };

  private _clearAll = () => {
    this.values = [];
    this._dispatchChange();
    this._refocusInput();
  };

  /** mousedown handler para botones del popup: evita que el botón robe el
      foco al input (así el popup no se cierra ni parpadea). */
  private _keepFocus = (e: Event) => e.preventDefault();

  private _onPrefixSlot = (e: Event) => {
    this.hasPrefix = (e.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  private _onSuffixSlot = (e: Event) => {
    this.hasSuffix = (e.target as HTMLSlotElement).assignedNodes().length > 0;
  };

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('pointerdown', this._onDocPointerDown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('pointerdown', this._onDocPointerDown);
  }

  override updated(changed: Map<string, unknown>) {
    if (
      changed.has('value') || changed.has('values') ||
      changed.has('error') || changed.has('required') || changed.has('multiple')
    ) {
      this._syncFormValue();
      this._updateValidity();
    }
    if ((changed.has('value') || changed.has('values')) && !this._open) {
      this._query = this.multiple ? '' : this._selectedLabel();
      this._editing = false;
    }
    if (changed.has('_open') && this._open) {
      this._measurePopupPosition();
    }
    if (changed.has('_activeIndex') && this._activeIndex >= 0) {
      this._scrollActiveIntoView();
    }
  }

  private _syncFormValue() {
    if (this.multiple) {
      const fd = new FormData();
      if (this.name) for (const v of this.values) fd.append(this.name, v);
      this._internals.setFormValue(fd);
    } else {
      this._internals.setFormValue(this.value);
    }
  }

  /** Decide si el popup va arriba o abajo según el espacio disponible. */
  private _measurePopupPosition() {
    const field = this.shadowRoot?.querySelector('.field') as HTMLElement | null;
    if (!field) return;
    const rect = field.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    // Aproximación al max-height del listbox (16rem ≈ 256px).
    const popupHeight = 256;
    this._flipped = spaceBelow < popupHeight && spaceAbove > spaceBelow;
  }

  formResetCallback() {
    this.value = '';
    this.values = [];
    this._query = '';
    this._editing = false;
    this._open = false;
    this._activeIndex = -1;
    this._syncFormValue();
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  private _updateValidity() {
    const anchor =
      (this.shadowRoot?.querySelector('select, input') as HTMLElement | null) ?? undefined;
    const isEmpty = this.multiple ? this.values.length === 0 : !this.value;
    if (this.required && isEmpty) {
      this._internals.setValidity({ valueMissing: true }, 'Selecciona una opción', anchor);
    } else if (this.error) {
      this._internals.setValidity({ customError: true }, this.error, anchor);
    } else {
      this._internals.setValidity({});
    }
  }

  /** Lista plana filtrada — su orden coincide con el de render, así los
      índices de teclado (`_activeIndex`) se mapean 1:1. */
  private get _filtered(): NxSelectOption[] {
    return this._flatOptions.filter(o => this._matchesQuery(o));
  }

  private _normalize(s: string): string {
    return s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }

  private _selectedLabel(): string {
    return this._flatOptions.find(o => o.value === this.value)?.label ?? '';
  }

  private _scrollActiveIntoView() {
    const el = this.shadowRoot?.querySelector('.listbox .is-active');
    // behavior: 'auto' explícito para no animar aunque haya un
    // scroll-behavior: smooth heredado en el documento.
    if (el instanceof HTMLElement) el.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }

  private _onDocPointerDown = (e: PointerEvent) => {
    if (!this._open) return;
    if (!e.composedPath().includes(this)) {
      this._closePopup();
    }
  };

  private _closePopup() {
    this._open = false;
    this._editing = false;
    this._query = this._selectedLabel();
    this._activeIndex = -1;
  }

  private _select(opt: NxSelectOption) {
    if (opt.disabled) return;
    if (this.multiple) {
      const isSelected = this.values.includes(opt.value);
      // Bloqueado por tope: sólo si es un alta nueva (deseleccionar siempre vale).
      if (!isSelected && this._isMaxed) return;
      // Toggle: añadir o quitar del array. El popup queda abierto para
      // permitir seleccionar varias opciones consecutivas.
      this.values = isSelected
        ? this.values.filter(v => v !== opt.value)
        : [...this.values, opt.value];
      this._query = '';
      this._editing = false;
      // Refocus al input (el click en el <li> puede haberlo perdido).
      this._refocusInput();
    } else {
      this.value = opt.value;
      this._query = opt.label;
      this._editing = false;
      this._open = false;
      this._activeIndex = -1;
    }
    this._dispatchChange();
  }

  private _removeChip(value: string) {
    if (this.disabled) return;
    this.values = this.values.filter(v => v !== value);
    this._dispatchChange();
    requestAnimationFrame(() => {
      this.shadowRoot?.querySelector('input')?.focus();
    });
  }

  private _dispatchChange() {
    this.dispatchEvent(new CustomEvent('nx-select-change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value, values: this.values },
    }));
  }

  private _clear = (e: Event) => {
    e.stopPropagation();
    if (this.multiple) {
      this.values = [];
    } else {
      this.value = '';
    }
    this._query = '';
    this._editing = false;
    this._activeIndex = -1;
    this._dispatchChange();
    requestAnimationFrame(() => {
      this.shadowRoot?.querySelector('input')?.focus();
    });
  };

  private _onSearchInput = (e: Event) => {
    this._query = (e.target as HTMLInputElement).value;
    this._editing = true;
    this._open = true;
    this._activeIndex = this._filtered.length > 0 ? 0 : -1;
  };

  private _onComboFocus = () => {
    if (this.disabled) return;
    this._open = true;
    this._editing = false;
    // En multi, el input se mantiene vacío (los chips muestran lo seleccionado).
    // En single, se prefilla con la etiqueta para que el usuario vea el valor.
    this._query = this.multiple ? '' : this._selectedLabel();
    if (this._activeIndex < 0) {
      const targetValue = this.multiple ? '' : this.value;
      const idx = this._filtered.findIndex(o => o.value === targetValue && !o.disabled);
      this._activeIndex = idx >= 0 ? idx : this._filtered.findIndex(o => !o.disabled);
    }
  };

  private _onComboKeyDown = (e: KeyboardEvent) => {
    const filtered = this._filtered;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!this._open) {
          this._open = true;
          return;
        }
        this._activeIndex = Math.min(this._activeIndex + 1, filtered.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!this._open) {
          this._open = true;
          return;
        }
        this._activeIndex = Math.max(this._activeIndex - 1, 0);
        break;
      case 'Home':
        if (this._open) {
          e.preventDefault();
          this._activeIndex = 0;
        }
        break;
      case 'End':
        if (this._open) {
          e.preventDefault();
          this._activeIndex = filtered.length - 1;
        }
        break;
      case 'Enter':
        if (this._open && this._activeIndex >= 0 && filtered[this._activeIndex]) {
          e.preventDefault();
          this._select(filtered[this._activeIndex]);
        }
        break;
      case 'Escape':
        if (this._open) {
          e.preventDefault();
          this._closePopup();
        }
        break;
      case 'Tab':
        if (this._open) this._closePopup();
        break;
      case 'Backspace':
        // En multi, si el input está vacío, borra el último chip.
        if (this.multiple && this._query === '' && this.values.length > 0) {
          e.preventDefault();
          this.values = this.values.slice(0, -1);
          this._dispatchChange();
        }
        break;
    }
  };

  private _onChange(e: Event) {
    this.value = (e.target as HTMLSelectElement).value;
    this.dispatchEvent(new CustomEvent('nx-select-change', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    }));
  }

  /* ─── Render ─────────────────────────────────────────────────────────── */

  override render() {
    const errorId = `${this._uid}-error`;
    return html`
      <div class="wrapper">
        ${this._renderLabel()}
        ${this._isCombobox ? this._renderCombobox(errorId) : this._renderNative(errorId)}
        ${this._renderError(errorId)}
      </div>
    `;
  }

  private _renderLabel() {
    if (!this.label) return nothing;
    return html`
      <label for=${this._uid}>
        ${this.label}
        ${this.required ? html`<span class="required-mark" aria-hidden="true">*</span>` : ''}
      </label>
    `;
  }

  private _renderError(id: string) {
    if (!this.error) return nothing;
    return html`<span class="error-msg" id=${id} role="alert">${this.error}</span>`;
  }

  private _renderCaret() {
    return html`
      <span class="caret" aria-hidden="true">
        <svg viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    `;
  }

  /** Slot decorativo a la izquierda del control (icono, etc). */
  private _renderPrefix() {
    return html`
      <slot name="prefix" class="affix affix-prefix" @slotchange=${this._onPrefixSlot}></slot>
    `;
  }

  /** Zona derecha: slot suffix + (clear opcional) + caret. */
  private _renderTrailing(withClear: boolean) {
    return html`
      <div class="trailing">
        <slot name="suffix" class="affix affix-suffix" @slotchange=${this._onSuffixSlot}></slot>
        ${withClear ? this._renderClearBtn() : nothing}
        ${this._renderCaret()}
      </div>
    `;
  }

  private _renderClearBtn() {
    const hasValue = this.multiple ? this.values.length > 0 : !!this.value;
    if (!hasValue || this.disabled) return nothing;
    return html`
      <button
        type="button"
        class="clear-btn"
        aria-label="Limpiar selección"
        @click=${this._clear}
      >
        <svg viewBox="0 0 12 12" fill="none">
          <path d="M3 3L9 9M3 9L9 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    `;
  }

  private _renderChip(v: string) {
    const label = this._labelOf(v);
    return html`
      <nx-badge variant="primary" size="sm">
        ${label}
        <button
          type="button"
          class="chip-close"
          aria-label=${`Quitar ${label}`}
          @click=${(e: Event) => { e.stopPropagation(); this._removeChip(v); }}
        >
          <svg viewBox="0 0 12 12" fill="none">
            <path d="M3 3L9 9M3 9L9 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </nx-badge>
    `;
  }

  private _renderNativeOption(opt: NxSelectOption) {
    return html`
      <option
        value=${opt.value}
        ?disabled=${opt.disabled}
        ?selected=${opt.value === this.value}
      >${opt.label}</option>
    `;
  }

  private _renderNative(errorId: string) {
    const isPlaceholder = !this.value;
    const fieldClasses = ['field', this.error ? 'has-error' : ''].filter(Boolean).join(' ');
    const selectClasses = isPlaceholder && this.placeholder ? 'is-placeholder' : '';
    return html`
      <div class=${fieldClasses}>
        ${this._renderPrefix()}
        <select
          id=${this._uid}
          name=${this.name}
          .value=${this.value}
          ?disabled=${this.disabled}
          ?required=${this.required}
          class=${selectClasses || nothing}
          aria-invalid=${this.error ? 'true' : 'false'}
          aria-describedby=${this.error ? errorId : nothing}
          @change=${this._onChange}
        >
          ${this.placeholder ? html`
            <option value="" disabled ?selected=${!this.value}>${this.placeholder}</option>
          ` : ''}
          ${this.options.map(item => isGroup(item)
            ? html`<optgroup label=${item.label}>
                ${item.options.map(opt => this._renderNativeOption(opt))}
              </optgroup>`
            : this._renderNativeOption(item)
          )}
        </select>
        ${this._renderTrailing(false)}
      </div>
    `;
  }

  private _renderCombobox(errorId: string) {
    const fieldClasses = [
      'field',
      'is-combobox',
      this.error ? 'has-error' : '',
      this._open ? 'is-open' : '',
      this.multiple ? 'is-multiple' : '',
    ].filter(Boolean).join(' ');
    const filtered = this._filtered;
    const listboxId = `${this._uid}-listbox`;
    const optId = (i: number) => `${this._uid}-opt-${i}`;
    const activeId =
      this._open && this._activeIndex >= 0 && filtered[this._activeIndex]
        ? optId(this._activeIndex)
        : '';
    const counter = !this._open
      ? ''
      : this._isMaxed
        ? `Máximo de ${this.maxSelected} alcanzado`
        : `${filtered.length} ${filtered.length === 1 ? 'resultado' : 'resultados'}`;
    const isOptionSelected = (opt: NxSelectOption) =>
      this.multiple ? this.values.includes(opt.value) : this.value === opt.value;

    // Chips: si chipLimit > 0 y no está expandido, mostramos los primeros N
    // y colapsamos el resto en un botón "+N más".
    const collapse = this.multiple && this.chipLimit > 0 && !this._chipsExpanded;
    const visibleChips = collapse ? this.values.slice(0, this.chipLimit) : this.values;
    const hiddenCount = this.values.length - visibleChips.length;
    const canCollapse = this.multiple && this.chipLimit > 0 && this.values.length > this.chipLimit;

    return html`
      <div class="combo-anchor">
        <div class=${fieldClasses}>
          ${this._renderPrefix()}
          <div class="content">
            ${this.multiple && this.values.length > 0 ? html`
              <div class="u-contents">
                ${visibleChips.map(v => this._renderChip(v))}
                ${hiddenCount > 0 ? html`
                  <button
                    type="button"
                    class="chip-more"
                    @mousedown=${this._keepFocus}
                    @click=${() => { this._chipsExpanded = true; }}
                  >+${hiddenCount} más</button>
                ` : ''}
                ${this._chipsExpanded && canCollapse ? html`
                  <button
                    type="button"
                    class="chip-more"
                    @mousedown=${this._keepFocus}
                    @click=${() => { this._chipsExpanded = false; }}
                  >Ver menos</button>
                ` : ''}
              </div>
            ` : ''}
            <input
            id=${this._uid}
            role="combobox"
            type="text"
            name=${this.name}
            placeholder=${this.placeholder}
            autocomplete="off"
            aria-expanded=${this._open ? 'true' : 'false'}
            aria-haspopup="listbox"
            aria-controls=${listboxId}
            aria-activedescendant=${activeId || nothing}
            aria-autocomplete="list"
            aria-invalid=${this.error ? 'true' : 'false'}
            aria-describedby=${this.error ? errorId : nothing}
            .value=${this._query}
            ?disabled=${this.disabled}
            ?required=${this.required}
            @input=${this._onSearchInput}
            @keydown=${this._onComboKeyDown}
            @focus=${this._onComboFocus}
          />
          </div>
          ${this._renderTrailing(true)}
        </div>

        <div
          class=${`popup${this._flipped ? ' is-flipped' : ''}`}
          ?hidden=${!this._open}
        >
          ${this.multiple ? html`
            <div class="popup-header">
              <button
                type="button"
                class="popup-action"
                @mousedown=${this._keepFocus}
                @click=${this._selectAll}
                ?disabled=${this._allSelected}
              >Seleccionar todo</button>
              <button
                type="button"
                class="popup-action"
                @mousedown=${this._keepFocus}
                @click=${this._clearAll}
                ?disabled=${this.values.length === 0}
              >Limpiar</button>
            </div>
          ` : ''}
          <div
            id=${listboxId}
            class=${`listbox${this.multiple ? ' is-multiple' : ''}`}
            role="listbox"
            aria-multiselectable=${this.multiple ? 'true' : nothing}
          >
            ${filtered.length === 0
              ? html`<div class="empty"><slot name="empty">Sin resultados</slot></div>`
              : this._renderListboxItems(isOptionSelected, optId)}
          </div>
        </div>
      </div>

      <span class="u-visually-hidden" aria-live="polite">${counter}</span>
    `;
  }

  /** Recorre `options` respetando grupos y filter, llevando un contador de
      índice plano que coincide con `_filtered` (para teclado/aria). */
  private _renderListboxItems(
    isOptionSelected: (opt: NxSelectOption) => boolean,
    optId: (i: number) => string,
  ) {
    let flatIndex = -1;
    return this.options.map((item, groupIndex) => {
      if (!isGroup(item)) {
        if (!this._matchesQuery(item)) return nothing;
        flatIndex += 1;
        return this._renderOption(item, flatIndex, isOptionSelected, optId);
      }
      const matching = item.options.filter(o => this._matchesQuery(o));
      if (matching.length === 0) return nothing;
      const groupId = `${this._uid}-grp-${groupIndex}`;
      return html`
        <div role="group" aria-labelledby=${groupId}>
          <div class="group-label" id=${groupId}>${item.label}</div>
          ${matching.map(opt => {
            flatIndex += 1;
            return this._renderOption(opt, flatIndex, isOptionSelected, optId);
          })}
        </div>
      `;
    });
  }

  private _renderOption(
    opt: NxSelectOption,
    flatIndex: number,
    isOptionSelected: (opt: NxSelectOption) => boolean,
    optId: (i: number) => string,
  ) {
    const selected = isOptionSelected(opt);
    // En multi, una opción no seleccionada queda bloqueada si se alcanzó el
    // tope. Las ya seleccionadas siguen quitándose.
    const blocked = !!opt.disabled || (!selected && this._isMaxed);
    return html`
      <div
        id=${optId(flatIndex)}
        role="option"
        aria-selected=${selected ? 'true' : 'false'}
        aria-disabled=${blocked ? 'true' : nothing}
        class=${flatIndex === this._activeIndex ? 'is-active' : ''}
        @click=${(e: Event) => { e.stopPropagation(); this._select(opt); }}
        @mouseenter=${() => { this._activeIndex = flatIndex; }}
      >
        ${this.multiple ? html`
          <span class="check" aria-hidden="true">
            <svg viewBox="0 0 14 14" fill="none">
              <path d="M2.5 7.5L6 11L11.5 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        ` : ''}
        <span class="opt-label">${opt.label}</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap { 'nx-select': NxSelect; }
}
