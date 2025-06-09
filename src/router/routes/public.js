import App from '@/App.vue';
import Patient from '@/pages/patient/Patient.vue';

export default [
  {
    path: '/',
    name: 'Home',
    component: App,
  },
  {
    path: '/newpatient',
    name: 'NewPatient',
    component: Patient,
  }
]
