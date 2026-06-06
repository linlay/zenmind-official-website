export function isAdminUser(user) {
  return user?.role === 'admin' || user?.role === 'administrator';
}
