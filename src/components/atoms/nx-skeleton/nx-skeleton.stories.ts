import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { html } from 'lit';
import './nx-skeleton.ts';
import type { SkeletonVariant } from './nx-skeleton.ts';

interface SkeletonArgs { variant: SkeletonVariant; width: string; height: string; }

const meta: Meta<SkeletonArgs> = {
  title: 'Atoms/NxSkeleton',
  component: 'nx-skeleton',
  argTypes: { variant: { control: 'select', options: ['text','rect','circle'] } },
  parameters: { docs: { description: { component: 'Placeholder animado de carga. Tres variantes: text, rect, circle.' } } },
};
export default meta;
type Story = StoryObj<SkeletonArgs>;

export const Default: Story = {
  args: { variant: 'text', width: '200px', height: '' },
  render: ({ variant, width, height }) =>
    html`<nx-skeleton variant=${variant} width=${width} height=${height}></nx-skeleton>`,
};

export const CardSkeleton: Story = {
  render: () => html`
    <div style="max-width:320px;padding:1.5rem;border:1px solid var(--nx-color-border);border-radius:var(--nx-radius-card);display:flex;flex-direction:column;gap:0.75rem;">
      <nx-skeleton variant="rect" width="100%" height="160px"></nx-skeleton>
      <nx-skeleton variant="text" width="60%"></nx-skeleton>
      <nx-skeleton variant="text" width="90%"></nx-skeleton>
      <nx-skeleton variant="text" width="75%"></nx-skeleton>
      <nx-skeleton variant="rect" width="120px" height="2.5rem"></nx-skeleton>
    </div>
  `,
};

export const ProfileSkeleton: Story = {
  render: () => html`
    <div style="display:flex;align-items:center;gap:1rem;max-width:320px;">
      <nx-skeleton variant="circle" width="3rem"></nx-skeleton>
      <div style="flex:1;display:flex;flex-direction:column;gap:0.5rem;">
        <nx-skeleton variant="text" width="50%"></nx-skeleton>
        <nx-skeleton variant="text" width="80%"></nx-skeleton>
      </div>
    </div>
  `,
};
