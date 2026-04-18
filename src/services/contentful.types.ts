export interface Plan {
  title: string;
  slug: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  badge?: string;
  highlighted?: boolean;
}

export interface PromoBanner {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaUrl: string;
  image?: { url: string; alt: string };
  expiresAt?: string;
}

export interface StaticPage {
  slug: string;
  title: string;
  body: unknown; // Contentful Rich Text document
}
