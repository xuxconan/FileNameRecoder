import { createApp } from "vue";
import Main from "./index.vue";

// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify';
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import 'vuetify/styles';

const app = createApp(Main);

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi }
  },
});
app.use(vuetify);

app.mount("#app");
