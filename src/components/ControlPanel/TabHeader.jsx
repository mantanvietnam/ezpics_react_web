import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

const TabHeader = () => {
    const pathname = usePathname()
    const getTabClass = (path) =>
        `px-4 py-2 font-semibold border-b-2 ${pathname.includes(path) ? 'border-red-600 text-black' : 'border-transparent text-gray-500'
        }`;

    return (
        <div className="flex space-x-4" aria-label="Navigation Tabs">
            <Link href="/page-satisfied/your-design" className={getTabClass('/your-design')}>
                Thiết kế
            </Link>
            <Link href="/page-satisfied/portfolio" className={getTabClass('/portfolio')}>
                Portfolio
            </Link>
            <Link href="/page-satisfied/your-collection" className={getTabClass('/your-collection')}>
                Bộ sưu tập
            </Link>
        </div>
    )
}

export default TabHeader
