"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus, Wrench } from "lucide-react";
import { VIEW_TYPES } from "@/features/technician/constants/technicianConstant";
import { CalendarHeaderProps } from "../types";

export function CalendarHeader({
  view,
  setView,
  goToPrevious,
  goToNext,
  goToToday,
  getViewTitle,
  handleCreate,
}: CalendarHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Wrench className="h-5 w-5 md:h-6 md:w-6" />
          Technician Assignment
        </h1>
        <Button
          onClick={goToToday}
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex"
        >
          Hari Ini
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="min-w-32 text-center">
            <h2 className="text-sm md:text-base font-semibold">
              {getViewTitle()}
            </h2>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <Button
          onClick={goToToday}
          variant="outline"
          size="sm"
          className="sm:hidden"
        >
          Hari Ini
        </Button>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex border border-border rounded-md">
          <Button
            variant={view === VIEW_TYPES.DAY ? "default" : "ghost"}
            size="sm"
            onClick={() => setView(VIEW_TYPES.DAY)}
            className="rounded-r-none px-2 text-xs sm:text-sm"
          >
            Hari
          </Button>
          <Button
            variant={view === VIEW_TYPES.WEEK ? "default" : "ghost"}
            size="sm"
            onClick={() => setView(VIEW_TYPES.WEEK)}
            className="rounded-none border-x-0 px-2 text-xs sm:text-sm"
          >
            Minggu
          </Button>
          <Button
            variant={view === VIEW_TYPES.MONTH ? "default" : "ghost"}
            size="sm"
            onClick={() => setView(VIEW_TYPES.MONTH)}
            className="rounded-l-none px-2 text-xs sm:text-sm"
          >
            Bulan
          </Button>
        </div>

        <Button
          onClick={() => handleCreate(new Date())}
          size="sm"
          className="text-xs sm:text-sm"
        >
          <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
          Assign Teknisi
        </Button>
      </div>
    </div>
  );
}