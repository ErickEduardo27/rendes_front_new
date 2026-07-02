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

/** Usuario de clínica u hospital (no supervisor ni admin). */
export function esPerfilClinica() {
  const p = obtenerNombrePerfil().toLowerCase();
  if (esSupervisor() || esAdmin()) return false;
  return p.includes('clínica') || p.includes('clinica') || p.includes('hospital');
}

export function esEvaluador() {
  return esSupervisor() || esAdmin();
}

/** Clínicas, hospitales y supervisor: solo IPRESS asignadas en rd_usuarios_ipress. */
export function debeLimitarClinicasAlUsuario() {
  const p = obtenerNombrePerfil().toLowerCase();
  return (
    p.includes('clínica') ||
    p.includes('clinica') ||
    p.includes('hospital') ||
    p.includes('supervisor')
  );
}
