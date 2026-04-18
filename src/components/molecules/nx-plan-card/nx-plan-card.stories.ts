import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-plan-card.ts';
import { mockPlans } from '@/mocks/plans.js';

interface PlanCardArgs {
  title: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  badge: string;
  highlighted: boolean;
  ctaLabel: string;
  currency: string;
}

const meta: Meta<PlanCardArgs> = {
  title: 'Molecules/NxPlanCard',
  component: 'nx-plan-card',
  argTypes: {
    billingPeriod: { control: 'select', options: ['monthly', 'yearly'] },
    highlighted:   { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component: 'Tarjeta de tarifa con nombre, precio, lista de features y CTA. Soporta estado destacado y badge.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<PlanCardArgs>;

const [basic, pro, enterprise] = mockPlans;

export const Default: Story = {
  args: {
    title:         basic.title,
    price:         basic.price,
    billingPeriod: basic.billingPeriod,
    features:      basic.features,
    badge:         basic.badge ?? '',
    highlighted:   basic.highlighted ?? false,
    ctaLabel:      'Contratar',
    currency:      '€',
  },
  render: ({ title, price, billingPeriod, features, badge, highlighted, ctaLabel, currency }) => html`
    <nx-plan-card
      title=${title}
      .price=${price}
      billingPeriod=${billingPeriod}
      .features=${features}
      badge=${badge}
      ?highlighted=${highlighted}
      ctaLabel=${ctaLabel}
      currency=${currency}
      style="max-width:320px;"
    ></nx-plan-card>
  `,
};

export const Highlighted: Story = {
  args: {
    title:         pro.title,
    price:         pro.price,
    billingPeriod: pro.billingPeriod,
    features:      pro.features,
    badge:         pro.badge ?? '',
    highlighted:   true,
    ctaLabel:      'Contratar',
    currency:      '€',
  },
  render: ({ title, price, billingPeriod, features, badge, highlighted, ctaLabel, currency }) => html`
    <nx-plan-card
      title=${title}
      .price=${price}
      billingPeriod=${billingPeriod}
      .features=${features}
      badge=${badge}
      ?highlighted=${highlighted}
      ctaLabel=${ctaLabel}
      currency=${currency}
      style="max-width:320px;"
    ></nx-plan-card>
  `,
};

export const AllPlans: Story = {
  render: () => html`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-width:1000px;">
      ${mockPlans.map(plan => html`
        <nx-plan-card
          title=${plan.title}
          .price=${plan.price}
          billingPeriod=${plan.billingPeriod}
          .features=${plan.features}
          badge=${plan.badge ?? ''}
          ?highlighted=${plan.highlighted ?? false}
        ></nx-plan-card>
      `)}
    </div>
  `,
};

export const WithEnterprise: Story = {
  args: {
    title:         enterprise.title,
    price:         enterprise.price,
    billingPeriod: enterprise.billingPeriod,
    features:      enterprise.features,
    badge:         enterprise.badge ?? '',
    highlighted:   false,
    ctaLabel:      'Contactar ventas',
    currency:      '€',
  },
  render: ({ title, price, billingPeriod, features, badge, highlighted, ctaLabel, currency }) => html`
    <nx-plan-card
      title=${title}
      .price=${price}
      billingPeriod=${billingPeriod}
      .features=${features}
      badge=${badge}
      ?highlighted=${highlighted}
      ctaLabel=${ctaLabel}
      currency=${currency}
      style="max-width:320px;"
    ></nx-plan-card>
  `,
};
