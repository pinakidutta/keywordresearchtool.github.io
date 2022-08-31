import { useState } from "react";
import DashLayout from "../../../Layouts/dashLayout";
import SearchHistory from "../../../components/SearchHistory";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { BsQuestionCircle } from 'react-icons/bs';
import { useForm } from "react-hook-form";
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { AiOutlineSearch } from 'react-icons/ai';
import { paginate, checkStringLength } from "../../../utils";
import { BsFillStarFill } from 'react-icons/bs'
import { connect } from "react-redux";
import {setToast,setToastTitle,setToastMessage,setToastType} from "../../../redux/actions/initsActions";
import { getSession } from "next-auth/react";

  function HistoryPage({setToast,setToastTitle,setToastMessage,setToastType}) {

    const router = useRouter();
    const { keywordParam, result } = router.query;
    const [fetchedKeywords, setFetchedKeywords] = useState([]);
    const [selectedDifficulty, setSelectedDifficulty] = useState(0);
    const [lastLookupPage, setLastLookupPage] = useState(1);
    const [keyword, setKeyword] = useState('Fetching ...');

    // array that hold the lookups on search result
    const [searchResult, setSearchResult] = useState([]);
    // form hook
    const { register, handleSubmit, formState: { errors } } = useForm();


    // remove dash from string and add space
    // first charachter needs to be upper case

    function changeDashToSpace(str) {
        return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // handle keyword  search form submit using react hook form
    const onKeywordSearch = data => {
        console.log(data);
        // check if there is any lookup that contains the keyphrase
        const lookups = fetchedKeywords.filter(lookup => lookup.keyword.toLowerCase().includes(data.searchPhrase.toLowerCase()));

        // if there is any lookup that contains the keyphrase
        if (lookups.length > 0) {
            // set the search result to the lookups
            setSearchResult(lookups);
            // set the page number to 1
            setLastLookupPage(1);
        }
        else {
            // if there is no lookup that contains the keyphrase
            // set the search result to empty array
            setSearchResult([]);
            setToastType('danger');
            setToastTitle('No lookups!');
            setToastMessage('No lookups found');
            setToast(true)
            // after 3sconds set toast to false (hidden)
            setTimeout(() => {
                setToast(false)
            }
                , 3000);
            
        }

        // if search pharse is empry
        // we cleare searchresult state
        if (data.searchPhrase === "") {
            setSearchResult([]);
        }

    };


    // handle next page of last lookups
    function handleNextPage() {
        if (lastLookupPage < fetchedKeywords.length / 5) {
            setLastLookupPage(lastLookupPage + 1);
        }
    }

      // handle previous page of last lookups
      function handlePreviousPage() {
        if (lastLookupPage > 1) {
            setLastLookupPage(lastLookupPage - 1);
        }
    }


    useEffect(() => {
        keywordParam &&
            axios.post( process.env.NEXT_PUBLIC_PROD_URL +"/api/operations/history/getone", { historyId: changeDashToSpace(keywordParam[0]) }, { withCredentials: true })
                .then(res => {
                    console.log(res.data);
                    setSelectedDifficulty(res.data.history.result[0].difficulty);
                    setFetchedKeywords(res.data.history.result);
                    setKeyword(res.data.history.keyword);
                    console.log('monthly in history', res.data.history.result[0].monthly)
                }
                )
                .catch(err => {
                    
                    setToastType('danger');
                        setToastTitle('Error!');
                        setToastMessage('Error fetching history');
                        setToast(true)
                        // after 3sconds set toast to false (hidden)
                        setTimeout(() => {
                            setToast(false)
                        }
                            , 3000);
                }
                )

    }, [keywordParam]);


    const data = [

        {

            "uv": 100,
            "pv": 4567,
            "fill": "#f0f0f0"
        },
        {
            "uv": selectedDifficulty,
            "pv": 4567,
            "fill": selectedDifficulty > 80 ? "#e74c3c" : selectedDifficulty > 60 ? "#f1530f" : selectedDifficulty > 40 ? "#f1c40f" : "#2ecc71"
        }

    ]


       // handle favourite click

       const handleFavouriteClick = (id) => {





        // get the item from the array
        const item = fetchedKeywords.find(item => item.id === id);
        // check if the item is already favourited

        if (item.favourited) {
            // if it is already favourited
            // we remove it from the array
            // remove from favourites
            axios.post( process.env.NEXT_PUBLIC_PROD_URL +'/api/operations/favourites/remove', { keyword: item },{withCredentials:true}).then(res => {
                if (res.status === 200) {

                    item.favourited = false;

                    const index = fetchedKeywords.findIndex(item => item.id === id);
                    let temp = fetchedKeywords;
                    temp[index] = item;

                    setFetchedKeywords([...temp]);

                }
            }).catch((err) => {
                if (err.response) {
                    setToastType('danger');
                    setToastTitle('Error!');
                    setToastMessage(err.response.data.message);
                    setToast(true)
                    // after 3sconds set toast to false (hidden)
                    setTimeout(() => {
                        setToast(false)
                    }
                        , 3000);
                }
            }
            );
            return true
        }

        // if it is not favourited
        // we set the item to favourited
        item.favourited = true;
        // we search for the item in state and set it to favourited
        const index = fetchedKeywords.findIndex(item => item.id === id);
        let temp = fetchedKeywords;
        temp[index] = item;

        // we set the state to the new array with the favourited keyword
        setFetchedKeywords([...temp]);

        axios.post( process.env.NEXT_PUBLIC_PROD_URL +'/api/operations/favourites/create', { keyword: item },{withCredentials:true}).then(res => {

            if (res.status === 200) {
                setToastType('success');
                setToastTitle('Success!');
                setToastMessage(res.data.message);
                setToast(true)
                // after 3sconds set toast to false (hidden)
                setTimeout(() => {
                    setToast(false)
                }
                    , 3000);
            }
        }).catch((err) => {
            if (err.response) {

                setToastType('danger');
                setToastTitle('Error!');
                setToastMessage(err.response.data.message);
                setToast(true)
                // after 3sconds set toast to false (hidden)
                setTimeout(() => {
                    setToast(false)
                }
                    , 3000);

            }
        }
        );






    }


    return (
        <DashLayout>
            <div className="bg-color-dashboard-bg flex flex-1 w-full md:p-7 p-2  flex-col">
                {/* Head */}
                <div className="flex flex-col">
                    <span className="font-semibold text-xs text-text-primary-color">KEYWORD</span>
                    <p className="text-3xl font-semibold my-3">{keyword}</p>
                </div>
                {/* Result Head */}

                <div className="  flex md:flex-row flex-col w-full mt-4 gap-10">
                    {/* Difficulty circle progress bar */}
                    <div className="bg-white md:w-96  w-full h-56 flex flex-col justify-start items-center border border-border-color-light ">
                        <div className="flex flex-col">

                        </div>
                        {/* difficulty top */}
                        <div className="flex px-4 py-2 w-full">

                            <Tooltip className="ml-auto" title="difficulty of ranking in the first top-10 organic results for a keyword
indicates the chance of getting in top-10 organic results for a keyword on a logarithmic scale from 0 to 100">
                                <IconButton >
                                    <BsQuestionCircle className=" w-4 h-4" />
                                </IconButton>
                            </Tooltip>

                        </div>
                        <ResponsiveContainer width="50%" height="30%">
                            <RadialBarChart startAngle={0} cx="50%" cy="50%" innerRadius="80%" outerRadius="80%" barSize={17} data={data}>
                                <RadialBar
                                    minAngle={15}
                                    background
                                    clockWise
                                    dataKey="uv"
                                />

                            </RadialBarChart>
                        </ResponsiveContainer>
                        {/* Difficulty tyoe */}
                        {fetchedKeywords.length > 0 && <div className="flex flex-col text-center">
                            <span className="text-xl font-bold">{selectedDifficulty}<span className="font-normal text-xs">/100</span>  </span>
                            <span className="font-semibold">
                                {selectedDifficulty > 80
                                    ? "VERY HARD"
                                    : selectedDifficulty > 60

                                        ? "HARD"

                                        : selectedDifficulty > 40
                                            ? "POSSIBLE " : selectedDifficulty > 20
                                                ? "STILL EASY" : "VERY EASY"

                                }
                            </span>
                            <span className="text-sm text-title-color-muted">Keyword Difficulty</span>
                        </div>}

                    </div>

                    {/* Search history */}

                    <div className="bg-white flex-grow h-56  flex border border-border-color-light overflow-hidden ">
                        {/* Search History */}
                        {fetchedKeywords.length > 0 ? <SearchHistory type="history" data={fetchedKeywords.length > 0 ? fetchedKeywords[0].monthly : fetchedKeywords} /> :

                            <div className="flex  w-full md:m-4 m-0  border-2 rounded-md p-2 ">
                                <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                                <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md">

                                    </div>
                                </div>
                                <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                                <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md">

                                    </div>
                                </div>
                                <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                                <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md">

                                    </div>
                                </div>
                                <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                                <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md">

                                    </div>
                                </div>
                                <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                                <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md">

                                    </div>
                                </div>
                                <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                                <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md">

                                    </div>
                                </div>
                                <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                                <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md">

                                    </div>
                                </div>

                                <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                                <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md">

                                    </div>
                                </div>

                                <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                                <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md">

                                    </div>
                                </div>

                                <div className=" flex w-8 mx-10 h-[90%] flex-col items-stretch">
                                <div className="md:w-full w-2 animate-pulse mt-4 h-8 flex-grow bg-gray-300 rounded-md">

                                    </div>
                                </div>
                            </div>

                        }
                    </div>



                </div>
                {/* Table of keywords returned */}
                <div className="  w-full bg-white p-5 border border-border-color-light mt-10 ">

                    <div className="flex items-center pb-4 ">
                        <h3 className="text-base text-title-color-muted font-semibold m-0 p-0">Result</h3>
                        {/* Search form */}
                        <form className="mx-10 h-full flex items-center " onSubmit={handleSubmit(onKeywordSearch)}>
                            <input {...register('keywordPhrase')} placeholder="Search for keyword " className="border rounded-tl-md rounded-bl-md outline-none py-1 text-sm pl-3 border-r-0 h-full" {...register('searchPhrase')} />
                            <button className="border rounded-tr-md rounded-br-md border-l-0 text-xl m-0 hover:bg-gray-50 cursor-pointer py-1 h-full w-[40px] flex justify-center items-center">
                                <AiOutlineSearch />
                            </button>

                        </form>
                        {/* End of search form */}
                    </div>


                    <div className="w-full overflow-x-scroll">

                    <table className="table-auto  w-full  ">
                        <thead className="bg-table-head-bg">
                            <tr className=" font-semibold">
                                {/* <th className="px-4 py-2 font-semibold text-left ">Select</th> */}

                                <th className="px-4 py-2 font-semibold  text-left">Keyword</th>
                                <th className="px-4 py-2 font-semibold">Volume</th>
                                <th className="px-4 py-2 font-semibold">Competition</th>
                                <th className="px-4 py-2 font-semibold">Difficulty</th>
                                <th className="px-4 py-2 font-semibold">CPC</th>
                            </tr>
                        </thead>
                        <tbody className="w-full  ">
                            {fetchedKeywords.length > 0 &&
                                // show only 1 lookup per page 

                                paginate(searchResult.length == 0 ? fetchedKeywords : searchResult, 20, searchResult.length == 0 ? lastLookupPage : 1).map((lookup, index) => (
                                    <tr key={index} className='text-sm border-b bg-gray-50 hover:bg-gray-50 font-semibold '>
                                        {/* check box input */}
                                        {/* <td className=" px-4 py-4">
<input onChange={() => handleCheckboxClick(lookup)} type="checkbox" checked={lookup.selected} className="form-checkbox" />
</td> */}
                                        <td className=" px-4 py-4 flex items-center min-w-[300px]">
                                            {/* Set as favourite */}
                                            <BsFillStarFill onClick={() => handleFavouriteClick(lookup.id)} className={`mr-1 text-[#D6D7D7] hover:text-[#FFCC77] cursor-pointer ${lookup.favourited ? 'text-[#FFCC77]' : ''}`} />
                                            {lookup.keyword}
                                        </td>
                                        <td className=" px-4 py-4 text-center">{lookup.volume.search_volume}</td>
                                        <td className=" px-4 py-4 text-center">{lookup.competition}</td>
                                        <td className=" px-4 py-4 text-center flex justify-center">
                                            {/* Difficulty box */}
                                            <div className={`w-10 h-4 rounded-lg flex text-white items-center justify-center  ${lookup.difficulty >= 80 ? "bg-[#e74c3c]" :
                                                lookup.difficulty >= 60 ? "bg-[#f1530f]" :
                                                    lookup.difficulty >= 40 ? "bg-[#f1c40f]" :
                                                        lookup.difficulty >= 20 ? "bg-[#2ecc71]" :
                                                            lookup.difficulty >= 0 ? "bg-[#2ecc71]" :
                                                                ""} `}>



                                                {lookup.difficulty}
                                            </div>
                                        </td>
                                        <td className=" px-4 py-4 text-center">{lookup.cpc}</td>
                                    </tr>

                                ))
                            }
                        </tbody>
                    </table>
                    </div>


                    {/* Pagingation */}
                    {fetchedKeywords.length > 0 &&
                        <div className="flex items-center my-4">
                            <button onClick={() => handlePreviousPage()} className="bg-white text-sm border-border-color-light border rounded-lg px-4 py-2 mr-2">Previous</button>
                            <button onClick={() => handleNextPage()} className="bg-white text-sm  border-border-color-light border rounded-lg px-4 py-2">Next</button>
                            <span className="text-xs text-title-color-muted ml-3">{fetchedKeywords.length} results.</span>
                        </div>
                    }
                </div>
            </div>
        </DashLayout>
    )

}


const mapDispatchToProps = (dispatch) => ({
    setToast: (toast) => dispatch(setToast(toast)),
    setToastTitle: (toastTitle) => dispatch(setToastTitle(toastTitle)),
    setToastMessage: (toastMessage) => dispatch(setToastMessage(toastMessage)),
    setToastType: (toastType) => dispatch(setToastType(toastType)),
})



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
    if (session.token.role !== 'admin') {
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


export default connect(null, mapDispatchToProps)(HistoryPage);


