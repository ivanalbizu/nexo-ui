import { describe, it, expect, afterEach } from 'vitest';
import './nx-input.ts';
import type { NxInput } from './nx-input.ts';

/** Monta un elemento en el DOM y lo devuelve ya upgradado. */
async function mount<T extends HTMLElement>(html: string): Promise<T> {
  const host = document.createElement('div');
  host.innerHTML = html.trim();
  document.body.appendChild(host);
  const el = host.firstElementChild as T;
  // Espera a que Lit complete el primer render
  await (el as unknown as { updateComplete: Promise<boolean> }).updateComplete;
  return el;
}

describe('nx-input · form association + validity', () => {
  let el: NxInput;

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('required sin valor marca valueMissing en ElementInternals', async () => {
    el = await mount<NxInput>(`<nx-input label="Nombre" required></nx-input>`);
    const internals = (el as unknown as { _internals: ElementInternals })._internals;

    expect(internals.validity.valueMissing).toBe(true);
    expect(internals.validity.valid).toBe(false);
  });

  it('required con valor pasa a ser válido', async () => {
    el = await mount<NxInput>(`<nx-input label="Nombre" required value="Iván"></nx-input>`);
    const internals = (el as unknown as { _internals: ElementInternals })._internals;

    expect(internals.validity.valueMissing).toBe(false);
    expect(internals.validity.valid).toBe(true);
  });

  it('error prop marca customError en ElementInternals', async () => {
    el = await mount<NxInput>(`<nx-input label="Email" value="x" error="Email inválido"></nx-input>`);
    const internals = (el as unknown as { _internals: ElementInternals })._internals;

    expect(internals.validity.customError).toBe(true);
    expect(internals.validationMessage).toBe('Email inválido');
  });

  it('emite nx-input-input al escribir en el <input> interno', async () => {
    el = await mount<NxInput>(`<nx-input label="Buscar"></nx-input>`);
    const events: CustomEvent[] = [];
    el.addEventListener('nx-input-input', (e) => events.push(e as CustomEvent));

    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'hola';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));

    expect(events).toHaveLength(1);
    expect(events[0].detail).toEqual({ value: 'hola' });
    expect(el.value).toBe('hola');
  });

  it('hide-label oculta visualmente el label pero lo mantiene en el árbol a11y', async () => {
    el = await mount<NxInput>(`<nx-input label="Buscar" hide-label></nx-input>`);
    const label = el.shadowRoot!.querySelector('label')!;

    expect(label).toBeTruthy();
    expect(label.textContent?.trim()).toContain('Buscar');
    const rect = label.getBoundingClientRect();
    // El label está clipado a 1x1
    expect(rect.width).toBeLessThanOrEqual(1);
    expect(rect.height).toBeLessThanOrEqual(1);
  });

  it('min/max/step solo se aplican si type="number"', async () => {
    el = await mount<NxInput>(`<nx-input type="number" min="0" max="10" step="2"></nx-input>`);
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.min).toBe('0');
    expect(input.max).toBe('10');
    expect(input.step).toBe('2');

    const text = await mount<NxInput>(`<nx-input type="text" min="0" max="10"></nx-input>`);
    const textInput = text.shadowRoot!.querySelector('input')!;
    expect(textInput.getAttribute('min')).toBe(null);
    expect(textInput.getAttribute('max')).toBe(null);
  });
});
