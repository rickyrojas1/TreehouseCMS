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
        provider: env('NODE_ENV') === 'production' || env.bool('STRAPI_UPLOAD_USE_R2', false) ? 'aws-s3' : 'local',
        providerOptions: {
          baseUrl: env('AWS_BASE_URL'),
          rootPath: env('AWS_ROOT_PATH', ''),
          s3Options: {
            credentials: {
              accessKeyId: env('AWS_ACCESS_KEY_ID'),
              secretAccessKey: env('AWS_ACCESS_SECRET'),
            },
            region: env('AWS_REGION', 'auto'),
            endpoint: env('AWS_ENDPOINT'),
            params: {
              Bucket: env('AWS_BUCKET'),
            },
          },
        },
        actionOptions: {
          upload: {},
          uploadStream: {},
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
