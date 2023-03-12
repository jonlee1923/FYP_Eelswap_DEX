import React, { useState, useEffect } from "react";

export default function LoadingSpinner(props) {
    const [height, setHeight] = useState();
    useEffect(() => {
        setHeight(props.height);
    }, []);

    return (
        <div class="flex justify-center items-center">
            <div
                class={`animate-spin rounded-full h-${props.height} w-${props.height} border-b-2 border-green-600`}
            ></div>
            {/* <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div> */}
        </div>
    );
}
