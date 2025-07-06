"use client";

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AppSidebar } from "@components/layouts/sidebar/app-sidebar";
import { SiteHeader } from "@components/layouts/navbar/site-header";
import { SidebarInset, SidebarProvider } from "@components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { ArrowLeft, MapPin, Phone, User, Calendar, Wrench, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { serviceRequests } from '../data/mockData';
import { ServiceRequest } from '../types/entities';
import Image from 'next/image';

const statusConfig = {
  'perlu-penanganan-teknisi': {
    label: 'Perlu penanganan teknisi',
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-700'
  },
  'dalam-pekerjaan': {
    label: 'Dalam pekerjaan',
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700'
  },
  'dibatalkan': {
    label: 'Dibatalkan',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-700'
  },
  'selesai': {
    label: 'Selesai',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700'
  }
};

interface ImageSliderProps {
  images: string[];
  isOpen: boolean;
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

function ImageSlider({ images, isOpen, currentIndex, onClose, onNext, onPrev }: ImageSliderProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative max-w-4xl max-h-full p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
        >
          <X className="h-8 w-8" />
        </button>
        
        <div className="relative">
          <Image
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            width={800}
            height={600}
            className="max-w-full max-h-[80vh] object-contain"
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={onPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>
              
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
              
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
                {currentIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServiceRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const requestId = parseInt(params.id as string);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  
  const request = serviceRequests.find(r => r.id === requestId);
  
  if (!request) {
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
                <div className="px-4 lg:px-6">
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">Permintaan service tidak ditemukan.</p>
                      <Button onClick={() => router.back()} className="mt-4">
                        Kembali
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }
  
  const openImageSlider = (index: number) => {
    setCurrentImageIndex(index);
    setIsSliderOpen(true);
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === request.images!.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? request.images!.length - 1 : prev - 1
    );
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
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{request.title}</h1>
                    <Badge className={`${statusConfig[request.status].color} mt-1`}>
                      {statusConfig[request.status].label}
                    </Badge>
                  </div>
                </div>

                {/* Rest of the content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Content */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Problem Description */}
                    {request.description && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600 dark:text-red-400 text-sm">⚠️</span>
                            </div>
                            Masalah yang Dilaporkan
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground">{request.description}</p>
                        </CardContent>
                      </Card>
                    )}

                    {/* Customer & Location Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5" />
                          Customer & Lokasi
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-foreground">Customer</p>
                            <p className="text-muted-foreground">{request.customer}</p>
                          </div>
                          {request.contactPerson && (
                            <div>
                              <p className="font-medium text-foreground">PIC Lokasi</p>
                              <p className="text-muted-foreground">{request.contactPerson}</p>
                            </div>
                          )}
                        </div>
                        
                        {request.phoneNumber && (
                          <div>
                            <p className="font-medium text-foreground">No. Telp</p>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <p className="text-muted-foreground">{request.phoneNumber}</p>
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <p className="font-medium text-foreground">Alamat</p>
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                            <p className="text-muted-foreground">{request.location}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pump Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Wrench className="h-5 w-5" />
                          Ringkasan Pompa
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium text-foreground">Tipe Pompa</p>
                            <p className="text-muted-foreground">{request.pumpType}</p>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">Jenis Pompa</p>
                            <p className="text-muted-foreground">1</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <p className="font-medium text-foreground">Umur Pompa</p>
                          <p className="text-muted-foreground">2 Tahun, 3 Bulan</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Technical Readings */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Ringkasan Pompa</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-foreground">Pompa 1 / 2</h4>
                            <div className="flex gap-2">
                              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
                              <ChevronRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <p className="font-medium text-foreground">Isolasi (MΩ)</p>
                              <div className="grid grid-cols-3 gap-4 mt-2">
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">L1</p>
                                  <p className="text-lg font-semibold text-foreground">518</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">L2</p>
                                  <p className="text-lg font-semibold text-foreground">505</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">L3</p>
                                  <p className="text-lg font-semibold text-foreground">512</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <p className="font-medium text-foreground">Ampere (A)</p>
                              <div className="grid grid-cols-3 gap-4 mt-2">
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">L1</p>
                                  <p className="text-lg font-semibold text-foreground">14.8</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">L2</p>
                                  <p className="text-lg font-semibold text-foreground">14.9</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">L3</p>
                                  <p className="text-lg font-semibold text-foreground">14.7</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <p className="font-medium text-foreground">Voltage Standby (V)</p>
                              <div className="grid grid-cols-3 gap-4 mt-2">
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">L1</p>
                                  <p className="text-lg font-semibold text-foreground">380.1</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">L2</p>
                                  <p className="text-lg font-semibold text-foreground">381.5</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">L3</p>
                                  <p className="text-lg font-semibold text-foreground">380.9</p>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <p className="font-medium text-foreground">Voltage Standby (V)</p>
                              <div className="grid grid-cols-3 gap-4 mt-2">
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">L1</p>
                                  <p className="text-lg font-semibold text-foreground">378.2</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">L2</p>
                                  <p className="text-lg font-semibold text-foreground">379.1</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-muted-foreground">L3</p>
                                  <p className="text-lg font-semibold text-foreground">378.8</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sidebar */}
                  <div className="space-y-6">
                    {/* Service Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5" />
                          Informasi Permintaan Service
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="font-medium text-foreground">Dibuat Oleh</p>
                          <p className="text-muted-foreground">Tina (Sales)</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Tanggal Pelaksanaan Service</p>
                          <p className="text-muted-foreground">Sabtu, 25 Jul 2025</p>
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Rekomendasi Teknisi</p>
                          <p className="text-muted-foreground">{request.technicianRecommendation}</p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Images */}
                    {request.images && request.images.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Foto Dokumentasi</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-2">
                            {request.images.map((image, index) => (
                              <div 
                                key={index}
                                className="relative aspect-square cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => openImageSlider(index)}
                              >
                                <Image
                                  src={image}
                                  alt={`Documentation ${index + 1}`}
                                  fill
                                  className="object-cover rounded-lg"
                                />
                              </div>
                            ))}
                          </div>
                          {request.images.length > 4 && (
                            <p className="text-sm text-muted-foreground mt-2 text-center">
                              +{request.images.length - 4} foto lainnya
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <Button className="w-full" size="lg">
                        Edit Laporan Service
                      </Button>
                      <Button variant="outline" className="w-full" size="lg">
                        Tandai Selesai
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Image Slider Modal */}
                {request.images && (
                  <ImageSlider
                    images={request.images}
                    isOpen={isSliderOpen}
                    currentIndex={currentImageIndex}
                    onClose={() => setIsSliderOpen(false)}
                    onNext={nextImage}
                    onPrev={prevImage}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
      
      {/* Image Slider Modal */}
      {request.images && (
        <ImageSlider
          images={request.images}
          isOpen={isSliderOpen}
          currentIndex={currentImageIndex}
          onClose={() => setIsSliderOpen(false)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </SidebarProvider>
  );
}