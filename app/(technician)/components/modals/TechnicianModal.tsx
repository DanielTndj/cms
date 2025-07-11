"use client"

import React from 'react'
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
import { Technician } from '../../types/entities'
import { TechnicianFormData } from '../../hooks/useTechnicianManagement'

const technicianSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  phone: z.string().min(1, 'Nomor telepon harus diisi'),
  skill: z.string().min(1, 'Keahlian harus diisi'),
  status: z.string().min(1, 'Status harus dipilih'),
})

interface TechnicianModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TechnicianFormData) => Promise<void>
  technician?: Technician | null
  isEditing: boolean
}

const TECHNICIAN_SKILLS = [
  'Electrical',
  'Plumbing',
  'HVAC',
  'Mechanical',
  'Electronics',
  'General Maintenance'
]

const TECHNICIAN_STATUSES = [
  { value: 'available', label: 'Tersedia' },
  { value: 'busy', label: 'Sibuk' },
  { value: 'offline', label: 'Offline' }
]

export function TechnicianModal({
  isOpen,
  onClose,
  onSubmit,
  technician,
  isEditing
}: TechnicianModalProps) {
  const form = useForm<TechnicianFormData>({
    resolver: zodResolver(technicianSchema),
    defaultValues: {
      name: technician?.name || '',
      phone: technician?.phone || '',
      skill: technician?.skill || '',
      status: technician?.status || 'available',
    },
  })

  React.useEffect(() => {
    if (technician && isEditing) {
      form.reset({
        name: technician.name,
        phone: technician.phone,
        skill: technician.skill,
        status: technician.status,
      })
    } else {
      form.reset({
        name: '',
        phone: '',
        skill: '',
        status: 'available',
      })
    }
  }, [technician, isEditing, form])

  const handleSubmit = async (data: TechnicianFormData) => {
    await onSubmit(data)
    form.reset()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Technician' : 'Add New Technician'}
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
                    <Input placeholder="Masukkan nama technician" {...field} />
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
                  <FormLabel>Nomor Telepon</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan nomor telepon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skill"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keahlian</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih keahlian" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TECHNICIAN_SKILLS.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TECHNICIAN_STATUSES.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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