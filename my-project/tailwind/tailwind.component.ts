import { Component, html } from '@rxdi/lit-html';

/**
 * @customElement inject-tailwind
 */
@Component({
  selector: 'inject-tailwind',
  template: () => html`
    <link
      href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css"
      rel="stylesheet"
    />
  `,
})
export class TailWindComponent extends HTMLElement {}
