import { Module, ON_REQUEST_HANDLER, GRAPHQL_PLUGIN_CONFIG, Boom, RESOLVER_HOOK, GenericGapiResolversType } from '@gapi/core';
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
          console.log("AAA")
          return resolve(root, args, context, info, ...a);
        };
        return resolver;
      }
    }
  ]
})
export class TestImport {}
