import { BookOpen } from "lucide-react";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { auth } from "@/lib/auth-helper";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { CourseSidebarItem } from "./course-sidebar-item";
import { CourseProgress } from "@/components/course-progress";
import { CourseSidebarThumbnail } from "./course-sidebar-thumbnail";

interface CourseSidebarProps {
    course: Course & {
        chapters : (Chapter & {
            userProgress: UserProgress[] | null;
        }) []
    };
    progressCount: number;
}

export const CourseSidebar = async ({course, progressCount}:CourseSidebarProps) => {

    const { userId } = await auth();


    if(!userId) {
        return redirect("/");
    }


    const purchase = await db.purchase.findUnique({
        where: {
            userId_courseId : {
                userId,
                courseId: course.id,
            }
        }
    });

    return (
        <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm">
            
            <div className="p-4 border-b bg-white">
                <div className="flex items-start gap-x-3">
                    <CourseSidebarThumbnail imageUrl={course.imageUrl} title={course.title} />
                    <div className="flex-1 min-w-0 pt-0.5">
                        <h1 className="font-semibold text-sm leading-snug text-slate-800 line-clamp-2 text-left">
                            {course.title}
                        </h1>
                        <p className="text-xs text-slate-500 mt-1 inline-flex items-center gap-x-1">
                            <BookOpen className="h-3 w-3 shrink-0" />
                            {course.chapters.length}{" "}
                            {course.chapters.length === 1 ? "Chapter" : "Chapters"}
                        </p>
                    </div>
                </div>
                {purchase && (
                    <div className="mt-3 w-full">
                        <CourseProgress
                            variant="success"
                            value={progressCount}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col w-full">
                {course.chapters.map((chapter) => (
                        <CourseSidebarItem
                            key={chapter.id}
                            id={chapter.id}                      
                            label={chapter.title}
                            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                            courseId={course.id}
                            isLocked={!chapter.isFree && !purchase}
                        />
                ))}
            </div>

        </div>
    )
}