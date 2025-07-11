// Ubah menjadi array
export const PERMISSION_TEMPLATES = ['view', 'create', 'edit', 'delete'] as const;

// Custom permissions yang bisa ditambahkan
export const CUSTOM_PERMISSIONS = {
  UPLOAD_FILE: 'upload_file',
  EXPORT_DATA: 'export_data',
  APPROVE: 'approve',
  REJECT: 'reject',
  DOWNLOAD: 'download',
  IMPORT: 'import'
} as const;

// Mapping dari path ke resource name
export const PATH_TO_RESOURCE_MAP: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/settings/user': 'user',
  '/settings/menu': 'menu', 
  '/technician': 'technician',
  '/pump-maintenance': 'pump_maintenance'
};

// Fungsi untuk mendapatkan resource name dari path
export const getResourceFromPath = (path: string): string => {
  // Cari exact match dulu
  if (PATH_TO_RESOURCE_MAP[path]) {
    return PATH_TO_RESOURCE_MAP[path];
  }
  
  // Cari partial match
  for (const [mapPath, resource] of Object.entries(PATH_TO_RESOURCE_MAP)) {
    if (path.startsWith(mapPath)) {
      return resource;
    }
  }
  
  // Fallback: ambil segment pertama
  const segments = path.replace(/^\//, '').split('/');
  return segments[0] || 'general';
};

// Fungsi untuk generate permission spesifik dengan custom permission opsional
export const generateSpecificPermissions = (
  templatePermissions: string[],
  resourceName: string,
  userCustomPermissions: string[] = [] // Parameter opsional dengan default array kosong
): string[] => {
  const specific: string[] = [];
  
  // Convert template permissions
  templatePermissions.forEach(template => {
    switch(template) {
      case 'view':
        if (resourceName === 'dashboard') {
          specific.push('view_dashboard');
        } else {
          specific.push(`read_${resourceName}`);
        }
        break;
      case 'create':
        specific.push(`create_${resourceName}`);
        break;
      case 'edit':
        specific.push(`update_${resourceName}`);
        break;
      case 'delete':
        specific.push(`delete_${resourceName}`);
        break;
    }
  });
  
  // Add user-defined custom permissions jika ada
  if (userCustomPermissions && userCustomPermissions.length > 0) {
    userCustomPermissions.forEach(userCustom => {
      const snakeCasePermission = userCustom.toLowerCase().replace(/\s+/g, '_');
      specific.push(`${snakeCasePermission}_${resourceName}`);
    });
  }
  
  return specific;
};

// Fungsi untuk reverse dari specific permissions ke template dan custom
export const reverseToTemplatePermissions = (
  specificPermissions: string[],
  resourceName: string
): { templates: string[], userCustoms: string[] } => {
  const templates: string[] = [];
  const userCustoms: string[] = [];
  
  specificPermissions.forEach(perm => {
    if (perm === 'view_dashboard' || perm === `read_${resourceName}`) {
      templates.push('view');
    } else if (perm === `create_${resourceName}`) {
      templates.push('create');
    } else if (perm === `update_${resourceName}`) {
      templates.push('edit');
    } else if (perm === `delete_${resourceName}`) {
      templates.push('delete');
    } else {
      // It's user-defined custom permission
      const userCustomPerm = perm.replace(`_${resourceName}`, '').replace(/_/g, ' ');
      userCustoms.push(userCustomPerm);
    }
  });
  
  return { templates, userCustoms };
};