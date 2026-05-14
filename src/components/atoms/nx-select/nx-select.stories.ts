import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-select.ts';
import type { NxSelectOption, NxSelectItem } from './nx-select.ts';

interface SelectArgs {
  label: string;
  placeholder: string;
  value: string;
  error: string;
  disabled: boolean;
  required: boolean;
  searchable: boolean;
  searchableAfter: number;
  size: 'sm' | 'md' | 'lg';
  hideLabel: boolean;
  options: NxSelectItem[];
}

/** Mismas opciones agrupadas por continente, para las stories de optgroups. */
const COUNTRIES_GROUPED: NxSelectItem[] = [
  {
    label: 'Europa',
    options: [
      { value: 'es', label: 'España' },
      { value: 'pt', label: 'Portugal' },
      { value: 'fr', label: 'Francia' },
      { value: 'it', label: 'Italia' },
      { value: 'de', label: 'Alemania' },
      { value: 'uk', label: 'Reino Unido' },
    ],
  },
  {
    label: 'América',
    options: [
      { value: 'us', label: 'Estados Unidos' },
      { value: 'mx', label: 'México' },
      { value: 'ar', label: 'Argentina' },
      { value: 'br', label: 'Brasil' },
    ],
  },
  // Opción suelta, sin grupo — convive con los grupos.
  { value: 'other', label: 'Otro' },
];

const COUNTRIES: NxSelectOption[] = [
  { value: 'es', label: 'España' },
  { value: 'pt', label: 'Portugal' },
  { value: 'fr', label: 'Francia' },
  { value: 'it', label: 'Italia' },
  { value: 'de', label: 'Alemania' },
  { value: 'uk', label: 'Reino Unido' },
  { value: 'us', label: 'Estados Unidos' },
];

const PLANS: NxSelectOption[] = [
  { value: 'starter',    label: 'Starter — 9€/mes' },
  { value: 'pro',        label: 'Pro — 19€/mes' },
  { value: 'business',   label: 'Business — 49€/mes' },
  { value: 'enterprise', label: 'Enterprise — a medida', disabled: true },
];

const meta: Meta<SelectArgs> = {
  title: 'Atoms/NxSelect',
  component: 'nx-select',
  argTypes: {
    label:       { control: 'text' },
    placeholder: { control: 'text' },
    value:       { control: 'text' },
    error:       { control: 'text' },
    disabled:    { control: 'boolean' },
    required:    { control: 'boolean' },
    searchable:  { control: 'boolean', description: 'Activa el combobox ARIA con filter en vivo. Sin este flag se usa `<select>` nativo.' },
    searchableAfter: { control: 'number', description: 'Si > 0, fuerza el modo searchable cuando `options.length` lo iguala o supera. 0 = nunca auto-activar.' },
    size:        { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    hideLabel:   { control: 'boolean' },
    options:     { control: 'object' },
  },
  parameters: {
    docs: {
      description: {
        component: [
          'Select form-associated con doble path: en navegadores con soporte para `appearance: base-select` (Chrome 130+) el popup se estiliza con los tokens del kit.',
          'En el resto se cae a un `<select>` clásico con el mismo aspecto en el cierre y el popup nativo del SO.',
          'En ambos casos la semántica es nativa: teclado, screen reader y picker móvil funcionan sin código extra.',
        ].join(' '),
      },
    },
  },
};
export default meta;

type Story = StoryObj<SelectArgs>;

const renderSelect = (a: SelectArgs) => html`
  <nx-select
    label=${a.label}
    placeholder=${a.placeholder}
    value=${a.value}
    error=${a.error}
    size=${a.size}
    ?disabled=${a.disabled}
    ?required=${a.required}
    ?searchable=${a.searchable}
    searchable-after=${a.searchableAfter}
    ?hide-label=${a.hideLabel}
    .options=${a.options}
  ></nx-select>
`;

export const Default: Story = {
  args: {
    label: 'País',
    placeholder: 'Selecciona un país…',
    value: '',
    error: '',
    disabled: false,
    required: false,
    searchable: false,
    searchableAfter: 0,
    size: 'md',
    hideLabel: false,
    options: COUNTRIES,
  },
  render: renderSelect,
};

export const Preselected: Story = {
  args: {
    label: 'Plan',
    placeholder: '',
    value: 'pro',
    error: '',
    disabled: false,
    required: false,
    searchable: false,
    searchableAfter: 0,
    size: 'md',
    hideLabel: false,
    options: PLANS,
  },
  render: renderSelect,
};

export const Required: Story = {
  args: {
    label: 'País',
    placeholder: 'Selecciona un país…',
    value: '',
    error: '',
    disabled: false,
    required: true,
    searchable: false,
    searchableAfter: 0,
    size: 'md',
    hideLabel: false,
    options: COUNTRIES,
  },
  render: renderSelect,
};

export const WithError: Story = {
  args: {
    label: 'Plan',
    placeholder: 'Elige un plan…',
    value: '',
    error: 'Tienes que elegir un plan para continuar',
    disabled: false,
    required: true,
    searchable: false,
    searchableAfter: 0,
    size: 'md',
    hideLabel: false,
    options: PLANS,
  },
  render: renderSelect,
};

export const DisabledOption: Story = {
  args: {
    label: 'Plan',
    placeholder: 'Elige un plan…',
    value: '',
    error: '',
    disabled: false,
    required: false,
    searchable: false,
    searchableAfter: 0,
    size: 'md',
    hideLabel: false,
    options: PLANS,
  },
  render: renderSelect,
};

export const Disabled: Story = {
  args: {
    label: 'País',
    placeholder: 'Selecciona un país…',
    value: 'es',
    error: '',
    disabled: true,
    required: false,
    searchable: false,
    searchableAfter: 0,
    size: 'md',
    hideLabel: false,
    options: COUNTRIES,
  },
  render: renderSelect,
};

/**
 * Modo `searchable`: combobox ARIA propio con filter en vivo. La normalización
 * elimina acentos (`á → a`) para que "espana" encuentre "España".
 */
export const Searchable: Story = {
  args: {
    label: 'País',
    placeholder: 'Empieza a escribir…',
    value: '',
    error: '',
    disabled: false,
    required: false,
    searchable: true,
    searchableAfter: 0,
    size: 'md',
    hideLabel: false,
    options: COUNTRIES,
  },
  render: renderSelect,
};

/**
 * Searchable con valor preseleccionado: aparece el botón ✕ para limpiar
 * la selección sin tener que abrir el popup.
 */
export const SearchablePreselected: Story = {
  args: {
    label: 'País',
    placeholder: 'Empieza a escribir…',
    value: 'fr',
    error: '',
    disabled: false,
    required: false,
    searchable: true,
    searchableAfter: 0,
    size: 'md',
    hideLabel: false,
    options: COUNTRIES,
  },
  render: renderSelect,
};

/** Lista larga para verificar el scroll dentro del popup y la navegación con teclado. */
export const SearchableLong: Story = {
  args: {
    label: 'Ciudad',
    placeholder: 'Busca una ciudad…',
    value: '',
    error: '',
    disabled: false,
    required: false,
    searchable: true,
    searchableAfter: 0,
    size: 'md',
    hideLabel: false,
    options: [
      'Madrid','Barcelona','Valencia','Sevilla','Zaragoza','Málaga','Murcia','Palma',
      'Las Palmas','Bilbao','Alicante','Córdoba','Valladolid','Vigo','Gijón','Granada',
      'A Coruña','Oviedo','Vitoria','Pamplona','Santander','Logroño','Toledo','Ávila',
      'Salamanca','León','Burgos','Cáceres','Mérida','Badajoz','Castellón','Lleida',
      'Tarragona','Girona','Huesca','Teruel','Segovia','Soria','Cuenca','Ciudad Real',
    ].map(c => ({ value: c.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/\s+/g, '-'), label: c })),
  },
  render: renderSelect,
};

/**
 * Auto-trigger del modo searchable por umbral. `searchable=false` y
 * `searchableAfter=10` → como hay más de 10 opciones, se activa el combobox
 * automáticamente sin que el consumidor tenga que pensar en ello.
 */
export const SearchableAuto: Story = {
  args: {
    label: 'País',
    placeholder: 'Empieza a escribir…',
    value: '',
    error: '',
    disabled: false,
    required: false,
    searchable: false,
    searchableAfter: 5,
    size: 'md',
    hideLabel: false,
    options: COUNTRIES,
  },
  render: renderSelect,
};

/**
 * Mensaje "sin resultados" personalizado vía `slot="empty"`. Escribe algo que
 * no exista para verlo (ej. "xyz").
 */
export const SearchableEmptySlot: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <nx-select
      label="País"
      placeholder="Empieza a escribir…"
      searchable
      .options=${COUNTRIES}
    >
      <span slot="empty" style="display:flex;align-items:center;gap:0.5rem;">
        <span style="font-size:1.2em;">🔎</span>
        Ningún país coincide. Prueba con otro término.
      </span>
    </nx-select>
  `,
};

/**
 * Modo multi-select: `multiple` activado. El popup queda abierto al
 * seleccionar; las opciones marcadas aparecen como chips dentro del field.
 * Backspace sobre un input vacío borra el último chip.
 */
export const Multiple: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <nx-select
      label="Países que has visitado"
      placeholder="Selecciona uno o varios…"
      multiple
      .options=${COUNTRIES}
      .values=${['es', 'fr']}
    ></nx-select>
  `,
};

/**
 * Multi-select con búsqueda. Cuando hay muchas opciones, el filter live
 * complementa muy bien la selección múltiple.
 */
export const MultipleSearchable: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <nx-select
      label="Países"
      placeholder="Buscar y seleccionar…"
      multiple
      searchable
      .options=${COUNTRIES}
    ></nx-select>
  `,
};

/**
 * `chip-limit="2"`: sólo se ven 2 chips; el resto se colapsa en un botón
 * "+N más" que los despliega (y un "Ver menos" para volver a colapsar).
 */
export const MultipleChipLimit: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <nx-select
      label="Países visitados"
      placeholder="Añade más…"
      multiple
      chip-limit="2"
      .options=${COUNTRIES}
      .values=${['es', 'fr', 'it', 'de']}
    ></nx-select>
  `,
};

/**
 * `max-selected="3"`: al llegar a 3 valores, las opciones no seleccionadas se
 * bloquean (las ya elegidas siguen quitándose). El popup anuncia el tope.
 */
export const MultipleMaxSelected: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <nx-select
      label="Elige hasta 3 países"
      placeholder="Máximo 3…"
      multiple
      searchable
      max-selected="3"
      .options=${COUNTRIES}
      .values=${['es', 'fr']}
    ></nx-select>
  `,
};

/**
 * Optgroups en el path nativo: `options` acepta `{ label, options: [] }`.
 * Se renderiza con `<optgroup>` y el popup nativo (o `::picker(select)`)
 * agrupa visualmente. Las opciones sueltas conviven con los grupos.
 */
export const Grouped: Story = {
  args: {
    label: 'País',
    placeholder: 'Selecciona un país…',
    value: '',
    error: '',
    disabled: false,
    required: false,
    searchable: false,
    searchableAfter: 0,
    size: 'md',
    hideLabel: false,
    options: COUNTRIES_GROUPED,
  },
  render: renderSelect,
};

/**
 * Optgroups en el combobox: cabeceras `role="group"` sticky, el filter
 * descarta los grupos que se quedan sin coincidencias.
 */
export const GroupedSearchable: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <nx-select
      label="País"
      placeholder="Busca un país…"
      searchable
      .options=${COUNTRIES_GROUPED}
    ></nx-select>
  `,
};

/** Optgroups + multi-select: grupos, chips y checkmark a la vez. */
export const GroupedMultiple: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <nx-select
      label="Países"
      placeholder="Selecciona varios…"
      multiple
      searchable
      .options=${COUNTRIES_GROUPED}
      .values=${['es', 'br']}
    ></nx-select>
  `,
};

/**
 * Multi dentro de `<form>`: cada valor seleccionado se envía como una entrada
 * separada con la misma `name`, igual que un `<select multiple>` nativo.
 * Después de enviar verás `countries: ['es', 'fr', ...]` en el `pre`.
 */
export const MultipleInsideForm: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const onSubmit = (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const fd = new FormData(form);
      const data = { countries: fd.getAll('countries') };
      const out = form.querySelector('.form-output') as HTMLPreElement;
      out.textContent = JSON.stringify(data, null, 2);
    };
    return html`
      <form @submit=${onSubmit} style="display:flex;flex-direction:column;gap:1rem;max-width:420px;">
        <nx-select
          label="Países"
          name="countries"
          placeholder="Selecciona varios…"
          multiple
          searchable
          required
          .options=${COUNTRIES}
        ></nx-select>
        <button type="submit" style="
          padding:0.625rem 1rem;border:none;border-radius:9999px;
          background:var(--nx-color-primary,#6d28d9);color:#fff;
          font-weight:600;cursor:pointer;
        ">Enviar</button>
        <pre class="form-output" style="
          margin:0;padding:0.75rem;background:#f8fafc;border-radius:8px;
          font-family:'Roboto Mono',monospace;font-size:0.8125rem;
          color:#0f172a;min-height:1em;white-space:pre-wrap;
        "></pre>
      </form>
    `;
  },
};

/**
 * Tres tamaños — `sm | md | lg` — alineados con `nx-button` / `nx-input`.
 * El atributo `size` sólo reescribe tokens internos de padding y tipografía.
 */
export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1rem;max-width:320px;">
      <nx-select label="Small"  size="sm" placeholder="sm…" .options=${COUNTRIES}></nx-select>
      <nx-select label="Medium" size="md" placeholder="md…" .options=${COUNTRIES}></nx-select>
      <nx-select label="Large"  size="lg" placeholder="lg…" .options=${COUNTRIES}></nx-select>
    </div>
  `,
};

/**
 * Slots `prefix` / `suffix` para iconos decorativos — mismo patrón que
 * `nx-input`. Funcionan en ambos modos (nativo y combobox).
 */
export const PrefixSuffix: Story = {
  parameters: { controls: { disable: true } },
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:1rem;max-width:320px;">
      <nx-select label="Con prefix" placeholder="Selecciona país…" .options=${COUNTRIES}>
        <span slot="prefix">🌍</span>
      </nx-select>
      <nx-select label="Con suffix" searchable placeholder="Busca…" .options=${COUNTRIES}>
        <span slot="suffix">🔎</span>
      </nx-select>
      <nx-select label="Prefix + suffix" placeholder="Moneda…" .options=${PLANS}>
        <span slot="prefix">💶</span>
        <span slot="suffix">/mes</span>
      </nx-select>
    </div>
  `,
};

export const InsideForm: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const onSubmit = (e: Event) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const data = Object.fromEntries(new FormData(form));
      const out = form.querySelector('.form-output') as HTMLPreElement;
      out.textContent = JSON.stringify(data, null, 2);
    };
    return html`
      <form @submit=${onSubmit} style="display:flex;flex-direction:column;gap:1rem;max-width:320px;">
        <nx-select
          label="País"
          name="country"
          placeholder="Selecciona…"
          required
          .options=${COUNTRIES}
        ></nx-select>
        <nx-select
          label="Plan"
          name="plan"
          placeholder="Elige un plan…"
          required
          .options=${PLANS}
        ></nx-select>
        <button type="submit" style="
          padding:0.625rem 1rem;border:none;border-radius:9999px;
          background:var(--nx-color-primary,#6d28d9);color:#fff;
          font-weight:600;cursor:pointer;
        ">Enviar</button>
        <pre class="form-output" style="
          margin:0;padding:0.75rem;background:#f8fafc;border-radius:8px;
          font-family:'Roboto Mono',monospace;font-size:0.8125rem;
          color:#0f172a;min-height:1em;white-space:pre-wrap;
        "></pre>
      </form>
    `;
  },
};
