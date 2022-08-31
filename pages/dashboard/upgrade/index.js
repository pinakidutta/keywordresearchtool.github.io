import DashLayout from "../../../Layouts/dashLayout";
import React, { useEffect } from "react";
import { VscTriangleRight } from "react-icons/vsc";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { BsCreditCard } from "react-icons/bs";
import axios from "axios";

import { PayPalButton } from "react-paypal-button-v2";
import { getSession } from "next-auth/react";



function Upgrade() {


    const [section, setSection] = React.useState("Subscription");  // This holds the current section of the page
    const [currentMembership, setCurrentMembership] = React.useState(""); // This holds the current membership showed in the page
    const [currentUserMembership, setCurrentUserMembership] = React.useState(""); /// this hold user membership
    const [currentUserMembershipEnds, setCurrentUserMembershipEnds] = React.useState(""); /// this hold user membership ends
    const [duration, setDuration] = React.useState("1 Month");    // This holds the duration of the subscription
    const [monthPrice, setMonthPrice] = React.useState("10");
    const [yearPrice, setYearPrice] = React.useState("100");
    const [halfyearPrice, setHalfyearPrice] = React.useState("50");
    const [paypalClientKey, setPaypalClientKey] = React.useState(undefined);


    // left sections 
    const leftSections = [
        {
            name: "Subscription",
        },
        {
            name: "Billing info",
        },
        ,
        {
            name: "Validation",
        }
    ]

    // set selected membership
    const setSelectedMembership = (membership) => {


        if (membership === "Basic" && currentUserMembership === "Pro") {
            alert("You can't downgrade your membership");
            return;

        }
        setCurrentMembership(membership);
    }

    // set duration 
    const setDurationSelected = (duration) => {
        setDuration(duration);
    }
    // when this page laods we need to get the user dat

    React.useEffect(() => {
        // get user data
        axios.post( process.env.NEXT_PUBLIC_PROD_URL +"/api/admin/user/return", {}, { withCredentials: true }).then(res => {
            setCurrentUserMembership(res.data.membership);
            setCurrentUserMembershipEnds(res.data.subscriptionEnds);
            setCurrentMembership(res.data.membership);
        }
        )
            .catch(err => {
                console.log(err);
            }
            )
        /// get the prices
        axios.post( process.env.NEXT_PUBLIC_PROD_URL +"/api/pay/prices", {}, { withCredentials: true }).then(res => {
            setMonthPrice(res.data.proprice);
            setYearPrice(res.data.propriceyear);
            setHalfyearPrice(res.data.propricehalfyear);

             // get paypal client key
         axios.post( process.env.NEXT_PUBLIC_PROD_URL +"/api/pay/ppkey", {}, { withCredentials: true }).then(res => {
            setPaypalClientKey(res.data.paypalkey);
        }
        )
        }
        )

    }, [])


    

    // handle stripe click 

    const handleStripeClick = () => {


        // check duration set
        if (duration === "") {
            alert("Please select a duration");
            return;
        }


        axios.post( process.env.NEXT_PUBLIC_PROD_URL +"/api/pay/stripe", {

            duration: duration,
            price: duration == "1 Month" ? monthPrice : duration == "6 Months" ? halfyearPrice : yearPrice,
        }, { withCredentials: true }).then(res => {

            if (res.data) {
                window.location = res.data.url
            }
        }
        ).catch(err => {
            console.log(err);
        }
        )
    }


    return (
        <DashLayout>
            <div className="bg-color-dashboard-bg flex flex-1 w-full md:p-7  flex-col">
                {/* {currentUserMembership + ' ' + currentUserMembershipEnds} */}
                {/* Head */}
                <div className=" md:p-0 p-4">
                    <h1 className="font-semibold text-3xl py-3">Upgrade</h1>
                    <p>Upgrade your account to a better plan.</p>
                </div>
                {/* Body */}
                <div className="bg-white  flex py-5 px-4 mt-10 rounded-md shadow-md w-[90%] mx-auto ">
                 

                    {/* Right side */}
                    <div className="flex-grow flex py-5 px-4 ">
                        {/* Subscription */}
                        {section === "Subscription" && <div className="w-full">
                            {/* Subtitle  */}
                            <div>
                                <span className=" font-semibold">Duration</span>
                                <p className="text-xs text-gray-400">Select the duration you want for your subscription.</p>
                            </div>

                            {/* Durations */}
                            <div className="flex my-4 cl">
                                <ul className="flex space-x-2">
                                    <li ><a onClick={() => setDurationSelected('1 Month')} className={`border-2  px-3 py-2 cursor-pointer ${duration === `1 Month` && `border-[#4DADF8]`} rounded-md text-sm font-semibold`}>1 Month</a></li>
                                    <li><a onClick={() => setDurationSelected('6 Months')} className={`border-2  px-3 py-2 cursor-pointer ${duration === `6 Months` && `border-[#4DADF8]`} rounded-md text-sm font-semibold`}    >6 Months</a></li>
                                    <li><a onClick={() => setDurationSelected('1 Year')} className={`border-2  px-3 py-2 cursor-pointer ${duration === `1 Year` && `border-[#4DADF8]`} rounded-md text-sm font-semibold`}>1 Year</a></li>

                                </ul>
                            </div>

                            {/* Subtitle  */}
                            <div>
                                <span className=" font-semibold">Plan</span>
                                <p className="text-xs text-gray-400">Select your prefered plan.</p>

                            </div>
                            {/* Methode */}
                            <div className="flex justify-around space-x-2">
                                {/* Item */}
                                <div onClick={() => setSelectedMembership('Basic')} className={`flex cursor-pointer relative flex-col z-20 w-[90%] border-2 rounded-md ${currentMembership === `Basic` && `border-[#4DADF8]`} p-3  my-3`}>
                                    {/* Incase of selected we show check mark */}
                                    {currentMembership === `Basic` && <div className="absolute top-[-25px] z-50 right-0 m-3">
                                        <div className="w-fit h-fit bg-white rounded-full">
                                            <IoIosCheckmarkCircle className="text-[#4DADF8] text-2xl" />
                                        </div>
                                    </div>}

                                    {/* Item-top */}
                                    <div className="my-1">
                                        <div className="flex justify-between">
                                            <div className="flex flex-col">
                                                <span className="font-semibold">Basic</span>
                                                <span className="text-xs text-gray-400">Free for ever</span>
                                            </div>
                                            {/* Itemp price */}
                                            <div className="font-semibold text-lg">
                                                0$/ <span className="text-sm font-normal">month</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-4">
                                        {currentUserMembership === "Basic" &&
                                            <a className="border text-xs font-semibold rounded-md text-[#4DADF8] px-3 py-2 " href="">Current</a>
                                        }
                                    </div>
                                </div>
                                {/* Item */}
                                <div onClick={() => setSelectedMembership('Pro')} className={`flex cursor-pointer relative flex-col z-20   w-[90%]  border-2 rounded-md ${currentMembership === `Pro` && `border-[#4DADF8]`} p-3  my-3`}>
                                    {/* Incase of selected we show check mark */}
                                    {currentMembership === `Pro` && <div className="absolute top-[-25px] z-50 right-0 m-3">
                                        <div className="w-fit h-fit bg-white rounded-full">
                                            <IoIosCheckmarkCircle className="text-[#4DADF8] text-2xl" />
                                        </div>
                                    </div>}

                                    {/* Item-top */}
                                    <div className="my-1">
                                        <div className="flex justify-between">
                                            <div className="flex flex-col">
                                                <span className="font-semibold">Pro</span>
                                                {currentUserMembership === 'Pro' ?
                                                    <span className="text-xs text-gray-400">Subscription ends : {currentUserMembershipEnds}.</span>
                                                    :
                                                    <span className="text-xs text-gray-400">{duration === '1 Month' ? '30 days' : duration === '6 Months' ? '180 days' : duration === '1 Year' ? '365 days' : 'Select a duration'} </span>

                                                }
                                            </div>
                                            {/* Itemp price */}
                                            <div className="font-semibold text-lg">
                                                {duration === '1 Month' ? monthPrice : duration === "6 Months" ? halfyearPrice : duration === '1 Year' && yearPrice}$/ <span className="text-sm font-normal">month</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="my-4">
                                        {currentUserMembership === "Basic" &&
                                            <a className="border text-xs font-semibold rounded-md text-[#4DADF8] px-3 py-2 " href="">Select</a>
                                        }
                                        {currentUserMembership === "Pro" &&
                                            <a className="border text-xs font-semibold rounded-md text-[#4DADF8] px-3 py-2 " href="">Active</a>
                                        }
                                    </div>
                                </div>

                            </div>
                            {/* Subtitle  */}
                            <div>
                                <span className=" font-semibold">Payment Method</span>
                                <p className="text-xs text-gray-400">Select your prefered payment method.</p>

                            </div>

                            {/* Check out buttons */}
                            <div className="w-[50%]">
                                <div>
                                    <a onClick={() => handleStripeClick()}><div className="flex justify-center items-center h-[50px] border-2 cursor-pointer  rounded-md my-3  font-semibold"> <BsCreditCard className="mx-2" />  Pay with card</div></a>
                                </div>
                                <div>

                                    {/*  Paypal button */}

                           { paypalClientKey && 
                                    <PayPalButton
                                    amount={duration === '1 Month' ? monthPrice : duration === "6 Months" ? halfyearPrice : duration === '1 Year' && yearPrice}	
                                    // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                    onSuccess={(details, data) => {
                                     alert("Transaction completed by " + details.payer.name.given_name);
                                     // here we add the subscription to the current user

                                     axios.post( process.env.NEXT_PUBLIC_PROD_URL +'/api/pay/ppVerify',{d:duration},{withCredentials:true}).then(res=>{
                                        console.log(res.data)
                                    }
                                    ).catch(err=>{
                                        console.log(err)
                                    }
                                    )


                                    }}
                                    options={{
                                        clientId:  paypalClientKey,
                                        disableFunding: "card",
                                    }}
                                />
                           }
                                </div>
                            </div>
                        </div>}

                    </div>
                </div>
            </div>
        </DashLayout>
    )
}


export async function getServerSideProps(context) {
    const session = await getSession(context)

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }
    }


    return {
        props: { session }
    }
}


export default Upgrade