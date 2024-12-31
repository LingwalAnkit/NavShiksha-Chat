"use client";

import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BsGithub, BsGoogle } from "react-icons/bs";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import logo from "../../../../public/images/student-signup.png"

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const toggleVariant = useCallback(() => {
    setVariant(variant === "LOGIN" ? "REGISTER" : "LOGIN");
  }, [variant]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() => {
          toast.success("Registration successful! Please sign in.");
          toggleVariant();
        })
        .catch(() => toast.error("Something went wrong!"))
        .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: true,
        callbackUrl: "/users"
      })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials!");
        }
      })
      .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, {
      redirect: true,
      callbackUrl: "/users"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl py-12 px-12 shadow-2xl w-full max-w-5xl mx-auto">
      <div className="flex flex-row gap-8">
      <Image 
          src={logo} 
          alt="logo" 
          width={500}
          height={500}
          className="w-full md:w-1/2 bg-blue-300 h-auto object-cover rounded-3xl shadow-lg transition-transform duration-300 hover:scale-105"
      />
      <div className="flex flex-col gap-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
            {variant === "LOGIN" ? "Welcome Back" : "Create Account"}
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {variant === "REGISTER" && (
              <div className="flex gap-4">
                <div className="w-full">
                  <input
                    {...register("firstName", {
                      required: "First name is required",
                      minLength: {
                        value: 2,
                        message: "First name must be at least 2 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "First name cannot contain numbers",
                      },
                    })}
                    placeholder="First Name"
                    className={`w-full px-4 py-3 text-black rounded-lg border ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-gray-100`}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.firstName.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <input
                    {...register("lastName", {
                      required: "Last name is required",
                      minLength: {
                        value: 2,
                        message: "Last name must be at least 2 characters",
                      },
                      pattern: {
                        value: /^[A-Za-z]+$/,
                        message: "Last name cannot contain numbers",
                      },
                    })}
                    placeholder="Last Name"
                    className={`w-full px-4 py-3 text-black rounded-lg border ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-gray-100`}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lastName.message?.toString()}
                    </p>
                  )}
                </div>
              </div>
            )}

            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              placeholder="Email"
              type="email"
              className={`w-full px-4 py-3 text-black rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-gray-100`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message?.toString()}
              </p>
            )}

            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              placeholder="Password"
              type="password"
              className={`w-full px-4 py-3 text-black rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-gray-100`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message?.toString()}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Loading..."
                : variant === "LOGIN"
                ? "Sign in"
                : "Register"}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => socialAction("github")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-200"
            >
              <BsGithub />
              GitHub
            </button>
            <button
              onClick={() => socialAction("google")}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-gray-100 text-gray-700 font-semibold transition-all duration-200 hover:bg-gray-200"
            >
              <BsGoogle />
              Google
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <span>
              {variant === "LOGIN"
                ? "New to our platform? "
                : "Already have an account? "}
            </span>
            <button
              onClick={toggleVariant}
              className="underline text-blue-600 hover:text-blue-800"
            >
              {variant === "LOGIN" ? "Create an account" : "Login"}
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default AuthForm;
