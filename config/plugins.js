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
  });
