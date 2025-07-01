"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wrench, User, Building, MapPin } from "lucide-react";
import { DayViewProps } from "@/features/technician/types";
import { PRIORITY_COLORS, PRIORITY_LABELS, STATUS_COLORS } from "@/features/technician/constants/technicianConstant";
import { formatDate } from "@/features/technician/utils/technicianHelper";

export function DayView({
  currentDate,
  getAssignmentsForDate,
  locations,
  technicians,
  handleView,
}: DayViewProps) {
  const dayAssignments = getAssignmentsForDate(currentDate);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="text-center">
          <h2 className="text-xl font-semibold">{formatDate(currentDate)}</h2>
          <p className="text-sm text-muted-foreground">
            {currentDate.toLocaleDateString("id-ID", { weekday: "long" })}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {dayAssignments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Tidak ada assignment hari ini</p>
          </div>
        ) : (
          dayAssignments.map((assignment) => {
            const location = locations.find(l => l.id === assignment.locationId);
            return (
              <Card
                key={assignment.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  STATUS_COLORS[assignment.status]
                } border-l-4`}
                onClick={() => handleView(assignment)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        PRIORITY_COLORS[assignment.priority]
                      } mt-1 flex-shrink-0`}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{assignment.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {assignment.description}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded text-white ${
                            PRIORITY_COLORS[assignment.priority]
                          }`}
                        >
                          {PRIORITY_LABELS[assignment.priority]}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="space-y-1">
                          {assignment.technicianIds.map((techId) => {
                            const tech = technicians.find(t => t.id === techId);
                            return tech ? (
                              <div
                                key={techId}
                                className="flex items-center gap-1"
                              >
                                <User className="h-4 w-4" />
                                <span>{tech.name}</span>
                              </div>
                            ) : null;
                          })}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            <span>{location?.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{location?.type}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}