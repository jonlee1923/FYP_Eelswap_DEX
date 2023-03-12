import React from "react";
import { NavLink } from "react-router-dom";

export default function LandingPage() {
    return (
        <div>
            <section class="mb-40">
                <div class="text-center text-white py-24 px-6">
                    <h1 class="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-12">
                        Trade cryptocurrencies with Eelswap
                        <br />
                        <span class="text-green-600">for the best profits</span>
                    </h1>

                    <a
                        class="inline-block px-7 py-3 bg-green-600 text-blue-600 font-medium text-sm leading-snug uppercase rounded hover:text-black-700 hover:bg-green-100 focus:bg-gray-100 focus:outline-none focus:ring-0 active:bg-gray-200 transition duration-150 ease-in-out"
                        data-mdb-ripple="true"
                        data-mdb-ripple-color="light"
                        // href="#!"
                        role="button"
                    >
                        <NavLink
                            to="/pools"
                            className="py-1 my-2 text-black px-4  rounded-md"
                        >
                            Get Started Now!
                        </NavLink>
                    </a>
                </div>
            </section>
        </div>
    );
}
