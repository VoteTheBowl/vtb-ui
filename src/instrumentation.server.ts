import * as Sentry from '@sentry/sveltekit';

Sentry.init({
  dsn: 'https://1bf124d933cc69a3dd293b1b81384768@o4511135136743424.ingest.us.sentry.io/4512026580090880',
  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: import.meta.env.DEV,
});