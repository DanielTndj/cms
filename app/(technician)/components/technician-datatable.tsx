"use client"

import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Technician } from '../types/entities'
import { useTechnicianManagement } from '../hooks/useTechnicianManagement'
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
import { MoreHorizontal, Plus, Edit, Trash2, Phone } from 'lucide-react'
import { TechnicianModal } from './modals/TechnicianModal'

const TECHNICIAN_STATUS_COLORS = {
  available: "bg-green-100 text-green-800",
  busy: "bg-yellow-100 text-yellow-800",
  offline: "bg-gray-100 text-gray-800",
} as const

const TECHNICIAN_STATUS_LABELS = {
  available: "Tersedia",
  busy: "Sibuk",
  offline: "Offline",
} as const

export function TechnicianDataTable() {
  const {
    technicians,
    loading,
    selectedTechnician,
    isModalOpen,
    isEditing,
    openCreateModal,
    openEditModal,
    closeModal,
    handleDeleteTechnician,
    handleSubmit,
  } = useTechnicianManagement()

  const columns: ColumnDef<Technician>[] = [
    {
      accessorKey: "name",
      header: "Nama",
    },
    {
      accessorKey: "phone",
      header: "Telepon",
      cell: ({ row }) => {
        const phone = row.original.phone
        return (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            {phone}
          </div>
        )
      },
    },
    {
      accessorKey: "skill",
      header: "Keahlian",
      cell: ({ row }) => {
        const skill = row.original.skill
        return <Badge variant="outline">{skill}</Badge>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status as keyof typeof TECHNICIAN_STATUS_COLORS
        return (
          <Badge className={TECHNICIAN_STATUS_COLORS[status] || "bg-gray-100 text-gray-800"}>
            {TECHNICIAN_STATUS_LABELS[status] || status}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const technician = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEditModal(technician)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteTechnician(technician.id)}
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
    return <TableSkeleton columns={5} rows={5} />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Technician Management</h2>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Add Technician
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={technicians}
        searchKey="name"
        searchPlaceholder="Search technicians..."
      />

      <TechnicianModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        technician={selectedTechnician}
        isEditing={isEditing}
      />
    </div>
  )
}