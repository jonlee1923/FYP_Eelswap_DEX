// import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import ConnectButton from "./ConnectButton";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import ActiveChain from "./ActiveChain";

// function classNames(...classes) {
//     return classes.filter(Boolean).join(" ");
// }

export default function Navbar(props) {
    return (
        <Disclosure as="nav" className="bg-gray-800">
            {({ open }) => (
                <>
                    <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                        <div className="relative flex h-16 items-center justify-between">
                            {/* Mobile menu button*/}

                            {/* <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                    <span className="sr-only">
                                        Open main menu
                                    </span>
                                    {open ? (
                                        <XMarkIcon
                                            className="block h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Bars3Icon
                                            className="block h-6 w-6"
                                            aria-hidden="true"
                                        />
                                    )}
                                </Disclosure.Button>
                            </div> */}
                            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                                <div className="flex flex-shrink-0 items-center">
                                    <img
                                        className="block h-8 w-auto lg:hidden"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=500"
                                        alt="Your Company"
                                    />
                                    <img
                                        className="hidden h-8 w-auto lg:block"
                                        src="https://tailwindui.com/img/logos/mark.svg?color=green&shade=500"
                                        alt="Your Company"
                                    />
                                </div>
                                <div className="hidden sm:ml-6 sm:block">
                                    <div className="flex space-x-4">
                                        <NavLink
                                            to="/getTokens"
                                            className="py-1 my-2 text-white px-4 hover:bg-green-500 rounded-md"
                                        >
                                            Get Test tokens
                                        </NavLink>
                                        <NavLink
                                            to="/swap"
                                            className="py-1 my-2 text-white px-4 hover:bg-green-500 rounded-md"
                                        >
                                            Swap
                                        </NavLink>
                                        <NavLink
                                            to="/pools"
                                            className="py-1 my-2 text-white px-4 hover:bg-green-500 rounded-md"
                                        >
                                            Pools
                                        </NavLink>
                                        <NavLink
                                            to="/paymentLink"
                                            className="py-1 my-2 text-white px-4 hover:bg-green-500 rounded-md"
                                        >
                                            Payment
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute space-x-16 inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                <ActiveChain
                                    activeChain={props.activeChain}
                                    setActiveChain={props.setActiveChain}
                                />
                                <ConnectButton />
                            </div>
                        </div>
                    </div>

                    <Disclosure.Panel className="sm:hidden">
                        <div className="space-y-1 px-2 pt-2 pb-3">
                            <NavLink to="/" className="text-white px-4">
                                Swap
                            </NavLink>
                            <NavLink to="/pools" className="text-white pr-4">
                                Pools
                            </NavLink>
                        </div>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
}
