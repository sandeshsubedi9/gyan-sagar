
import { db } from "@/lib/db";
import next from "next";

import { Attachment, Chapter, MuxData, UserProgress, Purchase } from "@prisma/client";

interface getChapterProps {
    userId:string;
    courseId:string;
    chapterId:string;
};


export const getChapter = async ({
    userId,
    courseId,
    chapterId
}: getChapterProps): Promise<{
    chapter: Chapter | null;
    course: { price: number | null } | null;
    muxData: MuxData | null;
    attachments: Attachment[];
    nextChapter: Chapter | null;
    userProgress: UserProgress | null;
    purchase: Purchase | null;
}> => {


    try {
        // Run first tier of independent queries in parallel
        const [purchase, course, chapter, userProgress] = await Promise.all([
            db.purchase.findUnique({
                where: {
                    userId_courseId: { userId, courseId }
                }
            }),
            db.course.findUnique({
                where: { isPublished: true, id: courseId },
                select: { price: true }
            }),
            db.chapter.findUnique({
                where: { id: chapterId, isPublished: true }
            }),
            db.userProgress.findUnique({
                where: {
                    userId_chapterId: { userId, chapterId }
                }
            })
        ]);

        if (!chapter || !course) {
            throw new Error("Chapter or course not found");
        };

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null;

        // Run second tier of conditional queries in parallel
        const tasks: Promise<any>[] = [];

        if (purchase) {
            tasks.push(
                db.attachment.findMany({ where: { courseId } })
                    .then(res => { attachments = res; })
            );
        }

        if (chapter.isFree || purchase) {
            tasks.push(
                db.muxData.findUnique({ where: { chapterId } })
                    .then(res => { muxData = res; })
            );
            tasks.push(
                db.chapter.findFirst({
                    where: {
                        courseId,
                        isPublished: true,
                        position: { gt: chapter.position }
                    },
                    orderBy: { position: "asc" }
                }).then(res => { nextChapter = res; })
            );
        }

        await Promise.all(tasks);

        return {
            chapter,
            course,
            muxData,
            attachments,
            nextChapter,
            userProgress,
            purchase,
        }


    } catch (error) {
        console.log("GET_CHAPTER_ERROR", error);
        return {
            chapter:null,
            course:null,
            muxData:null,
            attachments:[],
            nextChapter:null,
            // prevChapter:null,
            userProgress:null,
            purchase:null,

        }
    }
    
}