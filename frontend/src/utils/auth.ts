export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

export const isAdmin = () => {
  const user = getCurrentUser();
  if (!user) return false;
  return user.role === 'ADMIN' || user.is_staff || user.is_admin || user.is_superuser;
};

export default { getCurrentUser, isAdmin };
