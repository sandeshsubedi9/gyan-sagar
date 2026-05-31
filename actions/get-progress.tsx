import { db } from "@/lib/db";

export const getProgress = async (
    userId: string,
    courseId: string
): Promise<number> => {
    try {
        // Run both queries in parallel instead of sequentially
        const [publishedChapters, completedCount] = await Promise.all([
            db.chapter.findMany({
                where: { courseId, isPublished: true },
                select: { id: true },
            }),
            db.userProgress.count({
                where: {
                    userId,
                    isCompleted: true,
                    chapter: { courseId, isPublished: true },
                },
            }),
        ]);

        if (publishedChapters.length === 0) return 0;
        return (completedCount / publishedChapters.length) * 100;
    } catch (error) {
        console.log("[GET_PROGRESS]", error);
        return 0;
    }
};

/**
 * Batch version: calculates progress for MULTIPLE courses in 2 queries total.
 * Use this instead of calling getProgress() in a loop (N+1 killer).
 */
export const getBatchProgress = async (
    userId: string,
    courseIds: string[]
): Promise<Record<string, number>> => {
    if (courseIds.length === 0) return {};

    try {
        // Query 1: get all published chapter ids across all courses at once
        const [allChapters, allCompleted] = await Promise.all([
            db.chapter.findMany({
                where: { courseId: { in: courseIds }, isPublished: true },
                select: { id: true, courseId: true },
            }),
            db.userProgress.findMany({
                where: {
                    userId,
                    isCompleted: true,
                    chapter: { courseId: { in: courseIds }, isPublished: true },
                },
                select: { chapterId: true, chapter: { select: { courseId: true } } },
            }),
        ]);

        // Build lookup maps in JS — zero extra DB calls
        const chapterCountByCourse: Record<string, number> = {};
        for (const ch of allChapters) {
            chapterCountByCourse[ch.courseId] = (chapterCountByCourse[ch.courseId] ?? 0) + 1;
        }

        const completedCountByCourse: Record<string, number> = {};
        for (const up of allCompleted) {
            const cid = up.chapter.courseId;
            completedCountByCourse[cid] = (completedCountByCourse[cid] ?? 0) + 1;
        }

        const result: Record<string, number> = {};
        for (const courseId of courseIds) {
            const total = chapterCountByCourse[courseId] ?? 0;
            const completed = completedCountByCourse[courseId] ?? 0;
            result[courseId] = total === 0 ? 0 : (completed / total) * 100;
        }
        return result;
    } catch (error) {
        console.log("[GET_BATCH_PROGRESS]", error);
        return {};
    }
};