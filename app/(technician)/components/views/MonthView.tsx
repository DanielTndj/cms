"use client";

import { useState } from "react";
import { Button } from "@components/ui/button";
import { Plus, ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import { MonthViewProps } from "@technician/types";
import { PRIORITY_COLORS } from "@technician/constants/priority";
import { STATUS_COLORS } from "@technician/constants/status";
import { isSameDay } from "@technician/utils/technicianHelper";
import { useIsMobile } from "@hooks/use-mobile";
import { DayTasksPopover } from "../ui/DayTasksPopover";

export function MonthView({
  calendarDays,
  currentDate,
  selectedDate,
  setSelectedDate,
  getAssignmentsForDate,
  technicians,
  handleCreate,
  handleView,
  handleEdit, // Tambahkan prop ini jika belum ada
}: MonthViewProps) {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  const maxVisibleTasks = isMobile ? 2 : 3;
  
  return (
    <div className="grid grid-cols-7 gap-px bg-border">
      {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
        <div key={day} className={`bg-muted p-2 text-center text-sm font-medium ${
          isMobile ? 'text-xs p-1' : ''
        }`}>
          {day}
        </div>
      ))}
      {calendarDays.map((day, index) => {
        const dayKey = day.toISOString();
        const dayAssignments = getAssignmentsForDate(day);
        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
        const isToday = isSameDay(day, new Date());
        const isSelected = isSameDay(day, selectedDate);
        const isExpanded = expandedDays[dayKey] || false;
        const visibleAssignments = isExpanded ? dayAssignments : dayAssignments.slice(0, maxVisibleTasks);

        return (
          <DayTasksPopover
            key={index}
            date={day}
            assignments={dayAssignments}
            technicians={technicians}
            onCreateTask={handleCreate}
            onViewTask={handleView}
            onEditTask={handleEdit}
          >
            <div
              className={`bg-background p-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                !isCurrentMonth ? "text-muted-foreground" : ""
              } ${
                isMobile ? 'min-h-20 p-1' : 'min-h-32'
              }`}
              onClick={() => setSelectedDate(new Date(day))}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`text-sm font-medium ${
                    isToday
                      ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                      : isSelected
                      ? "bg-primary/20 rounded-full w-6 h-6 flex items-center justify-center"
                      : ""
                  } ${
                    isMobile ? 'text-xs w-5 h-5' : ''
                  }`}
                >
                  {day.getDate()}
                </div>
                {isSelected && !isMobile && (
                  <Button
                    size="sm"
                    className="h-5 w-5 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreate(new Date(day));
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className={`space-y-1 overflow-y-auto ${
                isMobile ? 'max-h-[60px]' : 'max-h-[120px]'
              }`}>
                {visibleAssignments.map((assignment) => {
                  const techniciansList = assignment.technicianIds
                    .map((id) => technicians.find(t => t.id === id)?.name)
                    .filter(Boolean)
                    .join(", ");

                  return (
                    <div
                      key={assignment.id}
                      className={`${
                        PRIORITY_COLORS[assignment.priority]
                      } text-white p-1 rounded cursor-pointer hover:opacity-80 ${
                        STATUS_COLORS[assignment.status]
                      } border-l-4 ${
                        isMobile ? 'text-xs p-0.5' : 'text-xs'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(assignment);
                      }}
                    >
                      {isMobile ? (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                          <div className="font-medium truncate text-xs">
                            {assignment.title}
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="font-medium truncate">
                            {assignment.title}
                          </div>
                          <div className="truncate opacity-90">{techniciansList}</div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {dayAssignments.length > maxVisibleTasks && (
                <button
                  className={`w-full mt-1 flex items-center justify-center text-muted-foreground hover:text-primary ${
                    isMobile ? 'text-xs' : 'text-xs'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isMobile) {
                      setExpandedDays(prev => ({
                        ...prev,
                        [dayKey]: !isExpanded
                      }));
                    }
                  }}
                >
                  {isMobile ? (
                    <>
                      <MoreHorizontal className="h-3 w-3 mr-1" />
                      +{dayAssignments.length - maxVisibleTasks}
                    </>
                  ) : isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Lebih sedikit
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      +{dayAssignments.length - maxVisibleTasks} lainnya
                    </>
                  )}
                </button>
              )}
            </div>
          </DayTasksPopover>
        );
      })}
    </div>
  );
}