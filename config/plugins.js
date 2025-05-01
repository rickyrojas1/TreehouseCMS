module.exports = ({ env }) => ({
    'users-permissions': {
      config: {
      jwtSecret: env('JWT_SECRET'),
      },
    },
    seo: {
      enabled: true,
    },
    upload: {
      config: {
        provider: env('NODE_ENV') === 'production' ? 'cloudinary' : 'local',
        providerOptions: {
          cloud_name: env('CLOUDINARY_NAME'),
          api_key: env('CLOUDINARY_KEY'),
          api_secret: env('CLOUDINARY_SECRET'),
        },
        // provider: 'cloudinary',
        // providerOptions: {
        //   cloud_name: env('CLOUDINARY_NAME'),
        //   api_key: env('CLOUDINARY_KEY'),
        //   api_secret: env('CLOUDINARY_SECRET'),
        // },
        actionOptions: {
          upload: {},
          delete: {},
        },
      },
    },
    email: {
      config: {
        provider: 'strapi-provider-email-resend',
        providerOptions: {
          apiKey: env('RESEND_API_KEY'), // Required
        },
        settings: {
          defaultFrom: 'info@treehousecannabis.com',
          defaultReplyTo: 'info@treehousecannabis.com',
        },
      }
    },
    'content-source-map': {
      enabled: true,
      config: {
        contentTypes: ['api::article.article', 'api::restaurant.restaurant'],
        origin: 'strapi.io',
        baseHref: env('NODE_ENV') === 'production' ? 'https://treehouse.up.railway.app' : 'http://localhost:1337',
      },
    },
    scheduler: {
		enabled: true,
		config: {
			contentTypes: {
				'api::blog-post.blog-post': {

        }
			}
		}
	},
  });
