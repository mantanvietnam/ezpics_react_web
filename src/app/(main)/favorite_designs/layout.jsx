"use client"
import TabHeader from "@/components/ControlPanel/TabHeader";
import YourProductBanner from "@/components/YourProduct/YourProductBanner";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout(props) {
    const pathname = usePathname()
    const getTabClass = (path) =>
        `px-4 py-2 font-semibold border-b-2 ${pathname.includes(path) ? 'border-red-600 text-black' : 'border-transparent text-gray-500'
        }`;
    return (
        <div className='flex-col w-[90%]'>
            <div className='w-full pt-5'>
                <YourProductBanner />
            </div>
            <div className="pb-4">
                <div className='flex items-center gap-3'>
                    <Link href="/favorite_designs" className={getTabClass('/favorite_designs')}>
                        Thiết kế
                    </Link>
                </div>
            </div>
            {props.children}
        </div>
    )
}