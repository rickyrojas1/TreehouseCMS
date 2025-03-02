module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::poweredBy',
  {
    name: 'strapi::cors',
    config: {
      // headers: '*',
      origin: ['https://www.treehousecannabis.com','https://treehousecannabis.com', 'http://localhost:3000', 'http://localhost:1337', 'https://treehouse.up.railway.app', 'https://treehouse-admin-tools.vercel.app', "https://tools.treehousecannabis.com", "https://treehouse-dispensary-git-feature-user-accounts-treehouse.vercel.app", "http://dev.treehousecannabis.com/"],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
