import Link from "next/link";
import { BookX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CourseNotFound() {
    return (
        <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <BookX className="h-12 w-12 text-slate-400 mb-4" strokeWidth={1.5} />
            <h1 className="text-2xl font-semibold text-slate-800">Course not found</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
                This course does not exist, was removed, or is not available.
            </p>
            <Button asChild className="mt-6">
                <Link href="/dashboard/search">Browse courses</Link>
            </Button>
        </div>
    );
}
