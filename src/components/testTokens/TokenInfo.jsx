import React from "react";

// import { PaperClipIcon } from '@heroicons/react/20/solid'

export default function TokenInfo(props) {
    return (
        <div className="mx-16 my-8 overflow-hidden bg-swapBlack shadow sm:rounded-lg text-white">
            <div className="">
                <dl>
                    <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium">
                            Token name
                        </dt>
                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                            {props.name}
                        </dd>
                    </div>
                    <div className=" px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium">
                            Token Address
                        </dt>
                        <dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
                            {props.address}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
