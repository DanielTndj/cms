import React, { useEffect, useState } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';
import { Switch } from '@components/ui/switch';
import { Checkbox } from '@components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { X, Plus } from 'lucide-react';
import { MenuItem, MenuFormData } from '../../types/entities';
import {
  PERMISSION_TEMPLATES,
  generateSpecificPermissions,
  reverseToTemplatePermissions,
  getResourceFromPath,
} from '@constants/permissionTemplates';

// Schema untuk validasi form - disesuaikan dengan MenuFormData
const menuSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  path: z.string().min(1, 'Path is required'),
  icon: z.string().optional(),
  order: z.number().min(0, 'Order must be a positive number'),
  isVisible: z.boolean(),
  permissions: z.array(z.string()),
  userCustomPermissions: z.array(z.string()).optional(),
  parentId: z.string().optional(), // Sesuaikan dengan MenuFormData: string | undefined
});

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: MenuFormData) => void;
  menuItem?: MenuItem;
  isEditing?: boolean;
  menuItems: MenuItem[];
}

export default function MenuModal({
  isOpen,
  onClose,
  onSubmit,
  menuItem,
  isEditing = false,
  menuItems,
}: MenuModalProps) {
  const [customPermissionInput, setCustomPermissionInput] = useState('');

  const form = useForm<MenuFormData>({
    resolver: zodResolver(menuSchema) as Resolver<MenuFormData>,
    defaultValues: {
      title: '',
      path: '',
      icon: '',
      order: 0,
      isVisible: true,
      permissions: [],
      userCustomPermissions: [],
      parentId: undefined,
    },
  });

  // Reset form ketika modal dibuka/ditutup atau menuItem berubah
  useEffect(() => {
    if (isOpen) {
      if (isEditing && menuItem) {
        const resource = getResourceFromPath(menuItem.path);

        const { templates, userCustoms } = reverseToTemplatePermissions(
          menuItem.permissions,
          resource
        );

        form.reset({
          title: menuItem.title,
          path: menuItem.path,
          icon: menuItem.icon || '',
          order: menuItem.order,
          isVisible: menuItem.isVisible,
          permissions: templates,
          userCustomPermissions: userCustoms,
          parentId: menuItem.parentId ? String(menuItem.parentId) : undefined, // Convert number to string
        });
      } else {
        form.reset({
          title: '',
          path: '',
          icon: '',
          order: 0,
          isVisible: true,
          permissions: [],
          userCustomPermissions: [],
          parentId: undefined,
        });
      }
    }
  }, [isOpen, isEditing, menuItem, form]);

  // Fungsi untuk menambah custom permission dengan pengecekan aman
  const addCustomPermission = () => {
    if (customPermissionInput.trim()) {
      const currentCustomPermissions = form.getValues('userCustomPermissions') ?? [];
      if (!currentCustomPermissions.includes(customPermissionInput.trim())) {
        form.setValue('userCustomPermissions', [
          ...currentCustomPermissions,
          customPermissionInput.trim(),
        ]);
        setCustomPermissionInput('');
      }
    }
  };
  
  // Fungsi untuk menghapus custom permission dengan pengecekan aman
  const removeCustomPermission = (permission: string) => {
    const currentCustomPermissions = form.getValues('userCustomPermissions') ?? [];
    form.setValue(
      'userCustomPermissions',
      currentCustomPermissions.filter((p) => p !== permission)
    );
  };

  // Handle submit form - custom permission akan dipush ke permission array
  const handleSubmit = (data: MenuFormData) => {
    const resource = getResourceFromPath(data.path);
    
    // Generate specific permissions dari template dan custom permissions
    const specificPermissions = generateSpecificPermissions(
      data.permissions,
      resource,
      data.userCustomPermissions
    );
  
    // Submit data dengan permissions yang sudah digabung (template + custom)
    const submitData: MenuFormData = {
      ...data,
      permissions: specificPermissions,
    };
  
    onSubmit(submitData);
    onClose();
  };

  // Filter menu items untuk parent selection (exclude current item dan children-nya)
  const availableParentMenus = menuItems.filter((item) => {
    if (isEditing && menuItem) {
      return item.id !== menuItem.id && !isChildOf(item, menuItem.id, menuItems);
    }
    return true;
  });

  // Helper function untuk check apakah item adalah child dari parent tertentu
  const isChildOf = (item: MenuItem, parentId: number, allItems: MenuItem[]): boolean => {
    if (item.parentId === parentId) return true;
    if (item.parentId) {
      const parent = allItems.find((i) => i.id === item.parentId);
      if (parent) {
        return isChildOf(parent, parentId, allItems);
      }
    }
    return false;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Menu' : 'Create New Menu'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Menu title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Path</FormLabel>
                    <FormControl>
                      <Input placeholder="/menu-path" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input placeholder="icon-name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Menu</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === "no-parent" ? undefined : value)} 
                    value={field.value || "no-parent"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent menu (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="no-parent">No Parent</SelectItem>
                      {availableParentMenus.map((menu) => (
                        <SelectItem key={menu.id} value={String(menu.id)}>
                          {menu.title}
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
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Visible</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Make this menu visible in navigation
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Template Permissions */}
            <div className="space-y-4">
              <FormLabel className="text-base font-semibold">Template Permissions</FormLabel>
              <FormField
                control={form.control}
                name="permissions"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-4">
                      {PERMISSION_TEMPLATES.map((permission) => (
                        <FormField
                          key={permission}
                          control={form.control}
                          name="permissions"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={permission}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(permission)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, permission])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== permission
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {permission.charAt(0).toUpperCase() + permission.slice(1)}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* User Custom Permissions */}
            <div className="space-y-4">
              <FormLabel className="text-base font-semibold">Custom Permissions</FormLabel>
              
              {/* Input untuk menambah custom permission */}
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom permission (e.g., upload file)"
                  value={customPermissionInput}
                  onChange={(e) => setCustomPermissionInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomPermission();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={addCustomPermission}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* List custom permissions yang sudah ditambahkan */}
              <FormField
                control={form.control}
                name="userCustomPermissions"
                render={({ field }) => (
                  <FormItem>
                    {field.value && field.value.length > 0 && (
                      <div className="space-y-2">
                        <FormLabel className="text-sm text-muted-foreground">
                          Added Custom Permissions:
                        </FormLabel>
                        <div className="space-y-2">
                          {field.value.map((permission, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-muted p-2 rounded"
                            >
                              <span className="text-sm">{permission}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCustomPermission(permission)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
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
  );
}