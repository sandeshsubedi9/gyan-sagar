import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseEmptyStateProps {
    title: string;
}

export const CourseEmptyState = ({ title }: CourseEmptyStateProps) => {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <BookOpen className="h-12 w-12 text-slate-400 mb-4" strokeWidth={1.5} />
            <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
                This course has no published chapters yet. Check back later.
            </p>
            <Button variant="outline" asChild className="mt-6">
                <Link href="/dashboard/search">Browse other courses</Link>
            </Button>
        </div>
    );
};
