import Image from "next/image"
import { SidebarMenu } from './sidebarmenu';
import { LuClipboardList } from "react-icons/lu";
import { BiArchiveIn } from "react-icons/bi";


const menuItems = [
    {
        path: '/dashboard/main',
        icon: <LuClipboardList size={35}/>,
        title: 'Dashboard'
    },
    {
        path: '/dashboard/supplier',
        icon: <BiArchiveIn size={35}/>,
        title: 'Proveedores'
    },
    {
        path: '/dashboard/ma',
        icon: <LuClipboardList size={35}/>,
        title: 'Ordenes'
    },
]

export const Sidebar = () => {
    return (
        <div id="menu"
            style={{ width: '500' }}
            className="bg-gray-900 min-h-screen z-10 text-slate-300 w-64 left-0 h-screen overflow-y-scroll">
            <div id="logo" className="my-4 px-6">
                <h1 className="text-lg md:text-4xl font-bold text-white">Dash<span className="text-blue-500">L&D</span>.</h1>
                <p className="text-slate-500 text">Sistema de ordenes de compra</p>
            </div>
            <div id="profile" className="px-6 py-10">
                <p className="text-slate-500">Bienvenidos a,</p>
                <a href="#" className="inline-flex space-x-2 items-center">
                    <span>
                        <Image className="rounded-full w-50 h-70" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2-arzmIWBpKnD7q-4y2EeSlIXjz4JuZezGA&s"
                            alt="User avatar"
                            width={100}
                            height={100}

                        />
                    </span>
                    <span className="text-sm md:text-base font-bold">
                        L&D Ingenieros
                    </span>
                </a>
            </div>

            <div id="nav" className="w-full px-6">


                {
                    menuItems.map(item => (
                        <SidebarMenu
                            key={item.path}
                            {...item}
                        />
                    ))
                }
            </div>
        </div>
    )
}
