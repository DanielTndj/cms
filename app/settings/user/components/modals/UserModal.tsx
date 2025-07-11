"use client"

import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form'
import { Input } from '@components/ui/input'
import { Button } from '@components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { User, UserFormData } from '../../types/entities'
import { USER_ROLES, USER_STATUS_LABELS } from '@constants/user'
import { useMenuData } from '@settings/user/hooks/useMenuData'
import SelectMultiple, { MultiValue } from "react-select"

type SelectOption = {
  value: number | string;
  label: string;
};

const roleValues = Object.values(USER_ROLES) as [string, ...string[]];
const statusValues = Object.keys(USER_STATUS_LABELS) as [keyof typeof USER_STATUS_LABELS, ...Array<keyof typeof USER_STATUS_LABELS>];

const userSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  email: z.string().email('Email tidak valid'),
  role: z.enum(roleValues, {
    required_error: 'Role harus dipilih'
  }),
  status: z.enum(statusValues, {
    required_error: 'Status harus dipilih'
  }),
  permissions: z.array(z.string()).min(1, 'Minimal satu permission harus dipilih'),
  phone: z.string().optional(),
  menuAccess: z.object({
    parentMenus: z.array(z.number()),
    childMenus: z.array(z.number())
  })
})

interface UserModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: UserFormData) => Promise<void>
  user?: User | null
  isEditing: boolean
}

export function UserModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  isEditing
}: UserModalProps) {
  const { parentMenus, getChildMenus, menuItems } = useMenuData();

  type UserFormSchema = z.infer<typeof userSchema>;
  
  const form = useForm<UserFormSchema>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      role: 'viewer',
      status: 'active',
      permissions: [],
      phone: '',
      menuAccess: {
        parentMenus: [],
        childMenus: []
      }
    },
  })
  
  useEffect(() => {
    if (user && isEditing) {
      form.reset({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'viewer',
        status: user.status || 'active',
        permissions: user.permissions || [],
        phone: user.phone || '',
        menuAccess: {
          parentMenus: user.menuAccess?.parentMenus || [],
          childMenus: user.menuAccess?.childMenus || []
        }
      });
    } else if (!isEditing) {
      form.reset({
        name: '',
        email: '',
        role: 'viewer',
        status: 'active',
        permissions: [],
        phone: '',
        menuAccess: {
          parentMenus: [],
          childMenus: []
        }
      });
    }
  }, [user, isEditing, form]);
  
  const handleSubmit = async (data: UserFormSchema) => {
    try {
      const formData: UserFormData = {
        ...data,
        role: data.role as 'admin' | 'editor' | 'viewer'
      };
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const selectedParentMenus = form.watch('menuAccess.parentMenus');
  const selectedChildMenus = form.watch('menuAccess.childMenus');

  const availableChildMenus = useMemo(() => {
    return selectedParentMenus.flatMap(parentId => getChildMenus(parentId));
  }, [selectedParentMenus, getChildMenus]);

  const availablePermissions = useMemo(() => {
    const permissions = new Set<string>();

    selectedParentMenus.forEach(parentId => {
      const parentMenu = parentMenus.find(menu => menu.id === parentId);
      if (parentMenu?.permissions) {
        parentMenu.permissions.forEach(permission => permissions.add(permission));
      }
    });

    selectedChildMenus.forEach(childId => {
      const childMenu = menuItems.find(menu => menu.id === childId);
      if (childMenu?.permissions) {
        childMenu.permissions.forEach(permission => permissions.add(permission));
      }
    });

    return Array.from(permissions).sort();
  }, [selectedParentMenus, selectedChildMenus, parentMenus, menuItems]);

  const getParentMenuOptions = (): SelectOption[] => {
    const options: SelectOption[] = [
      { value: 'all', label: 'Select All Parent Menus' }
    ];
    
    parentMenus.forEach(menu => {
      options.push({
        value: menu.id,
        label: menu.title 
      });
    });
    
    return options;
  };

  const getChildMenuOptions = (): SelectOption[] => {
    const options: SelectOption[] = [];
    
    if (availableChildMenus.length > 0) {
      options.push({ value: 'all', label: 'Select All Child Menus' });
      
      availableChildMenus.forEach(menu => {
        options.push({
          value: menu.id,
          label: menu.title 
        });
      });
    }
    
    return options;
  };

  const getPermissionOptions = (): SelectOption[] => {
    const options: SelectOption[] = [];
    
    if (availablePermissions.length > 0) {
      options.push({ value: 'all', label: 'Select All Permissions' });
      
      availablePermissions.forEach(permission => {
        options.push({
          value: permission,
          label: permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
        });
      });
    }
    
    return options;
  };

  const updatePermissionsBasedOnMenus = () => {
    const permissions = new Set<string>();
  
    selectedParentMenus.forEach(parentId => {
      const parentMenu = parentMenus.find(menu => menu.id === parentId);
      if (parentMenu?.permissions) {
        parentMenu.permissions.forEach(permission => permissions.add(permission));
      }
    });
  
    selectedChildMenus.forEach(childId => {
      const childMenu = menuItems.find(menu => menu.id === childId);
      if (childMenu?.permissions) {
        childMenu.permissions.forEach(permission => permissions.add(permission));
      }
    });
  
    form.setValue('permissions', Array.from(permissions));
  };

  const handleParentMenusChange = (selectedOptions: MultiValue<SelectOption>) => {
    const hasSelectAll = selectedOptions.some(option => option.value === 'all');
    
    let selectedIds: number[];
    
    if (hasSelectAll) {
      selectedIds = parentMenus.map(menu => menu.id);
    } else {
      selectedIds = selectedOptions
        .filter(option => option.value !== 'all')
        .map(option => option.value as number);
    }
    
    form.setValue('menuAccess.parentMenus', selectedIds);
    
    const availableChildIds = selectedIds.flatMap((parentId: number) => getChildMenus(parentId).map(child => child.id));
    
    const currentChildMenus = form.getValues('menuAccess.childMenus');
    const validChildMenus = currentChildMenus.filter(childId => availableChildIds.includes(childId));
    
    form.setValue('menuAccess.childMenus', validChildMenus);
    
    setTimeout(updatePermissionsBasedOnMenus, 0);
  };

  const handleChildMenusChange = (selectedOptions: MultiValue<SelectOption>) => {
    const values = selectedOptions || [];
    
    const hasSelectAll = values.some(option => option.value === 'all');
    
    if (hasSelectAll) {
      const allChildIds = availableChildMenus.map(menu => menu.id);
      form.setValue('menuAccess.childMenus', allChildIds);
    } else {
      const selectedIds = values
        .filter(option => option.value !== 'all')
        .map(option => option.value as number);
      
      form.setValue('menuAccess.childMenus', selectedIds);
    }
    
    setTimeout(updatePermissionsBasedOnMenus, 0);
  };

  const handlePermissionsChange = (selectedOptions: MultiValue<SelectOption>) => {
    const values = selectedOptions || [];
    
    const hasSelectAll = values.some(option => option.value === 'all');
    
    if (hasSelectAll) {
      form.setValue('permissions', [...availablePermissions]);
    } else {
      const selectedPermissions = values
        .filter(option => option.value !== 'all')
        .map(option => option.value as string);
      
      form.setValue('permissions', selectedPermissions);
    }
  };

  const getCurrentParentMenuValues = (): SelectOption[] => {
    return selectedParentMenus.map(id => {
      const menu = parentMenus.find(m => m.id === id);
      return {
        value: id,
        label: menu ? menu.title : `Menu ${id}` 
      };
    });
  };

  const getCurrentChildMenuValues = (): SelectOption[] => {
    return selectedChildMenus.map(id => {
      const menu = menuItems.find(m => m.id === id);
      return {
        value: id,
        label: menu ? menu.title : `Menu ${id}` 
      };
    });
  };
  
  const getCurrentPermissionValues = (): SelectOption[] => {
    const currentPermissions = form.watch('permissions');
    return currentPermissions.map(permission => ({
      value: permission,
      label: permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit User' : 'Add New User'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nama user" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Masukkan email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon (Opsional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor telepon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(USER_ROLES).map(([key, label]) => (
                        <SelectItem key={key} value={label}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(USER_STATUS_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Menu Access</FormLabel>

              <FormField
                control={form.control}
                name="menuAccess.parentMenus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Parent Menus</FormLabel>
                    <FormControl>
                      <SelectMultiple
                        isMulti
                        options={getParentMenuOptions()}
                        value={getCurrentParentMenuValues()}
                        onChange={handleParentMenusChange}
                        placeholder="Pilih parent menus..."
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {availableChildMenus.length > 0 && (
                <FormField
                  control={form.control}
                  name="menuAccess.childMenus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Child Menus</FormLabel>
                      <FormControl>
                        <SelectMultiple
                          isMulti
                          options={getChildMenuOptions()}
                          value={getCurrentChildMenuValues()}
                          onChange={handleChildMenusChange}
                          placeholder="Pilih child menus..."
                          className="react-select-container"
                          classNamePrefix="react-select"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {(selectedParentMenus.length > 0 || selectedChildMenus.length > 0) && availablePermissions.length > 0 && (
            <FormField
              control={form.control}
              name="permissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Permissions (Berdasarkan Menu Terpilih)
                  </FormLabel>
                  <FormControl>
                    <SelectMultiple
                      isMulti
                      options={getPermissionOptions()}
                      value={getCurrentPermissionValues()}
                      onChange={handlePermissionsChange}
                      placeholder="Pilih permissions..."
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            )}

            {(selectedParentMenus.length > 0 || selectedChildMenus.length > 0) && availablePermissions.length === 0 && (
              <div className="text-sm text-muted-foreground p-4 bg-muted rounded-md">
                Menu yang dipilih tidak memiliki permissions yang tersedia.
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}