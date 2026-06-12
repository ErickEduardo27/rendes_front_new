import { useAuthStore } from '@/store/auth';

export function obtenerNombrePerfil() {
  const authStore = useAuthStore();
  const u = authStore.user;
  return String(u?.datosPerfil?.perfil ?? (typeof localStorage !== 'undefined' ? localStorage.getItem('perfil') : '') ?? '').trim();
}

export function esSupervisor() {
  return obtenerNombrePerfil().toLowerCase().includes('supervisor');
}

export function esAdmin() {
  const p = obtenerNombrePerfil().toLowerCase();
  return p.includes('admin');
}

export function esEvaluador() {
  return esSupervisor() || esAdmin();
}
