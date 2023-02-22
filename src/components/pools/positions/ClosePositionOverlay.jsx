import React from "react";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import LoadingSpinner from "../../loading/LoadingSpinner";
import Settings from "../../settings/Settings";

export default function ClosePositionOverlay(props) {
    const [open, setOpen] = useState(true);
    const [supply, setSupply] = useState("");
    const [ownedSupply, setOwnedSupply] = useState("");
    const cancelButtonRef = useRef(null);

    const [showSettings, setShowSettings] = useState(false);
    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const handleSupplyChange = (event) => {
        setSupply(event.target);
    };

    const handleOwnedSupplyChange = (event) => {
        setOwnedSupply(event.target);
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={setOpen}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start justify-center">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900 text-center"
                                            >
                                                How much liquidity tokens would
                                                you like to remove?
                                            </Dialog.Title>
                                            <div className="pt-2 flex flex-row text-black justify-end">
                                                <button
                                                    onClick={toggleSettings}
                                                >
                                                    <svg
                                                        className="w-6 h-6"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>

                                            {props.loading ? (
                                                <LoadingSpinner />
                                            ) : (
                                                // <div className="shadow sm:overflow-hidden sm:rounded-md">
                                                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                                                    <div className="grid grid-cols-3 gap-6">
                                                        <div className="col-span-3 sm:col-span-2">
                                                            <label
                                                                htmlFor="company-website"
                                                                className="block text-sm font-medium text-gray-700"
                                                            >
                                                                Liquidity to
                                                                remove
                                                            </label>
                                                            <div className="mt-1 flex rounded-md shadow-sm flex-row w-full">
                                                                <input
                                                                    type="text"
                                                                    // name="company-website"
                                                                    // id="company-website"
                                                                    className="h-6 block w-full flex-1 rounded-none rounded-l focus:border-indigo-500 focus:ring-indigo-500 border-black  sm:text-sm"
                                                                    placeholder="e.g. 1000000"
                                                                    value={
                                                                        supply
                                                                    }
                                                                    onChange={
                                                                        handleSupplyChange
                                                                    }
                                                                />
                                                                <button className="h-6 bg-green-400 rounded-r text-sm px-1">
                                                                    MAX
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                // </div>
                                            )}
                                            {/* <div className='w-full text-center'>
                        <p>{props.message1}</p>
                      </div>

                      <div className='mt-2 w-full text-center text-gray-500'>
                        <p>{props.message2}</p>
                      </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 justify-center">
                                    {!props.loading && (
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                                            onClick={props.confirmAddToken}
                                        >
                                            confirm
                                        </button>
                                    )}
                                </div>
                                {showSettings && (
                                    <Settings
                                        show={showSettings}
                                        toggleShow={toggleSettings}
                                        // deadline={deadline}
                                        // slippage={slippage}
                                        // onDeadlineChange={onDeadlineChange}
                                        // onSlippageChange={onSlippageChange}
                                    />
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
}
