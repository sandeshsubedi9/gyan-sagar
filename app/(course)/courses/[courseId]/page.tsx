import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { CourseEmptyState } from "./_components/course-empty-state";

const CourseIdPage = async (
    { params }: { params: Promise<{ courseId: string }> }
) => {
    const { courseId } = await params;

    const course = await db.course.findUnique({
        where: {
            id: courseId,
        },
        include: {
            chapters: {
                where: {
                    isPublished: true,
                },
                orderBy: {
                    position: "asc",
                },
            },
        },
    });

    if (!course) {
        notFound();
    }

    const firstChapter = course.chapters[0];

    if (!firstChapter) {
        return <CourseEmptyState title={course.title} />;
    }

    return redirect(`/courses/${course.id}/chapter/${firstChapter.id}`);
};

export default CourseIdPage;
