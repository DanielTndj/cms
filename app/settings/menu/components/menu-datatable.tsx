"use client"

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MenuItem } from '../types/entities'
import { useMenuManagement } from '../hooks/useMenuManagement'
import { DataTable } from '@components/ui/data-table'
import { TableSkeleton } from '@components/ui/table-skeleton'
import { Button } from '@components/ui/button'
import { Badge } from '@components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { MoreHorizontal, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import MenuModal from './modals/MenuModal'


export function MenuDataTable() {
  const {
    menuItems,
    loading,
    selectedMenuItem,
    isModalOpen,
    setIsModalOpen,
    isEditing,
    handleDeleteMenuItem,
    openCreateModal,
    openEditModal,
    handleSubmit,
  } = useMenuManagement()

  const columns: ColumnDef<MenuItem>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "path",
      header: "Path",
      cell: ({ row }) => {
        const path = row.original.path
        return <code className="text-sm bg-muted px-2 py-1 rounded">{path}</code>
      },
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => {
        const icon = row.original.icon
        return <Badge variant="outline">{icon}</Badge>
      },
    },
    {
      accessorKey: "order",
      header: "Order",
      cell: ({ row }) => {
        const order = row.original.order
        return <Badge variant="secondary">{order}</Badge>
      },
    },
    {
      accessorKey: "isVisible",
      header: "Visibility",
      cell: ({ row }) => {
        const isVisible = row.original.isVisible
        return (
          <div className="flex items-center gap-2">
            {isVisible ? (
              <Eye className="h-4 w-4 text-green-600" />
            ) : (
              <EyeOff className="h-4 w-4 text-gray-400" />
            )}
            <span>{isVisible ? "Visible" : "Hidden"}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => {
        const permissions = row.original.permissions
        return (
          <div className="flex flex-wrap gap-1">
            {permissions.slice(0, 2).map((permission) => (
              <Badge key={permission} variant="secondary" className="text-xs">
                {permission}
              </Badge>
            ))}
            {permissions.length > 2 && (
              <Badge variant="secondary" className="text-xs">
                +{permissions.length - 2}
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const menuItem = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditModal(menuItem)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteMenuItem(menuItem.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (loading) {
    return <TableSkeleton columns={7} rows={5} />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Menu Item
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={menuItems}
        searchKey="title"
        searchPlaceholder="Search menu items..."
      />  
      <MenuModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSubmit={handleSubmit}  // Use the handleSubmit function from the hook
      menuItem={selectedMenuItem || undefined} 
      isEditing={isEditing}
      menuItems={menuItems}
    />
    </div>
  )
}