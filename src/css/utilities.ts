import { css } from 'lit';

/**
 * Utilidades CSS compartidas entre componentes.
 *
 * Las clases CSS NO cruzan el límite del shadow DOM: un `<link>` global no
 * llega dentro. La forma correcta de compartirlas es una hoja de estilos que
 * cada componente compone con sus estilos locales:
 *
 *   import { utilities } from '@/css/utilities.ts';
 *
 *   static override styles = [utilities, css`
 *     :host { ... }
 *     .local { ... }
 *   `];
 *
 * Lit adopta esta hoja vía `adoptedStyleSheets`: se instancia UNA sola vez y
 * se comparte entre todos los shadow roots que la importen — cero duplicación
 * en memoria. Funciona igual con `shadowRoot: 'open'` o `'closed'`, porque
 * adopted stylesheets es plumbing interno, no atraviesa el DOM.
 *
 * Los tokens (`--nx-space-*`, etc.) sí cruzan el shadow DOM por herencia de
 * custom properties, así que `var(--nx-space-4)` resuelve dentro de cualquier
 * componente mientras `tokens.css` esté cargado en `:root`.
 */
export const utilities = css`
  /* Oculto visualmente, pero presente en el árbol de accesibilidad — para
     labels de SR, live regions, texto de contexto… */
  .u-visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Apila los hijos en vertical con un gap configurable vía --u-stack-gap. */
  .u-stack {
    display: flex;
    flex-direction: column;
    gap: var(--u-stack-gap, var(--nx-space-4));
  }

  /* Agrupa los hijos en horizontal; envuelven cuando no caben. Gap vía
     --u-cluster-gap. */
  .u-cluster {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--u-cluster-gap, var(--nx-space-2));
  }

  /* El elemento desaparece como caja pero sus hijos siguen en el flow del
     padre — útil para que un wrapper lógico (un .map, un grupo) no rompa el
     grid/flex del contenedor. */
  .u-contents {
    display: contents;
  }

  /* Trunca una sola línea con ellipsis. */
  .u-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
