import { cookies } from "next/headers";
import { NavbarRoutes } from "@/components/navbar-routes"
import { MobileSidebar } from "./Mobile-sidebar"
import { auth } from "@/auth"

export const Navbar = async () => {
    const session = await auth();
    const cookieStore = await cookies();
    const isAdminBypassed = cookieStore.get("admin_authorized")?.value === "true";

    return (
        <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
            <MobileSidebar />
            <NavbarRoutes user={session?.user} isAdminBypassed={isAdminBypassed} />
        </div>
    )
}