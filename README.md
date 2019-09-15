# @rxdi/ui-registry

* Reusability of components
* IPFS Components registry
* Decentralized future

## Setup

## Local machine

Install `@rxdi/deploy` global

```bash
npm i -g @rxdi/deploy
```

Execute command:
```bash
rxdi-deploy --graphiql-playground --webui --browser --ipfs-api-gateway 8080 --ipfs-api-port 5001
```

Current working directory will be used for serving files throught Web user interface 

This setup will create following directories inide current user folder `~/` `~/.jsipfs`, `~/.rxdi`, `~/.packages` 

### Docker

Create `my-project` directory

```
mkdir my-project
```

#### Spawn `ipfs node` for Web and components bundling
```bash
docker run \
  -p 8957:8957 \
  -p 5001:5001 \
  -p 8080:8080 \
  -p 9300:9300 \
  -v $(pwd)/my-project:/usr/src/app/files \
  -v $(pwd)/packages:/usr/src/app/packages \
  -v $(pwd)/.rxdi:/root/.rxdi \
  -v $(pwd)/.jsipfs:/root/.jsipfs \
  -i \
  -t \
  rxdi/deploy:latest \
  --graphiql-playground \
  --webui
  --browser
```

#### Spawn `ipfs node` for Backend bundling

```bash
docker run \
  -p 8957:8957 \
  -p 5001:5001 \
  -p 8080:8080 \
  -p 9300:9300 \
  -v $(pwd)/my-project:/usr/src/app/files \
  -v $(pwd)/packages:/usr/src/app/packages \
  -v $(pwd)/.rxdi:/root/.rxdi \
  -v $(pwd)/.jsipfs:/root/.jsipfs \
  -i \
  -t \
  rxdi/deploy:latest \
  --graphiql-playground \
  --webui
```


## Open WebUI

Managing your deployment processes
```bash
http://localhost:9300/webui/
```

## Creating your first component

```bash
cd my-project && mkdir trello
```

```typescript
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
```

## Trigger build for component
```graphql
mutation {
  triggerBuild(
    buildFolder: "./trello-component/build"
    file: "trello.component.ts"
    folder: "./trello-component/"
    message: "Init trello component"
    namespace: "@my-project/trello"
  ) {
    status
    file {
      hash
    }
  }
}
```

This will give you `ipfs` hash `QmQGKFj9pF8pcdffdnRZJ5rLg1rs8xiNh2D974ZG9FQsgU`

Default provider is `http://127.0.0.1:8080/ipfs/` so we can access our transpiled file at address http://127.0.0.1:8080/ipfs/QmQGKFj9pF8pcdffdnRZJ5rLg1rs8xiNh2D974ZG9FQsgU


## Mapping to `@rxdi/graphqj` configuration

```yml
$views:
  home:
    components:
      - link: http://127.0.0.1:8080/ipfs/QmQGKFj9pF8pcdffdnRZJ5rLg1rs8xiNh2D974ZG9FQsgU
        selector: trello-component
    html: |
      <trello-component></trello-component>

```