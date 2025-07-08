"use client";

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { AppSidebar } from "@components/layouts/sidebar/app-sidebar";
import { SiteHeader } from "@components/layouts/navbar/site-header";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Search, Filter, Plus, Calendar, MapPin, User, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';
import { serviceRequests } from './data/mockData';
import { ServiceRequest } from './types/entities';

const statusConfig = {
    'perlu-penugasan-teknisi': {
        label: 'Perlu penugasan teknisi',
        color: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800'
    },
    'dalam-pengerjaan': {
        label: 'Dalam pengerjaan',
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'
    },
    'dibatalkan': {
        label: 'Dibatalkan',
        color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
    },
    'selesai': {
        label: 'Selesai',
        color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800'
    }
};

const priorityConfig = {
    'low': { label: 'Rendah', color: 'bg-muted text-muted-foreground' },
    'medium': { label: 'Sedang', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' },
    'high': { label: 'Tinggi', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300' },
    'urgent': { label: 'Mendesak', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' }
};

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 50, 100];
const DEFAULT_ITEMS_PER_PAGE = 6;

export default function PumpMaintenancePage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [priorityFilter, setPriorityFilter] = useState<string>('all');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

    const { filteredRequests, paginatedRequests, totalPages, stats } = useMemo(() => {
        const filtered = serviceRequests.filter(request => {
            const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                request.customer.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
            const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;

            return matchesSearch && matchesStatus && matchesPriority;
        });

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginated = filtered.slice(startIndex, endIndex);
        const totalPages = Math.ceil(filtered.length / itemsPerPage);

        const stats = serviceRequests.reduce((acc, request) => {
            acc[request.status] = (acc[request.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            filteredRequests: filtered,
            paginatedRequests: paginated,
            totalPages,
            stats: {
                total: serviceRequests.length,
                pending: stats['perlu-penugasan-teknisi'] || 0,
                inProgress: stats['dalam-pengerjaan'] || 0,
                completed: stats['selesai'] || 0,
                cancelled: stats['dibatalkan'] || 0
            }
        };
    }, [searchTerm, statusFilter, priorityFilter, currentPage, itemsPerPage]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, statusFilter, priorityFilter, itemsPerPage]);

    const handleCardClick = (requestId: number) => {
        router.push(`/pump-maintenance/${requestId}`);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const startPage = Math.max(1, currentPage - 2);
            const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties}
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            <div className="px-4 lg:px-6 space-y-6">
                                {/* Header */}
                                <div className="mb-6">
                                    <h1 className="text-3xl font-bold text-foreground">Pump Maintenance</h1>
                                    <p className="text-muted-foreground mt-1">Kelola permintaan service dan maintenance pompa</p>
                                </div>

                                {/* Statistics Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Total Request</p>
                                                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                                                </div>
                                                <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                    <Wrench className="h-4 w-4 text-primary" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Perlu Penanganan</p>
                                                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{stats.pending}</p>
                                                </div>
                                                <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/30 rounded-full flex items-center justify-center">
                                                    <Calendar className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Dalam Pekerjaan</p>
                                                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.inProgress}</p>
                                                </div>
                                                <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                                    <User className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Selesai</p>
                                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
                                                </div>
                                                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                                    <Calendar className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Dibatalkan</p>
                                                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.cancelled}</p>
                                                </div>
                                                <div className="h-8 w-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                                                    <Calendar className="h-4 w-4 text-red-600 dark:text-red-400" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="flex-1">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <Input
                                                        placeholder="Cari berdasarkan judul atau customer..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>

                                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                                <SelectTrigger className="w-full md:w-48">
                                                    <SelectValue placeholder="Filter Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua Status</SelectItem>
                                                    <SelectItem value="perlu-penugasan-teknisi">Perlu Penanganan</SelectItem>
                                                    <SelectItem value="dalam-pengerjaan">Dalam Pekerjaan</SelectItem>
                                                    <SelectItem value="selesai">Selesai</SelectItem>
                                                    <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                                <SelectTrigger className="w-full md:w-48">
                                                    <SelectValue placeholder="Filter Prioritas" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Semua Prioritas</SelectItem>
                                                    <SelectItem value="low">Rendah</SelectItem>
                                                    <SelectItem value="medium">Sedang</SelectItem>
                                                    <SelectItem value="high">Tinggi</SelectItem>
                                                    <SelectItem value="urgent">Mendesak</SelectItem>
                                                </SelectContent>
                                            </Select>

                                            <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
                                                <SelectTrigger className="w-full md:w-32">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {ITEMS_PER_PAGE_OPTIONS.map(option => (
                                                        <SelectItem key={option} value={option.toString()}>
                                                            {option} per halaman
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Results Info */}
                                        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                                            <span>
                                                Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredRequests.length)} dari {filteredRequests.length} hasil
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Service Request Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {paginatedRequests.map((request) => (
                                        <Card
                                            key={request.id}
                                            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-primary hover:bg-muted/50"
                                            onClick={() => handleCardClick(request.id)}
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <CardTitle className="text-lg font-semibold text-foreground mb-2">
                                                            {request.title}
                                                        </CardTitle>
                                                        <Badge
                                                            className={`${statusConfig[request.status].color} text-xs font-medium px-2 py-1`}
                                                        >
                                                            {statusConfig[request.status].label}
                                                        </Badge>
                                                    </div>
                                                    <Badge
                                                        className={`${priorityConfig[request.priority].color} text-xs ml-2`}
                                                    >
                                                        {priorityConfig[request.priority].label}
                                                    </Badge>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="pt-0">
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="font-medium text-foreground">Tipe Service:</p>
                                                            <p className="text-muted-foreground">{request.serviceType}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground">Tanggal Kerja:</p>
                                                            <p className="text-muted-foreground">{request.workDate}</p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div>
                                                            <p className="font-medium text-foreground">Tipe pompa:</p>
                                                            <p className="text-muted-foreground">{request.pumpType}</p>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground">Rekomendasi Teknisi:</p>
                                                            <p className="text-muted-foreground">{request.technicianRecommendation}</p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="truncate">{request.customer}</span>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>Tanggal permintaan: {request.requestDate}</span>
                                                    </div>

                                                    {request.images && request.images.length > 0 && (
                                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                            <span>📷 {request.images.length} foto</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-4 pt-3 border-t">
                                                    <Button
                                                        className="w-full"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCardClick(request.id);
                                                        }}
                                                    >
                                                        Tugaskan Teknisi
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {paginatedRequests.length === 0 && (
                                    <Card>
                                        <CardContent className="p-8 text-center">
                                            <p className="text-gray-500">Tidak ada permintaan service yang ditemukan.</p>
                                        </CardContent>
                                    </Card>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <Card>
                                        <CardContent className="p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        disabled={currentPage === 1}
                                                    >
                                                        <ChevronLeft className="h-4 w-4" />
                                                        Sebelumnya
                                                    </Button>

                                                    <div className="flex items-center gap-1">
                                                        {generatePageNumbers().map((page) => (
                                                            <Button
                                                                key={page}
                                                                variant={currentPage === page ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => handlePageChange(page)}
                                                                className="w-10"
                                                            >
                                                                {page}
                                                            </Button>
                                                        ))}
                                                    </div>

                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        disabled={currentPage === totalPages}
                                                    >
                                                        Selanjutnya
                                                        <ChevronRight className="h-4 w-4" />
                                                    </Button>
                                                </div>

                                                <span className="text-sm text-muted-foreground">
                                                    Halaman {currentPage} dari {totalPages}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}