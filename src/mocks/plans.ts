import type { Plan } from '@/services/contentful.types';

export const mockPlans: Plan[] = [
  {
    title: 'Básico',
    slug: 'basico',
    price: 9.99,
    billingPeriod: 'monthly',
    features: ['5 GB almacenamiento', 'Soporte por email', 'Acceso a API'],
  },
  {
    title: 'Pro',
    slug: 'pro',
    price: 29.99,
    billingPeriod: 'monthly',
    features: ['50 GB almacenamiento', 'Soporte prioritario', 'Acceso a API', 'Analíticas avanzadas'],
    badge: 'Popular',
    highlighted: true,
  },
  {
    title: 'Enterprise',
    slug: 'enterprise',
    price: 99.99,
    billingPeriod: 'monthly',
    features: ['500 GB almacenamiento', 'Soporte 24/7', 'Acceso a API', 'Analíticas avanzadas', 'SLA garantizado'],
    badge: 'Mejor valor',
  },
];
