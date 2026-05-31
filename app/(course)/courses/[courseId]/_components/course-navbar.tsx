import { cookies } from "next/headers";
import { auth } from "@/auth";
import { NavbarRoutes } from "@/components/navbar-routes";
import { Chapter, Course, UserProgress } from "@prisma/client"
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
    course: Course & {
         chapters: (Chapter & {
            userProgress : UserProgress[] | null;
         } )[]
    };
    progressCount:number;
};

export const CourseNavbar = async ({
    course,progressCount
} : CourseNavbarProps) =>{
    const session = await auth();
    const cookieStore = await cookies();
    const isAdminBypassed = cookieStore.get("admin_authorized")?.value === "true";

    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">

            <CourseMobileSidebar
            course={course}
            progressCount = {progressCount}
            />
            <NavbarRoutes user={session?.user} isAdminBypassed={isAdminBypassed} />
        </div>
    )
}