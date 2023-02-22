import React from "react";

export default function LoadingSpinner() {
    return (
        <div class="my-8 flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        </div>
    );
}
