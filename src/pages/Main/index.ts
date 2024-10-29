import { createApp } from "vue";
import Main from "./index.vue";

// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import { createVuetify } from 'vuetify';
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, md } from "vuetify/iconsets/md";
import 'vuetify/styles';

const app = createApp(Main);

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "md",
    aliases,
    sets: { md }
  },
});
app.use(vuetify);

app.mount("#app");
