
import favicon from './extensions/favicon.ico';


const config = {
  head: {
    favicon: favicon,
  },
  locales: [],
  translations: {
    en: {
      "Auth.form.welcome.title": "Welcome to Treehouse CMS",
      "Auth.form.welcome.subtitle": "Log in to the CMS",
      "app.components.LeftMenu.navbrand.title": "Treehouse CMS"
    },
  },
  theme: {
    dark: {
      // colors: {
      //   primary100: '#c9ffeb',
      //   primary200: '#5effc3',
      //   primary500: '#00f298',
      //   buttonPrimary500: '#fff298',
      //   primary600: '#00bd77',
      //   buttonPrimary600: '#ffbd77',
      //   primary700: '#008755',
      // }
    }
  }
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};
