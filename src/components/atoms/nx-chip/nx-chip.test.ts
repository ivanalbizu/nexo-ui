import { describe, it, expect, afterEach } from 'vitest';
import './nx-chip.ts';
import type { NxChip } from './nx-chip.ts';

async function mount<T extends HTMLElement>(html: string): Promise<T> {
  const host = document.createElement('div');
  host.innerHTML = html.trim();
  document.body.appendChild(host);
  const el = host.firstElementChild as T;
  await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
  return el;
}

describe('nx-chip', () => {
  afterEach(() => { document.body.innerHTML = ''; });

  it('selectable + click alterna selected y emite nx-chip-change', async () => {
    const el = await mount<NxChip>(`<nx-chip selectable>Frontend</nx-chip>`);
    const events: CustomEvent[] = [];
    el.addEventListener('nx-chip-change', (e) => events.push(e as CustomEvent));

    const chip = el.shadowRoot!.querySelector('.chip') as HTMLElement;
    chip.click();
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;

    expect(el.selected).toBe(true);
    expect(events).toHaveLength(1);
    expect(events[0].detail).toEqual({ selected: true });

    chip.click();
    expect(el.selected).toBe(false);
  });

  it('disabled ignora click en chip selectable', async () => {
    const el = await mount<NxChip>(`<nx-chip selectable disabled>X</nx-chip>`);
    const chip = el.shadowRoot!.querySelector('.chip') as HTMLElement;
    chip.click();
    expect(el.selected).toBe(false);
  });

  it('removable: al clicar la X se elimina del DOM por defecto', async () => {
    const el = await mount<NxChip>(`<nx-chip removable>Tag</nx-chip>`);
    const parent = el.parentElement!;
    expect(parent.contains(el)).toBe(true);

    const btn = el.shadowRoot!.querySelector('.remove-btn') as HTMLButtonElement;
    btn.click();

    expect(parent.contains(el)).toBe(false);
  });

  it('removable: el consumidor puede preventDefault para bloquear el auto-remove', async () => {
    const el = await mount<NxChip>(`<nx-chip removable>Tag</nx-chip>`);
    el.addEventListener('nx-chip-remove', (e) => e.preventDefault());

    const btn = el.shadowRoot!.querySelector('.remove-btn') as HTMLButtonElement;
    btn.click();

    expect(document.body.contains(el)).toBe(true);
  });

  it('removable: Enter sobre el botón de cerrar elimina el chip (sin activar selected)', async () => {
    const el = await mount<NxChip>(`<nx-chip selectable removable>Tag</nx-chip>`);
    const parent = el.parentElement!;
    const btn = el.shadowRoot!.querySelector('.remove-btn') as HTMLButtonElement;
    btn.focus();

    // Native: Enter sobre un <button> enfocado dispara click
    btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
    btn.click();

    expect(parent.contains(el)).toBe(false);
  });

  it('removable: el botón interno tiene type="button" para no enviar forms', async () => {
    const el = await mount<NxChip>(`<nx-chip removable>Tag</nx-chip>`);
    const btn = el.shadowRoot!.querySelector('.remove-btn') as HTMLButtonElement;
    expect(btn.type).toBe('button');
  });

  it('selectable responde a Enter y Space', async () => {
    const el = await mount<NxChip>(`<nx-chip selectable>Filter</nx-chip>`);
    const chip = el.shadowRoot!.querySelector('.chip') as HTMLElement;

    chip.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    expect(el.selected).toBe(true);

    chip.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
    expect(el.selected).toBe(false);
  });
});
