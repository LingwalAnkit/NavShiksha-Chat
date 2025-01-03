"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import toast from "react-hot-toast";
import { BsGithub, BsGoogle } from "react-icons/bs";
import LoadingModal from "../../components/modals/LoadingModal";
import AuthSocialButton from "./AuthSocialButton";
import logo from "../../../../public/images/student-signup.png"

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Variant>("LOGIN");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FieldValues>({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    useEffect(() => {
        if (session?.status === "authenticated") {
            router.push("/conversations");
        }
    }, [session?.status, router]);

    const toggleVariant = useCallback(() => {
        setVariant((prev) => prev === "LOGIN" ? "REGISTER" : "LOGIN");
        setError("");
    }, []);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);
        setError("");

        if (variant === "REGISTER") {
            axios.post("/api/register", data)
                .then(() => signIn("credentials", data))
                .catch(() => setError("Something went wrong!"))
                .finally(() => setIsLoading(false));
        }

        if (variant === "LOGIN") {
            signIn("credentials", {
                ...data,
                redirect: false,
            })
                .then((callback) => {
                    if (callback?.error) {
                        setError("Invalid credentials!");
                        return;
                    }
                    if (callback?.ok) {
                        toast.success("Logged in successfully");
                        router.push("/conversations");
                    }
                })
                .finally(() => setIsLoading(false));
        }
    };

    const socialAction = (action: string) => {
        setIsLoading(true);
        setError("");

        signIn(action, { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    setError("Invalid credentials!");
                    return;
                }
                if (callback?.ok) {
                    toast.success("Logged in successfully");
                }
            })
            .finally(() => setIsLoading(false));
    };

    return (
        <>
            {session?.status === "loading" && <LoadingModal />}
            <form onSubmit={handleSubmit(onSubmit)} className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
                <div className="flex flex-col md:flex-row gap-8 items-center justify-center bg-white dark:bg-dusk rounded-3xl py-12 px-12 shadow-2xl w-full max-w-5xl mx-auto transition-all duration-300 hover:shadow-xl">
                    <Image 
                        src={logo} 
                        alt="Messenger Logo" 
                        width={500}
                        height={500}
                        className="w-full md:w-1/2 bg-blue-300 dark:bg-gray-700 h-auto object-cover rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105"
                    />
                    <div className="flex flex-col gap-6 w-full md:w-1/2 max-w-md">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                            {variant === "LOGIN" ? "Welcome Back" : "Create Account"}
                        </h1>
                        
                        {error && (
                            <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 p-3 rounded-lg text-center">
                                {error}
                            </div>
                        )}

                        {variant === "REGISTER" && (
                            <div>
                                <input
                                    {...register("name", { required: true })}
                                    type="text"
                                    placeholder="Name"
                                    className={`w-full px-4 py-3 text-black dark:text-white rounded-lg border ${
                                        errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700`}
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">Name is required</p>
                                )}
                            </div>
                        )}

                        <div>
                            <input
                                {...register("email", { required: true })}
                                type="email"
                                placeholder="Email"
                                className={`w-full px-4 py-3 text-black dark:text-white rounded-lg border ${
                                    errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700`}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">Email is required</p>
                            )}
                        </div>

                        <div>
                            <input
                                {...register("password", { required: true })}
                                type="password"
                                placeholder="Password"
                                className={`w-full px-4 py-3 text-black dark:text-white rounded-lg border ${
                                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700`}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">Password is required</p>
                            )}
                        </div>

                        <button 
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Loading...' : (variant === "LOGIN" ? "Sign In" : "Sign Up")}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="bg-white dark:bg-dusk px-2 text-gray-500 dark:text-gray-400">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <AuthSocialButton
                                icon={BsGithub}
                                onClick={() => socialAction("github")}
                                // className="w-full"
                            />
                            <AuthSocialButton
                                icon={BsGoogle}
                                onClick={() => socialAction("google")}
                                // className="w-full"
                            />
                        </div>

                        <button 
                            type="button" 
                            onClick={toggleVariant}
                            className="w-full py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                        >
                            {variant === "LOGIN" ? "Create an account" : "Already have an account?"}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default AuthForm;
