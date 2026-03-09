"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Upload, X, Trash2 } from "lucide-react";

interface PropertyImageUploadProps {
    existingImages: string[];
    newImages: File[];
    onExistingRemove: (url: string) => void;
    onNewRemove: (index: number) => void;
    onNewAdd: (files: File[]) => void;
}

export function PropertyImageUpload({
    existingImages,
    newImages,
    onExistingRemove,
    onNewRemove,
    onNewAdd,
}: PropertyImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onNewAdd(Array.from(e.target.files));
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files) {
            onNewAdd(Array.from(e.dataTransfer.files));
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {/* Existing Images */}
                {existingImages.map((url) => (
                    <div key={url} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                        <Image src={url} alt="Property" fill className="object-cover" />
                        <button
                            type="button"
                            onClick={() => onExistingRemove(url)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}

                {/* New Image Previews */}
                {newImages.map((file, index) => {
                    const url = URL.createObjectURL(file);
                    return (
                        <div key={`${file.name}-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                            <Image src={url} alt="New Property" fill className="object-cover" />
                            <button
                                type="button"
                                onClick={() => onNewRemove(index)}
                                className="absolute top-2 right-2 p-1.5 bg-gray-800/80 text-white rounded-full shadow-md hover:bg-gray-900 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Upload Zone */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#0B2B4B] hover:bg-gray-50 transition-all"
            >
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-500" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">Drag and drop files here</p>
                    <p className="text-xs text-gray-500 mt-1">or click to browse</p>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/*"
                    className="hidden"
                />
            </div>
        </div>
    );
}
