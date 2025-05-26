export const checkPermissions = () => {
  const isContributor = localStorage.getItem('isContributor') === 'true';
  const isViewOnly = localStorage.getItem('isViewOnly') === 'true';
  const userRole = localStorage.getItem('userRole');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  // Admin has all permissions
  if (userRole === 'admin' || userInfo.role === 'admin') {
    return {
      canEdit: true,
      canAdd: true,
      canDelete: true,
      canView: true
    };
  }

  // If user is a contributor but not view-only
  if (isContributor && !isViewOnly) {
    return {
      canEdit: true,
      canAdd: true,
      canDelete: true,
      canView: true
    };
  }

  // If user is view-only
  if (isViewOnly) {
    return {
      canEdit: false,
      canAdd: false,
      canDelete: false,
      canView: true
    };
  }

  // Default permissions for family/caregiver
  return {
    canEdit: false,
    canAdd: false,
    canDelete: false,
    canView: true
  };
}; 