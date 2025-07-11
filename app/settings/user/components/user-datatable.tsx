"use client"

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { User } from '../types/entities'
import { useUserManagement } from '../hooks/useUserManagement'
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
import { MoreHorizontal, Plus, Edit, Trash2 } from 'lucide-react'
import { USER_STATUS_COLORS, USER_STATUS_LABELS, USER_ROLES } from '@constants/user'
import { UserModal } from '@settings/user/components/modals/UserModal'

export function UserDataTable() {
  const {
    users,
    loading,
    selectedUser,
    isModalOpen,
    isEditing,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    openCreateModal,
    openEditModal,
    closeModal, 
  } = useUserManagement()

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role
        return <Badge variant="outline">{USER_ROLES[role]}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge className={USER_STATUS_COLORS[status]}>
            {USER_STATUS_LABELS[status]}
          </Badge>
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
        const user = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditModal(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteUser(user.id)}
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
    return <TableSkeleton columns={6} rows={5} />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={users}
        searchKey="name"
        searchPlaceholder="Search users..."
      />
      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal} 
        onSubmit={isEditing ? 
          (data) => handleUpdateUser(selectedUser!.id, data) : 
          handleCreateUser
        }
        user={selectedUser}
        isEditing={isEditing}
      />
    </div>
  )
}