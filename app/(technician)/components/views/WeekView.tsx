"use client";

import { useState } from "react";
import { WeekViewProps } from "@technician/types";
import { STATUS_COLORS } from "@technician/constants/status";
import { PRIORITY_COLORS } from "@technician/constants/priority";
import { isSameDay } from "@technician/utils/technicianHelper";
import { useIsMobile } from "@hooks/use-mobile";
import { DayTasksPopover } from "../ui/DayTasksPopover"; // Gunakan komponen yang sama
import { MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";

export function WeekView({
  calendarDays,
  getAssignmentsForDate,
  technicians,
  handleView,
}: WeekViewProps) {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const isMobile = useIsMobile();
  
  // Mobile: show max 3 tasks, Desktop: show all tasks
  const maxVisibleTasks = isMobile ? 3 : 10;

  return (
    <div className="flex flex-col">
      {/* Header dengan nama hari dan tanggal */}
      <div className="grid grid-cols-7 gap-px bg-border mb-px">
        {calendarDays.map((day, index) => {
          const isToday = isSameDay(day, new Date());
          return (
            <div key={index} className={`bg-muted p-2 text-center ${
              isMobile ? 'p-1' : ''
            }`}>
              <div className={`text-muted-foreground ${
                isMobile ? 'text-xs' : 'text-xs'
              }`}>
                {day.toLocaleDateString("id-ID", { weekday: "short" })}
              </div>
              <div
                className={`font-medium ${
                  isToday
                    ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto"
                    : ""
                } ${
                  isMobile ? 'text-sm w-5 h-5' : 'text-sm'
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Grid konten dengan tasks */}
      <div className="grid grid-cols-7 gap-px bg-border flex-1">
        {calendarDays.map((day, index) => {
          const dayKey = day.toISOString();
          const dayAssignments = getAssignmentsForDate(day);
          const isExpanded = expandedDays[dayKey] || false;
          const visibleAssignments = isExpanded ? dayAssignments : dayAssignments.slice(0, maxVisibleTasks);

          return (
            <DayTasksPopover
              key={index}
              date={day}
              assignments={dayAssignments}
              technicians={technicians}
              onViewTask={handleView}
            >
              <div className={`bg-background p-2 cursor-pointer hover:bg-muted/50 transition-colors ${
                isMobile ? 'min-h-32 p-1' : 'min-h-96'
              }`}>
                <div className={`space-y-1 overflow-y-auto ${
                  isMobile ? 'max-h-28' : 'max-h-80'
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
                        } text-white rounded cursor-pointer hover:opacity-80 ${
                          STATUS_COLORS[assignment.status]
                        } border-l-4 ${
                          isMobile ? 'text-xs p-1' : 'text-xs p-2'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(assignment);
                        }}
                      >
                        {isMobile ? (
                          // Mobile: Compact view dengan dots
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                            <div className="font-medium truncate text-xs">
                              {assignment.title}
                            </div>
                          </div>
                        ) : (
                          // Desktop: Full view
                          <>
                            <div className="font-medium">{assignment.title}</div>
                            <div className="truncate">{techniciansList}</div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Show more/less button */}
                {dayAssignments.length > maxVisibleTasks && (
                  <button
                    className={`w-full mt-1 flex items-center justify-center text-muted-foreground hover:text-primary ${
                      isMobile ? 'text-xs' : 'text-xs'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isMobile) {
                        // On mobile, clicking opens the popover instead of expanding
                        // The popover will handle showing all tasks
                      } else {
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
    </div>
  );
}