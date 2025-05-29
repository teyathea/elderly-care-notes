import { useReducer, createContext } from "react";

export const AuthContext = createContext()

export function AuthProvider({ children }){
    const [state, dispatch] = useReducer(authReducer, initialState) 

    useEffect(() => {
    const fetchApplications = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/mainusers/all-users`)
            console.log("Fetched applications:", response.data); //Check this
            
        } catch (error) {
            console.error("Error fetching applications from database", error)
        }
    }
    fetchApplications();
}, [])
}