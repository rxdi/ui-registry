import { html, render, async, until } from '@rxdi/lit-html';

interface ModuleMetadata {
  createdAt: string;
  message: string;
  module: string;
  name: string;
  previous: string[];
  typings: string;
}

const metadata: ModuleMetadata = JSON.parse(
  window.document
    .getElementById('meta-rxdi-ipfs-module')
    .innerHTML.split('<!--meta-rxdi-ipfs-module-->')[1]
);
function generateHref(hash: string, _target: '_blank' | '_self' = '_blank') {
  return html`
    <a target=${_target} href="https://ipfs.io/ipfs/${hash}">${hash}</a>
  `;
}
async function init() {
  render(
    html`
      <div style="margin:0 auto; width: 600px;">
        <div style="text-align: center">
          <h2>Created At:</h2>
          <h3>${new Date(metadata.createdAt).toDateString()}</h3>
        </div>
        <p>
          Commit message:
          "${html`
            ${until(
              (await fetch(`https://ipfs.io/ipfs/${metadata.message}`)).text(),
              html`
                <span>Loading hash ${generateHref(metadata.message)}...</span>
              `
            )}
          `}"
        </p>
        <p>Namespace: ${metadata.name}</p>
        <p>Module: ${generateHref(metadata.module)}</p>
        <p>Typings: ${generateHref(metadata.typings)}</p>
        <p>
          Previous versions:
          ${metadata.previous.map(
            hash =>
              html`
                <p>${generateHref(hash, '_self')}</p>
              `
          )}
        </p>
      </div>
    `,
    document.getElementById('container')
  );
}

init();
