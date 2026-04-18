import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-coupon-box.js';

interface Args {
  label: string;
  amount: string;
  footnote: string;
  variant: 'outline' | 'dashed' | 'solid';
  emphasis: 'amount' | 'text';
}

const meta: Meta<Args> = {
  title: 'Molecules/NxCouponBox',
  component: 'nx-coupon-box',
  argTypes: {
    variant:  { control: 'inline-radio', options: ['outline', 'dashed', 'solid'] },
    emphasis: { control: 'inline-radio', options: ['amount', 'text'] },
  },
  parameters: { docs: { description: { component: 'Recuadro destacado para cupones/premios en banners promocionales. Soporta bordes sólidos, discontinuos o fondo sólido.' } } },
};
export default meta;
type Story = StoryObj<Args>;

const DARK = 'style="background:#0a0a0a;padding:2rem;display:flex;gap:1.5rem;flex-wrap:wrap;align-items:flex-start;"';

export const Default: Story = {
  args: { label: 'Cupón dto.', amount: 'Hasta 30€', footnote: 'para asistentes', variant: 'outline', emphasis: 'amount' },
  render: ({ label, amount, footnote, variant, emphasis }) => html`
    <div ${DARK}>
      <nx-coupon-box
        style="--nx-color-accent:#ff7900"
        label=${label}
        amount=${amount}
        footnote=${footnote}
        variant=${variant}
        emphasis=${emphasis}
      ></nx-coupon-box>
    </div>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div ${DARK} style="background:#0a0a0a;padding:2rem;display:flex;gap:1.5rem;flex-wrap:wrap;">
      <nx-coupon-box variant="outline" label="Cupón dto."     amount="Hasta 30€"  footnote="para asistentes" style="--nx-color-accent:#ff7900"></nx-coupon-box>
      <nx-coupon-box variant="dashed"  label="Cupón dto."     amount="Hasta 100€" footnote="asistentes"       style="--nx-color-accent:#ff7900"></nx-coupon-box>
      <nx-coupon-box variant="solid"   label="Cupón dto. desde 100€" footnote="para asistentes" style="--nx-color-accent:#00a862"></nx-coupon-box>
    </div>
  `,
};

export const PrizeEmphasis: Story = {
  name: 'Énfasis en texto (premio)',
  render: () => html`
    <div style="background:#0a0a0a;padding:2rem;">
      <nx-coupon-box
        emphasis="text"
        label="¡Podrás ganar una TheraFace Mask Glo!"
        style="--nx-color-accent:#e4002b"
      ></nx-coupon-box>
    </div>
  `,
};
