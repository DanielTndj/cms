"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import SelectMultiple from "react-select";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@components/ui/select";
import { X, Wrench, Save, Trash2, Edit, User, Building, Calendar as CalendarIcon } from "lucide-react";
import { Assignment, AssignmentFormData, AssignmentModalProps } from "@technician/types";
import {  STATUS_LABELS, STATUS_COLORS } from "@technician/constants/status";
import {  PRIORITY_LABELS, PRIORITY_COLORS } from "@technician/constants/priority";
import { formatDate } from "@technician/utils/technicianHelper";

export function AssignmentModal({
  showModal,
  modalMode,
  selectedAssignment,
  formData,
  technicians,
  locations,
  technicianOptions,
  handleInputChange,
  handleSave,
  handleDelete,
  handleEdit,
  handleStatusChange,
  handleCloseModal,
}: AssignmentModalProps) {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              {modalMode === "create"
                ? "Assign Teknisi Baru"
                : modalMode === "edit"
                ? "Edit Assignment"
                : "Detail Assignment"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCloseModal}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {modalMode === "view" && selectedAssignment ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Teknisi
                  </label>
                  <div className="space-y-2 mt-1">
                    {selectedAssignment.technicianIds.map((techId) => {
                      const tech = technicians.find(t => t.id === techId);
                      return tech ? (
                        <div key={techId} className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <div>
                            <p className="font-medium">{tech.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {tech.skill}
                            </p>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Lokasi
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <Building className="h-4 w-4" />
                    <div>
                      <p className="font-medium">
                        {locations.find(l => l.id === selectedAssignment.locationId)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {locations.find(l => l.id === selectedAssignment.locationId)?.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Tugas
                </label>
                <h3 className="text-lg font-semibold mt-1">
                  {selectedAssignment.title}
                </h3>
                <p className="text-muted-foreground">
                  {selectedAssignment.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Tanggal
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <CalendarIcon className="h-4 w-4" />
                    <p>{formatDate(new Date(selectedAssignment.date))}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status & Prioritas
                  </label>
                  <div className="mt-1">
                    <div className="flex gap-2">
                      <select
                        value={selectedAssignment.status}
                        onChange={(e) =>
                          handleStatusChange(
                            selectedAssignment.id,
                            e.target.value as Assignment["status"]
                          )
                        }
                        className="px-2 py-1 text-xs border rounded"
                      >
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <span
                        className={`px-2 py-1 text-xs rounded text-white ${
                          PRIORITY_COLORS[selectedAssignment.priority]
                        }`}
                      >
                        {PRIORITY_LABELS[selectedAssignment.priority]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedAssignment.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Catatan
                  </label>
                  <p className="mt-1 p-2 bg-muted rounded">
                    {selectedAssignment.notes}
                  </p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(selectedAssignment.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Tutup
                  </Button>
                  <Button onClick={() => handleEdit(selectedAssignment)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Teknisi *</label>
                <SelectMultiple
                  isMulti
                  options={technicianOptions}
                  value={technicianOptions.filter((opt) =>
                    formData.technicianIds.includes(opt.value)
                  )}
                  onChange={(selected) => {
                    handleInputChange(
                      "technicianIds",
                      selected.map((opt) => opt.value)
                    );
                  }}
                  className="mt-1"
                  classNames={{
                    control: () => "!bg-card !border-border",
                    menu: () => "!bg-background !border-border",
                    option: () =>
                      "!bg-background !text-foreground hover:!bg-primary-foreground",
                    multiValue: () => "!bg-primary/10",
                    multiValueLabel: () => "!text-primary",
                    input: () => "!text-foreground",
                  }}
                  placeholder="Pilih teknisi..."
                  noOptionsMessage={() => "Tidak ada teknisi tersedia"}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Lokasi *</label>
                <Select
                  value={formData.locationId.toString()}
                  onValueChange={(value) =>
                    handleInputChange("locationId", Number(value))
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Pilih Lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id.toString()}>
                        {loc.name} - {loc.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Judul Tugas *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full mt-1 p-2 border border-border rounded-md"
                  placeholder="Contoh: Service pompa"
                  required
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full mt-1 p-2 border border-border rounded-md"
                  rows={3}
                  placeholder="Deskripsi detail tugas..."
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium">Tanggal</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      handleInputChange("date", e.target.value)
                    }
                    className="w-full mt-1 p-2 border border-border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Prioritas</label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    handleInputChange(
                      "priority",
                      value as Assignment["priority"]
                    )
                  }
                >
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="Pilih Prioritas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Rendah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="high">Tinggi</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Catatan</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="w-full mt-1 p-2 border border-border rounded-md"
                  rows={2}
                  placeholder="Catatan tambahan..."
                  autoComplete="off"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={handleCloseModal}>
                  Batal
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  {modalMode === "create"
                    ? "Buat Assignment"
                    : "Simpan Perubahan"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}