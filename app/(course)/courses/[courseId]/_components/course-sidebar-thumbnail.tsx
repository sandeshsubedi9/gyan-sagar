"use client";

import { useState } from "react";
import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

interface CourseSidebarThumbnailProps {
    imageUrl?: string | null;
    title: string;
    className?: string;
}

export const CourseSidebarThumbnail = ({ imageUrl, title, className }: CourseSidebarThumbnailProps) => {
    const [imageError, setImageError] = useState(false);
    const hasImage = !!imageUrl?.trim() && !imageError;

    return (
        <div
            className={cn(
                "relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white flex items-center justify-center",
                className
            )}
        >
            {hasImage ? (
                <Image
                    src={imageUrl!}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="40px"
                    onError={() => setImageError(true)}
                />
            ) : (
                <GraduationCap className="h-4 w-4 text-slate-500" strokeWidth={1.5} />
            )}
        </div>
    );
};
