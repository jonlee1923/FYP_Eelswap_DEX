const styles = {
    boxWidth: "xl:max-w-[1280px] w-full",

    heading2:
        "font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
    paragraph:
        "font-poppins font-normal text-dimWhite text-[18px] leading-[30.8px]",

    flexCenter: "flex justify-center items-center",
    flexStart: "flex justify-center items-start",

    paddingX: "sm:px-16 px-6",
    paddingY: "sm:py-16 py-6",
    padding: "sm:px-16 px-6 sm:py-12 py-4",

    marginX: "sm:mx-16 mx-6",
    marginY: "sm:my-16 my-6",

    connectButton:
        "mr-4 bg-green-500 border-none outline-none p-6 py-2 font-poppins font-bold text-sm sm:text-lg text-white rounded-3xl leading-[24px] hover:bg-green-400 transition-all",

    amountContainer:
        "flex justify-between items-center flex-row w-full min-w-full bg-slate-800 border-[1px] border-transparent hover:border-slate-600 min-h-[96px] sm:p-8 p-4 rounded-[20px]",
    amountInput:
        "w-full flex-1 bg-transparent outline-none font-poppins font-black text-2xl text-white",
    tokenDropdown:
        "flex flex-row items-center bg-slate-600 py-2 px-4 rounded-xl font-poppins font-bold text-white",

    amountContainerPool:
        "m-2 flex justify-between items-center flex-row  bg-slate-800 border-[1px] border-transparent hover:border-slate-600 min-h-[90px] sm:p-8 rounded-[10px]",
    amountInputPool:
        "flex-1 bg-transparent outline-none font-poppins font-black text-white",
    tokenDropdownPool:
        "flex flex-row items-center bg-slate-600 py-2 px-4 rounded-xl font-poppins font-bold text-white",

    currencyButton:
        "flex flex-row items-center bg-site-dim2 py-2 px-4 rounded-xl font-poppins font-bold text-white",
    currencyList:
        "absolute z-10 right-0 bg-site-black border-[1px] border-t-0 border-site-dim2 w-full rounded-b-lg min-w-[170px] overflow-y-scroll overflow-hidden max-h-48",
    currencyListItem:
        "font-poppins font-medium text-base text-white hover:text-dim-white px-5 py-3 hover:bg-site-dim2 cursor-pointer",
    ETHStyle:
        "pb-24 w-screen h-full lg:h-screen bg-gradient-to-br from-green-400 via-black to-green-800 w-full overflow-y-scroll",
    BSCStyle:
        "pb-24 w-screen h-full lg:h-screen bg-gradient-to-br from-yellow-400 via-black to-yellow-800 w-full overflow-y-scroll",
    paymentList:
        "absolute z-10 right-0 bg-site-black border-[1px] border-t-0 border-site-dim2 w-full rounded-b-lg min-w-[170px] overflow-y-scroll overflow-hidden max-h-48",

    paymentListItem:
        "w-auto font-poppins font-medium text-base text-white hover:text-dim-white px-5 py-3 hover:bg-site-dim2 cursor-pointer",
};

export const layout = {
    section: `flex md:flex-row flex-col ${styles.paddingY}`,
    sectionReverse: `flex md:flex-row flex-col-reverse ${styles.paddingY}`,

    sectionImgReverse: `flex-1 flex ${styles.flexCenter} md:mr-10 mr-0 md:mt-0 mt-10 relative`,
    sectionImg: `flex-1 flex ${styles.flexCenter} md:ml-10 ml-0 md:mt-0 mt-10 relative`,

    sectionInfo: `flex-1 ${styles.flexStart} flex-col`,
};

export default styles;
