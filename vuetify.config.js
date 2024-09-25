import { createVuetify } from 'vuetify';
import { VDateInput } from 'vuetify/labs/VDateInput'
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

export const vuetify = createVuetify({
  components,
  directives,
  VDateInput,
}); 

