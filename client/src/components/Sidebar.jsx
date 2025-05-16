import { createContext, useContext, useState } from "react"
import { AlignJustify, ChevronDown, ChevronRight } from "lucide-react"
import { NavLink } from "react-router"

const SidebarContext = createContext()

export default function Sidebar({children}){
    const [expanded, setExpanded] = useState(true) 
    return(
        <>
        <aside className="h-screen">
            <nav className="h-full flex flex-col bg-blue-100 shadow-sm">
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

export function SidebarItem({to, text, icon, submenu = false, children}){
    const {expanded} = useContext(SidebarContext)
    const [isOpen, setIsOpen] = useState(false)

    if (submenu) {
        return (
            <li className="p-0 list-none">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-between gap-2 py-2 px-3 mx-1 my-1 rounded-md cursor-pointer transition-colors ${expanded ? "justify-between" : "justify-center"
                        } hover:bg-indigo-200 text-black-600`}
                >
                    <div className="flex items-center gap-2">
                        {icon}
                        {expanded && <span>{text}</span>}
                    </div>
                    {expanded &&
                        (isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
                </div>

                {isOpen && (
                    <ul className="pl-6 list-none">
                        {children}
                    </ul>
                )}
            </li>
        )
    }

    return (
        <>
        <NavLink 
            to={to}
            className={({ isActive }) =>
                `relative flex items-center gap-2 py-2 px-3 mx-1 my-1
                font-medium rounded-md cursor-pointer transition-colors
                ${
                    isActive
                        ? "bg-gradient-to-tr from-indigo-100 to-blue-400 text-indigo-800"
                        : "hover:bg-indigo-200 text-black-600"
                }
                ${expanded ? "justify-start" : "justify-center"}`
            }
        >
            {icon}
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