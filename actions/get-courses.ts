
import { Category, Course } from "@prisma/client";
import { z } from "zod";

import { getBatchProgress } from "@/actions/get-progress";
import { db } from "@/lib/db";


type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters:{id:string}[];
    progress: number | null;
}


type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
}


export const getCourses = async (
    {userId, title, categoryId}: GetCourses
): Promise<CourseWithProgressWithCategory[]> => {

    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                reviewStatus: {
                    notIn: ["FLAGGED", "REJECTED"]
                },
                title: {
                    contains: title,
                },
                categoryId,
            },
            include: {
                category: true,
                chapters: {
                    where: { isPublished: true },
                    select: { id: true },
                },
                purchases: {
                    where: { userId },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Collect only the purchased course IDs — only those need progress
        const purchasedCourseIds = courses
            .filter((c) => c.purchases.length > 0)
            .map((c) => c.id);

        // One batch call for all progress — eliminates N+1
        const progressMap = await getBatchProgress(userId, purchasedCourseIds);

        const coursesWithProgress: CourseWithProgressWithCategory[] = courses.map((course) => {
            if (course.purchases.length === 0) {
                return { ...course, progress: null };
            }
            return { ...course, progress: progressMap[course.id] ?? 0 };
        });

        return coursesWithProgress;

    } catch (error) {
        console.log("[GET_COURSES]", error);
        return [];
    }
}