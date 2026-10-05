import { useState, type SubmitEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import axios from "axios";

function Register() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        
        if (!name || !email || !password) {
            setError("Please fill in all fields.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        try{
            const response = await registerUser({
                name, 
                email, 
                password, 
                currency:"INR",
            });
            console.log("Registration successful:", response);
            navigate("/login");
        }catch(error){
            console.error("Registration failed: ", error);
            if(axios.isAxiosError(error)){
                setError(
                    error.response?.data?.detail ||
                    "Unable to create an account. Please try again."
                );
            }else{
                setError("Unable to create account. Please try again.")
            }
        }finally{
            setIsLoading(false);
        }
    };
    return (
    <div className="min-h-screen bg-slate-50">
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">
                        Create your account
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        Start managing your finances smarter.
                    </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}
                    
                    <div>
                        <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Full name
                        </label>
                        <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Enter your name"
                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Email address
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Enter your email"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Create a password"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-11 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />

                            <button
                            type="button"
                            onClick={() => setShowPassword((current) => !current)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-700"
                            aria-label={
                                showPassword ? "Hide password" : "Show password"
                            }
                            >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                            </button>
                        </div>
                    </div>
                    <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                    >
                        {isLoading? "Creating Account" : "Create Account"}
                    </button>
                </form>
                
                <p className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link
                    to="/login"
                    className="font-medium text-blue-700 hover:text-blue-800"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    </div>
    );
}

export default Register;

