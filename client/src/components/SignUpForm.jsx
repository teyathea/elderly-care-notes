import axios from "axios"
import { useReducer} from "react"
import { authReducer, initialState } from "../reducers/authReducer";
import { ACTION_TYPES } from "../action-types/actionTypes";

import '../styles/SignUpForm.css'

export default function SignUpForm({setIsLogin}) {
    const [state, dispatch] = useReducer(authReducer, initialState)
    const {fullname, signupEmail, signupPassword, confirmPassword, role} = state.signUpData;

        const API_REGISTER_URL = import.meta.env.VITE_REGISTER_URL; 
        // http://localhost:8000/api/mainusers/register

        const handleInputChange = (field, value) => {
            dispatch({type: ACTION_TYPES.SET_SIGNUP_FIELD, field, value})
        }
        
            const handleSignup = async () => {
                if (signupPassword !== confirmPassword) {
                    alert("Password don't match!")
                    return;
                }
                try {
                    const response = await axios.post(`${API_REGISTER_URL}`, {
                        fullname,
                        email: signupEmail,
                        password: signupPassword,
                        role,
                    });
                    console.log('Signup successful:', response.data);
                    setIsLogin(true);
                } catch (error) {
                    console.error('Signup error:', error.response?.data || error.message)
                }
            }

    const statusOptions = [
        "Family",
        "Caregiver"
    ]
    return(
        <>
        <div className="signupContainer">
            <h2 className="signupPageText">Signup Page</h2>
            <h3 className="elderlyCareText">Elderly Care ❤️</h3>
            <div className="mb-4">
              <label htmlFor="fullName">Full Name</label>
              <input type="text" id="fullName" value={fullname} onChange={(e) => handleInputChange("fullname", e.target.value)} placeholder="Full Name" />
            </div>
            <div className="mb-4">
              <label htmlFor="signupEmail">Email</label>
              <input type="email" id="signupEmail" value={signupEmail} onChange={(e) => handleInputChange("signupEmail",e.target.value)} placeholder="Email" />
            </div>
            <div className="mb-4">
              <label htmlFor="signupPassword">Password</label>
              <input type="password" id="signupPassword" value={signupPassword} onChange={(e) => handleInputChange("signupPassword",e.target.value)} placeholder="Password" />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => handleInputChange("confirmPassword",e.target.value)} placeholder="Confirm Password" />
            </div>
            <div className='mb-4'>
                <label htmlFor="role">Role</label>
                <select id="role" value={role} onChange={(e) => handleInputChange("role",e.target.value)} >

                    <option hidden>Select Role</option>
                        {statusOptions.map((status) => (
                            <option key={status} value={status}> {status} </option>
                        ))}

                </select>
            </div>
            <div className="mb-4 text-sm text-white text-center">
                Already have an account?{' '}
                    <button className="loginLink" onClick={() => setIsLogin(true)}>
                        login
                    </button>
            </div>
                <button onClick={handleSignup} className="signupButton">
                    SIGNUP
                </button>
            </div>
        </>
    )
}