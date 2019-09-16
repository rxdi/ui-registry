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


#### Modify Authentication logic

Add inside the working directory file with name `interceptor.ts` and add following content;
if using `docker` place `interceptor.ts` inside `my-project` or mount it at with custom folder `-v $(pwd)/files:/usr/src/app/files`
as long as `interceptor.ts` present inside `/usr/src/app/files` it will be loaded.

Working with this approach you need to set `--interceptor ./interceptor.ts` argument

```typescript
import { Request } from 'hapi';
import { errorUnauthorized, GenericGapiResolversType } from '@gapi/core';

interface Context {
  user: { type: string };
}

interface Resolver extends GenericGapiResolversType {
  scope?: string[];
  public?: boolean;
}

function canAccess(resolverScope: string[], context: Context) {
  return context && context.user && resolverScope.filter(scope => scope === context.user.type).length
    ? true
    : errorUnauthorized();
}
function AuthenticationHooks(resolver: Resolver, context: Context) {
  canAccess(resolver.scope, context);
}
function ResolverHooks(resolver: Resolver, root, args, context: Context, info) {
  if (resolver && !resolver.public) {
    AuthenticationHooks(resolver, context);
  }
}


export async function OnRequestHook(request: Request) {
  return { user: { type: 'ADMIN' } };
}

export async function ResolverHook(resolver: Resolver, root, args, context: Context, info) {
    return ResolverHooks(resolver, root, args, context, info);
}


```

Important part is that we export 2 methods `OnRequestHook` and `ResolverHook`
These are named for convenience the script internally will take UP to 2 methods

1. Request handler function - will populate `context` variable for resolver
2. Resolver hook function - on every request apply some authentication logic
3. By default every resolver scope is predefined with `ADMIN` to change it set Environment variable `APP_DEFAULT_SCOPE`

```typescript
export async function MyMethodWhichWillPopulateContext(request: Request) {
  return { user: { type: 'ADMIN' } };
}

export async function MyMethodThatWillBeRunnedOnEveryRequest(resolver: Resolver, root, args, context: Context, info) {
    console.log(context);
    return ResolverHooks(resolver, root, args, context, info);
}
```



#### Advanced technique

Create `import.ts` file and pass argument `--import ./import.ts` with the following format

```typescript
import {
  Module,
  ON_REQUEST_HANDLER,
  GRAPHQL_PLUGIN_CONFIG,
  Boom,
  RESOLVER_HOOK,
  GenericGapiResolversType
} from '@gapi/core';
import { ResponseToolkit } from 'hapi';

@Module({
  providers: [
    {
      provide: ON_REQUEST_HANDLER,
      deps: [GRAPHQL_PLUGIN_CONFIG],
      useFactory: (config: GRAPHQL_PLUGIN_CONFIG) => async (
        next,
        request: Request,
        h: ResponseToolkit,
        err: Error
      ) => {
        if (request.headers['authorization']) {
          try {
            config.graphqlOptions.context = {};
          } catch (e) {
            Boom.unauthorized();
          }
        } else {
          config.graphqlOptions.context = null;
        }
        return next();
      }
    },
    {
      provide: RESOLVER_HOOK,
      useFactory: () => (resolver: GenericGapiResolversType) => {
        const resolve = resolver.resolve.bind(resolver.target);
        resolver.resolve = async function(root, args, context, info, ...a) {
          // Do something with resolver
          return resolve(root, args, context, info, ...a);
        };
        return resolver;
      }
    }
  ]
})
export class TestImport {}

```