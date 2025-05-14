import { createContext, useContext, useState } from "react"
import { AlignJustify } from "lucide-react"
import { NavLink } from "react-router"

const SidebarContext = createContext()

export default function Sidebar({children}){
    const [expanded, setExpanded] = useState(true) 
    return(
        <>
        <aside className="h-screen">
            <nav className="h-full flex flex-col bg-white shadow-sm">
                <div className={`p-4 pb-2 flex bg-gradient-to-tr from-indigo-100 to-blue-400
                    ${expanded ? "justify-end" : "justify-center"}`}>
                    <div onClick={() => setExpanded(curr => !curr)} className="burger-icon cursor-pointer hover:bg-indigo-200 p-2">
                        <AlignJustify />  {/*Burger Menu* */}
                    </div>
                </div>

                <SidebarContext.Provider value={{ expanded }}>
                    {children}
                </SidebarContext.Provider>

            </nav>
        </aside>
    </>
    )
}

export function SidebarItem({to, text}){
    const {expanded} = useContext(SidebarContext)
    return (
        <>
        <NavLink 
            to={to}
            className={({ isActive }) =>
                `relative flex items-center gap-2 py-2 px-3 mx-1 my-1
                font-medium rounded-md cursor-pointer transition-colors
                ${
                    isActive
                        ? "bg-gradient-to-tr from-indigo-100 to-blue-400 text-green-800"
                        : "hover:bg-indigo-200 text-gray-600"
                }
                ${expanded ? "justify-start" : "justify-center"}`
            }
        >
            {/* {icon} */}
            <span
                className={`overflow-hidden transition-all
                ${expanded ? "w-52" : "w-0"}`}
            >
                {text}
            </span>
        </NavLink>
        </>
    )
}