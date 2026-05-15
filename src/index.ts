/**
 * nexo-ui — punto de entrada de la librería.
 * Importar este fichero registra todos los custom elements y reexporta sus clases y tipos.
 *
 *   import 'nexo-ui';                    // side-effect: registra <nx-*>
 *   import type { ButtonVariant } from 'nexo-ui';
 */

// Estilos base (tokens + reset). Quien solo quiera los componentes puede importar
// estos ficheros por separado: 'nexo-ui/css/tokens.css'.
import './css/tokens.css';
import './css/global.css';

// Utilidades CSS compartidas — `CSSResult` para componer en `static styles`
// de componentes propios. Ver doc en el fichero.
export { utilities } from './css/utilities.ts';

// ─── Atoms ─────────────────────────────────────────────────────────────────
export { NxButton, type ButtonVariant, type ButtonSize } from './components/atoms/nx-button/nx-button.ts';
export { NxInput, type InputType } from './components/atoms/nx-input/nx-input.ts';
export { NxSelect, type NxSelectOption, type NxSelectGroup, type NxSelectItem, type NxSelectSize } from './components/atoms/nx-select/nx-select.ts';
export { NxBadge, type BadgeVariant, type BadgeSize } from './components/atoms/nx-badge/nx-badge.ts';
export { NxChip } from './components/atoms/nx-chip/nx-chip.ts';
export { NxSpinner, type SpinnerSize } from './components/atoms/nx-spinner/nx-spinner.ts';
export { NxSkeleton, type SkeletonVariant } from './components/atoms/nx-skeleton/nx-skeleton.ts';
export { NxPresenterAvatar, type PresenterSize } from './components/atoms/nx-presenter-avatar/nx-presenter-avatar.ts';

// ─── Molecules ─────────────────────────────────────────────────────────────
export { NxCard } from './components/molecules/nx-card/nx-card.ts';
export { NxPlanCard } from './components/molecules/nx-plan-card/nx-plan-card.ts';
export { NxPromoBanner } from './components/molecules/nx-promo-banner/nx-promo-banner.ts';
export { NxFormField } from './components/molecules/nx-form-field/nx-form-field.ts';
export { NxAlert, type AlertVariant } from './components/molecules/nx-alert/nx-alert.ts';
export { NxCouponBox, type CouponEmphasis } from './components/molecules/nx-coupon-box/nx-coupon-box.ts';

// ─── Organisms ─────────────────────────────────────────────────────────────
export { NxHeader } from './components/organisms/nx-header/nx-header.ts';
export { NxFooter } from './components/organisms/nx-footer/nx-footer.ts';
export { NxPlanGrid } from './components/organisms/nx-plan-grid/nx-plan-grid.ts';
export { NxLiveBanner } from './components/organisms/nx-live-banner/nx-live-banner.ts';

// ─── Servicios y tipos de dominio ──────────────────────────────────────────
export { fetchEntries, fetchEntry } from './services/contentful.ts';
export type { Plan, PromoBanner, StaticPage } from './services/contentful.types.ts';
