import { Form } from "@inertiajs/react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
export default function Login() {
    const [error, setError] = useState({
        username: "",
        password: "",
        loginError: ""
    });
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (
            countdown === 0 &&
            error.loginError.includes("Too many login attempts")
        ) {
            setError((prev) => ({ ...prev, loginError: "" }));
        }
    }, [countdown, error]);

    return (
        <>
            <div className="grid min-h-svh lg:grid-cols-2">
                <div className="flex flex-col gap-4 p-6 ">
                    <div className="flex justify-center gap-2 md:justify-start">
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.7,
                                scale: {
                                    type: "spring",
                                    visualDuration: 0.4,
                                    bounce: 0.5,
                                },
                            }}
                        >
                            <div className="flex items-center gap-2 font-medium">
                                <div className=" flex size-6 items-center justify-center rounded-md">
                                    {/* <WalletCards
                                        className="size-4"
                                        color="black"
                                    /> */}
                                </div>
                                Invoice Tracker
                            </div>
                        </motion.div>
                    </div>
                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex flex-col gap-4 p-6 md:p-10  overflow-hidden">
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <div className=" w-[500px] flex items-center justify-center">
                                    <Form
                                        action="/login"
                                        method="post"
                                        onError={(error) => {
                                            setError(error);
                                            setCountdown(error.cooldownSeconds);
                                        }}
                                    >
                                        <div className="flex flex-col items-center gap-2 text-center ">
                                            <div className="flex  items-center justify-center rounded-md">
                                                {/* <img src="images/pmcLogo.jpg" className="w-20" /> */}
                                            </div>
                                            <h1 className="text-2xl font-bold">
                                                Welcome Back
                                            </h1>
                                            <span>Login your credentials</span>

                                            <div className="flex flex-col gap-y-4 w-full ">
                                                <fieldset className="fieldset">
                                                    <div className="flex justify-between">
                                                        <legend className="fieldset-legend text-left">
                                                            Username
                                                        </legend>
                                                        {error.username && (
                                                            <span className="text-red-500 text-xs mt-2.5">
                                                                {error.username}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="input w-96 "
                                                        placeholder="Type here"
                                                        name="username"
                                                        disabled={countdown > 0}
                                                    />
                                                </fieldset>
                                                <fieldset className="fieldset w-full">
                                                    <div className="flex justify-between">
                                                        <legend className="fieldset-legend text-left">
                                                            Password
                                                        </legend>
                                                        {error.password && (
                                                            <span className="text-red-500 text-xs mt-2.5">
                                                                {error.password}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="password"
                                                        className="input w-96"
                                                        placeholder="Type here"
                                                        name="password"
                                                        disabled={countdown > 0}
                                                    />
                                                </fieldset>
                                            </div>

                                            <div className="w-96 pt-8">
                                                <button className="cursor-pointer w-full btn btn-neutral" disabled={countdown > 0}>
                                                    {" "}
                                                    Login
                                                </button>
                                            </div>
                                        </div>
                                        {error.loginError && (
                                            <div className="mt-4 text-red-600 text-sm max-w-sm text-center">
                                                {countdown > 0
                                                    ? `${
                                                          error.loginError
                                                      } Please wait ${countdown} second${
                                                          countdown !== 1
                                                              ? "s"
                                                              : ""
                                                      } before trying again`
                                                    : error.loginError}
                                            </div>
                                        )}
                                    </Form>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
                <div className="bg-muted relative hidden lg:block">
                    <img
                        src="/images/Loginimage.png"
                        alt="Image"
                        className="absolute inset-0 h-full w-full object-cover "
                    />
                </div>
            </div>
        </>
    );
}
