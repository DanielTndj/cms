"use client";

import { Card, CardContent } from "@components/ui/card";
import { StatsCardsProps } from "@technician/types";

export function StatsCards({ assignments }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-4">
      <Card className="h-full">
        <CardContent className="p-2 sm:p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs sm:text-sm font-medium">Terjadwal</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold mt-1">
            {assignments.filter((a) => a.status === "scheduled").length}
          </p>
        </CardContent>
      </Card>
      <Card className="h-full">
        <CardContent className="p-2 sm:p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-500"></div>
            <span className="text-xs sm:text-sm font-medium">
              Berlangsung
            </span>
          </div>
          <p className="text-lg sm:text-2xl font-bold mt-1">
            {assignments.filter((a) => a.status === "in-progress").length}
          </p>
        </CardContent>
      </Card>
      <Card className="h-full">
        <CardContent className="p-2 sm:p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
            <span className="text-xs sm:text-sm font-medium">Selesai</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold mt-1">
            {assignments.filter((a) => a.status === "completed").length}
          </p>
        </CardContent>
      </Card>
      <Card className="h-full">
        <CardContent className="p-2 sm:p-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500"></div>
            <span className="text-xs sm:text-sm font-medium">Mendesak</span>
          </div>
          <p className="text-lg sm:text-2xl font-bold mt-1">
            {assignments.filter((a) => a.priority === "urgent").length}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}