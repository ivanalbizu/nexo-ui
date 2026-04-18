# nexo-ui — Lit + Contentful + Storybook

## Visión del proyecto
UI kit de componentes para un portal de servicios digitales construido con Lit,
documentado en Storybook, con contenido gestionado desde Contentful (tarifas,
banners, páginas de producto).
Los componentes son atómicos, independientes del CMS y reutilizables en
cualquier contexto.

---

## Stack
- **Gestor de paquetes**: pnpm
- **Build**: Vite
- **Componentes**: Lit 3
- **Documentación**: Storybook 10 (`@storybook/web-components-vite`)
- **CMS**: Contentful (Content Delivery API)
- **Lenguaje**: TypeScript

> **Routing**: opcional. Si la app necesita navegación SPA añadir `@vaadin/router`.
> Para un sitio de contenido puro, las páginas pueden ser documentos HTML
> independientes sin router.

---

## Estructura del proyecto
```
src/
  components/
    atoms/
      nx-button/
        nx-button.ts
        nx-button.stories.ts
      nx-input/
      nx-badge/
      nx-chip/
      nx-spinner/
      nx-skeleton/
    molecules/
      nx-card/
      nx-plan-card/       # Tarjeta de tarifa: nombre, precio, features
      nx-promo-banner/    # Banner promocional con imagen y CTA
      nx-form-field/      # label + input + error accesible
      nx-alert/
    organisms/
      nx-plan-grid/       # Grid de nx-plan-card con filtros
      nx-hero/            # Hero section con contenido de Contentful
      nx-header/
      nx-footer/
  pages/                  # Solo si hay routing SPA
    home-page/
    plans-page/
    plan-detail-page/
  services/
    contentful.ts         # Cliente: fetchEntries, fetchEntry
    contentful.types.ts   # Tipos mapeados desde el Content Model
  css/
    tokens.css            # CSS custom properties: colores, tipografía, espaciado
    global.css
  mocks/
    plans.ts              # Datos de prueba para Storybook
    banners.ts
```

---

## Diseño de componentes — reglas

### Componentes en `src/components/` son Lit puro
- No importan nada de Contentful ni del router
- Reciben datos por `@property()` y emiten eventos con `CustomEvent`
- Son testeables y documentables en Storybook de forma aislada
- Prefijo `nx-` en todos los custom elements

### Páginas en `src/pages/` (si existen) conocen el entorno
- Obtienen contenido llamando a `src/services/contentful.ts`
- Navegan con el router si está configurado
- Componen organismos de `src/components/`

### CSS tokens
```css
:root {
  color-scheme: light dark;

  --nx-color-primary:     #6d28d9;
  --nx-color-accent:      #f59e0b;
  --nx-color-surface:     #f8fafc;
  --nx-color-surface-alt: #ffffff;
  --nx-color-border:      #e2e8f0;
  --nx-color-text:        #0f172a;
  --nx-color-text-muted:  #64748b;
  --nx-color-text-inverse:#ffffff;

  --nx-font-sans:      'Inter', system-ui, sans-serif;
  --nx-font-mono:      'Roboto Mono', monospace;

  --nx-space-1: 0.25rem;  --nx-space-2: 0.5rem;
  --nx-space-3: 0.75rem;  --nx-space-4: 1rem;
  --nx-space-6: 1.5rem;   --nx-space-8: 2rem;

  --nx-radius-sm:   4px;
  --nx-radius-md:   8px;
  --nx-radius-card: 16px;
  --nx-radius-full: 9999px;

  --nx-shadow-card: 0 2px 12px rgba(0,0,0,0.08);
  --nx-transition:  150ms ease;
}

@media (prefers-color-scheme: dark) {
  :root { /* dark vars */ }
}
:root[data-theme="dark"]  { /* dark vars — forzado por Storybook decorator */ }
:root[data-theme="light"] { /* light vars — anula @media si OS es dark */ }
```

---

## Contentful — integración

### Content Types recomendados para empezar
| Content Type | Campos clave |
|---|---|
| `plan` | title, slug, price, billingPeriod, features[], badge, highlighted |
| `promoBanner` | title, subtitle, ctaLabel, ctaUrl, image, expiresAt |
| `staticPage` | slug, title, body (Rich Text) |

### Cliente `src/services/contentful.ts`
```ts
import contentful from 'contentful';

const client = contentful.createClient({
  space:       import.meta.env.VITE_CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN,
});

export async function fetchEntries<T>(contentType: string): Promise<T[]> {
  const res = await client.getEntries<contentful.EntrySkeletonType>({
    content_type: contentType,
  });
  return res.items.map(item => item.fields as T);
}

export async function fetchEntry<T>(contentType: string, slug: string): Promise<T> {
  const res = await client.getEntries<contentful.EntrySkeletonType>({
    content_type: contentType,
    'fields.slug': slug,
    limit: 1,
  });
  if (!res.items.length) throw new Error(`Entry not found: ${slug}`);
  return res.items[0].fields as T;
}
```

### Variables de entorno — `.env.local` (nunca en git)
```
VITE_CONTENTFUL_SPACE_ID=xxxx
VITE_CONTENTFUL_ACCESS_TOKEN=xxxx
VITE_CONTENTFUL_PREVIEW_TOKEN=xxxx
```

### Rich Text
El campo `body` de Contentful devuelve JSON, no HTML:
```ts
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
const html = documentToHtmlString(entry.body);
```

### Mocks para Storybook
Las stories **nunca** llaman a Contentful directamente.
Los datos se pasan como props usando los mocks de `src/mocks/`.

---

## Storybook 10 — convenciones

### `.storybook/preview.ts`
```ts
/// <reference types="vite/client" />
import type { Preview, Decorator } from '@storybook/web-components-vite';
import '../src/css/tokens.css';
import '../src/css/global.css';

const DARK_BG  = '#0f172a';
const LIGHT_BG = '#f8fafc';

// Sincroniza el background switcher de Storybook con data-theme en <html>
// para activar los tokens dark/light independientemente del OS
const withColorScheme: Decorator = (story, context) => {
  const raw = context.globals['backgrounds'];
  const bg  = typeof raw === 'object' && raw !== null
    ? String((raw as Record<string, unknown>).value ?? '')
    : String(raw ?? '');

  if (bg === 'dark' || bg === DARK_BG)        document.documentElement.dataset.theme = 'dark';
  else if (bg === 'light' || bg === LIGHT_BG) document.documentElement.dataset.theme = 'light';
  else                                         delete document.documentElement.dataset.theme;

  return story();
};

const preview: Preview = {
  decorators: [withColorScheme],
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light',  value: LIGHT_BG },
        { name: 'dark',   value: DARK_BG  },
        { name: 'system', value: 'transparent' },
      ],
    },
    a11y: { test: 'todo' },
  },
};

export default preview;
```

### Story de referencia
```ts
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './nx-button.ts';

const meta: Meta = {
  title: 'Atoms/NxButton',
  component: 'nx-button',
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Descripción del componente.',
      },
    },
  },
};
export default meta;

export const Default: StoryObj = {
  args: { variant: 'primary', label: 'Ver tarifas' },
  render: ({ variant, label, disabled }) =>
    html`<nx-button variant=${variant} ?disabled=${disabled}>${label}</nx-button>`,
};
```

### Stories obligatorias por componente
- `Default` — estado base
- Una por variante o estado relevante
- `Loading` / `Skeleton` para componentes async
- `WithError` para inputs y formularios

---

## Accesibilidad — formularios

Los componentes de formulario (`nx-input`, `nx-form-field`) deben usar
`formAssociated + ElementInternals` para accesibilidad nativa equivalente
a elementos HTML nativos:

```ts
export class NxInput extends LitElement {
  static formAssociated = true;
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };
  private readonly _internals = this.attachInternals();

  override updated(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('error') || changed.has('required')) {
      this._internals.setFormValue(this.value);
      this._updateValidity();
    }
  }

  formResetCallback()                    { this.value = ''; }
  formDisabledCallback(d: boolean)       { this.disabled = d; }
}
```

Los testers automáticos (axe, addon-a11y) pueden reportar falsos positivos
en la asociación label/input con shadow DOM. Son falsos positivos — en runtime
el árbol de accesibilidad es correcto.

---

## Convenciones de código

- Custom elements con prefijo `nx-`
- Propiedades públicas con `@property()`, estado interno con `@state()`
- Eventos: `nx-[componente]-[acción]` — ej. `nx-plan-card-select`
- Estilos con `static styles = css\`...\``; tokens vía custom properties
- Imports con alias `@/` para rutas que cruzan carpetas de `src/`
- `vite.config.ts` sin `@types/node`:
  ```ts
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } }
  ```

---

## Primeros pasos

```bash
pnpm create vite nexo-ui --template lit-ts
cd nexo-ui
pnpm add contentful @contentful/rich-text-html-renderer
pnpm add -D @storybook/web-components-vite
pnpm dlx storybook@latest init
```

1. Crear espacio en Contentful y definir Content Types `plan` y `promoBanner`
2. Copiar `.env.local` con las credenciales
3. Construir `nx-button` y `nx-card` con sus stories como base
4. Añadir `nx-plan-card` con datos mock
5. Conectar `fetchEntries('plan')` en la primera página real
