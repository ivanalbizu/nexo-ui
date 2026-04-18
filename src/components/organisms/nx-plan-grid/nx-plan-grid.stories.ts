import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-plan-grid.ts';
import { mockPlans } from '@/mocks/plans.js';

interface PlanGridArgs { heading: string; subheading: string; loading: boolean; showBillingToggle: boolean; }

const meta: Meta<PlanGridArgs> = {
  title: 'Organisms/NxPlanGrid',
  component: 'nx-plan-grid',
  argTypes: {
    loading:            { control: 'boolean' },
    showBillingToggle:  { control: 'boolean' },
  },
  parameters: { docs: { description: { component: 'Grid de planes con toggle de facturación mensual/anual, estado de carga y cálculo automático de descuento.' } } },
};
export default meta;
type Story = StoryObj<PlanGridArgs>;

export const Default: Story = {
  args: { heading: 'Elige tu plan', subheading: 'Sin permanencia. Cambia o cancela cuando quieras.', loading: false, showBillingToggle: false },
  render: ({ heading, subheading, loading, showBillingToggle }) => html`
    <nx-plan-grid
      heading=${heading}
      subheading=${subheading}
      ?loading=${loading}
      ?showBillingToggle=${showBillingToggle}
      .plans=${mockPlans}
    ></nx-plan-grid>
  `,
};

export const WithBillingToggle: Story = {
  args: { heading: 'Planes y precios', subheading: 'Ahorra un 20% con la facturación anual.', loading: false, showBillingToggle: true },
  render: ({ heading, subheading, showBillingToggle }) => html`
    <nx-plan-grid
      heading=${heading}
      subheading=${subheading}
      ?showBillingToggle=${showBillingToggle}
      yearlyDiscount="20%"
      .plans=${mockPlans}
    ></nx-plan-grid>
  `,
};

export const Loading: Story = {
  args: { heading: 'Planes y precios', subheading: '', loading: true, showBillingToggle: false },
  render: ({ heading, loading }) => html`
    <nx-plan-grid heading=${heading} ?loading=${loading} .plans=${[]}></nx-plan-grid>
  `,
};

export const Empty: Story = {
  render: () => html`
    <nx-plan-grid heading="Planes" .plans=${[]}></nx-plan-grid>
  `,
};
