import type { PromoBanner } from '@/services/contentful.types';

export const mockBanners: PromoBanner[] = [
  {
    title: '¡Oferta de lanzamiento!',
    subtitle: 'Consigue el plan Pro con un 50% de descuento durante los primeros 3 meses.',
    ctaLabel: 'Aprovechar oferta',
    ctaUrl: '/planes',
    expiresAt: '2026-06-30T23:59:59Z',
  },
];
