# nx-select

Select form-associated con doble path: `appearance: base-select` (Chrome 130+) y fallback con `<select>` clásico estilizado. Semántica nativa en ambos: teclado, screen reader y picker móvil del SO.

## Estado actual

- Single-select y multi-select.
- Form-associated (`ElementInternals`, `formResetCallback`, `formDisabledCallback`).
- Validación: `valueMissing` (required) y `customError` (prop `error`). En multi, `valueMissing` mira `values.length === 0`.
- **Modo nativo** (default, single-select sin search): `<select>` con `appearance: base-select` en navegadores con soporte (popup estilizado con tokens), fallback al popup nativo del SO.
- **Modo `searchable`**: combobox ARIA propio (`role="combobox"` + `role="listbox"`) con:
  - Filter live por substring, case-insensitive, con normalización de acentos (`á → a`).
  - Navegación por teclado: ↑/↓, Home/End, Enter, Esc, Tab.
  - `aria-activedescendant` para focus visual sin perder focus real en el input.
  - Live region (`aria-live="polite"`) anunciando número de coincidencias.
  - Cierre por click fuera, Esc o Tab.
  - Auto-trigger por umbral con `searchable-after="N"`.
  - Slot `empty` para personalizar el mensaje "sin resultados".
  - Flip automático: el popup se posiciona arriba cuando no cabe abajo.
  - Botón ✕ para limpiar la selección sin abrir el popup.
  - Chevron rota 180º cuando el popup está abierto.
- **Modo `multiple`** (fuerza la UI custom siempre):
  - Fuente de verdad en prop `values: string[]` (en lugar de `value: string`).
  - Chips con `nx-badge` para cada valor seleccionado, con × para eliminar.
  - Click en opción **toggle** sin cerrar el popup (selecciona varios seguidos).
  - Backspace sobre input vacío elimina el último chip.
  - Form-associated con múltiples entradas: `FormData` repite la `name` por cada valor (igual que `<select multiple>` nativo).
  - Combinable con `searchable` para multi + filter.
  - Header del popup con acciones "Seleccionar todo" / "Limpiar".
  - `chip-limit="N"`: colapsa los chips sobrantes en un botón "+N más" / "Ver menos".
  - `max-selected="N"`: bloquea las opciones no seleccionadas al llegar al tope; el popup lo anuncia por la live region.
  - Checkmark en las opciones seleccionadas (en multi el fondo queda para el estado activo de teclado).
- **Optgroups**: `options` acepta `NxSelectItem[]` — opciones sueltas y/o grupos `{ label, options: [] }` mezclados.
  - Path nativo: `<optgroup>`.
  - Combobox: cabeceras `role="group"` con `aria-labelledby`, sticky al hacer scroll (`scroll-padding-top` evita que tapen la opción activa al navegar con teclado).
  - El filter descarta grupos sin coincidencias; los índices de teclado se aplanan, así que ↑/↓ saltan las cabeceras.
- **Sizes** `sm | md | lg` (atributo `size`) — reescriben tokens internos de padding y tipografía; alineados con `nx-button` / `nx-input`.
- **Slots `prefix` / `suffix`** para iconos decorativos, en ambos modos. `has-prefix` / `has-suffix` se reflejan desde el `slotchange`.
- Theming brand-aware: `--nx-input-radius`, `--nx-input-bg`, `--nx-input-border`, `--nx-input-py`/`px`, `--nx-select-picker-radius`, `--nx-select-option-radius`.

## Roadmap — mejoras incrementales

### v3.1 · Datos asíncronos

- Async loading: prop `loadOptions` (callback) + estado `loading` con `nx-spinner`.
- Estado de error de carga (vs. el `error` de validación actual).
- Debounce del input antes de llamar a `loadOptions`.

### v3.2 · Paginación + cache

- Paginación / infinite scroll cuando el dataset no cabe en memoria.
- Cache de resultados por query.

### v4.1 · Aparcado (esperando caso real)

- Modo tagging: crear entradas nuevas al teclear (con validación opcional).
- Virtual scrolling para listas grandes (10k+ items) — sólo cuando justifique el coste.

## Limitaciones conocidas

- **Path moderno**: requiere Chrome 130+ (Safari/Firefox aún sin soporte para `appearance: base-select`). El fallback funciona en todos.
- **`<option>` con HTML rico**: en el path moderno se admite, pero el fallback degrada a texto plano. Pensar la API antes de aceptar HTML.
- **Form reset**: `formResetCallback` resetea a string vacío, no a la primera opción. Si quieres "primera opción es el default", maneja desde el consumidor.

## Decisiones abiertas

- ¿Exponer un `_internals.form` público para casos de submit programático?
- Patrón para errores async (validación server-side): ¿prop `error` o evento dedicado?
- Cuando llegue multi-select, ¿reutilizar `nx-select` con flag o crear `nx-multi-select` separado?
