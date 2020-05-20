import { ApolloServer } from 'apollo-server-micro';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import schema from 'data/schema';
import { createResolverContext } from 'data/with-apollo';

const apolloServer = new ApolloServer({
  schema,
  cacheControl: {
    /**
     *  * Set defaultMax Age to 5 Min or highest cache age
     *  ! Bug in Apollo Server that defaultMaxAge overrides @cacheControl
     *  ! if defaultMaxAge is less than @cacheControl
     *  ! Make sure to override in your schema
     *  TODO: Fix Apollo Server caching issue
     */
    defaultMaxAge: 300,
  },
  context: createResolverContext,
  plugins: [responseCachePlugin()],
  introspection: __DEV__,
  playground: __DEV__,
  debug: __DEV__,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default apolloServer.createHandler({ path: '/api/graphql' });
