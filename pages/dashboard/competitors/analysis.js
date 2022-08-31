import React from 'react';
import KeywordSearch from '../../../components/KeywordSearch';
import DashLayout from '../../../Layouts/dashLayout';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { paginate, checkStringLength } from '../../../utils';
import { AiOutlineCloudDownload, AiOutlineQuestionCircle } from 'react-icons/ai';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { BsQuestionCircle } from 'react-icons/bs';
import SearchHistory from '../../../components/SearchHistory';
import { BsFillStarFill } from 'react-icons/bs';
import { AiOutlineSearch } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import { connect } from 'react-redux';
import { useSession, getSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import {
   setToast,
   setToastTitle,
   setToastMessage,
   setToastType,
} from '../../../redux/actions/initsActions';
import * as searchActions from '../../../redux/actions/keywordSearchActions';
import axios from 'axios';
import CompetitorSearch from '../../../components/CompetitorSearch';

function Analysis({
   keyword,
   result,
   difficulty,
   setToast,
   search_volume_history,
   setKeyword,
   setResult,
   setDifficulty,
   setSearchVolumeHistory,
   setToastTitle,
   setToastMessage,
   setToastType,
}) {
   const { data: session } = useSession();

   // state is loading
   const [isLoading, setIsLoading] = React.useState(false);
   const [dataFetched, setDataFetched] = React.useState(false);
   const [keywords, setKeywords] = React.useState([]);
   const [organicPositions, setOrganicPositions] = React.useState([]);
   const [paidPositions, setPaidPositions] = React.useState([]);
   const [seoScore, setSeoScore] = React.useState(60);

   const [h1Tags, setH1Tags] = React.useState([]);
   const [h2Tags, setH2Tags] = React.useState([]);
   const [h3Tags, setH3Tags] = React.useState([]);
   const [h4Tags, setH4Tags] = React.useState([]);
   const [h5Tags, setH5Tags] = React.useState([]);

   // form hook
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();

   // checks

   const [checks, setChecks] = React.useState({});

   // turn checks object to array while adding description for each check
   const checksArray = Object.keys(checks).map((key) => {
      let description = {
         no_content_encoding:
            'page with no content encoding indicates whether a page has no compression algorithm of the content',
         high_loading_time:
            'page with high loading time indicates whether a page loading time exceeds 3 seconds',
         is_redirect:
            'page with redirects indicates whether a page has 3XX redirects to other pages',
         is_4xx_code: 'page with 4xx status codes indicates whether a page has 4xx response code',
         is_5xx_code: 'page with 5xx status codes indicates whether a page has 5xx response code',
         is_broken:
            'broken page indicates whether a page returns a response code less than 200 or greater than 400',
         is_www: 'page with www indicates whether a page is on a www subdomain',
         is_https: 'page with the https protocol',
         is_http: 'page with the http protocol',
         high_waiting_time:
            'page with high waiting time indicates whether a page waiting time (aka Time to First Byte) exceeds 1.5 seconds',
         no_doctype:
            'page with no doctype indicates whether a page is without the <!DOCTYPE HTML> declaration',
         has_html_doctype:
            'page with HTML doctype declaration if true, the page has HTML DOCTYPE declaration',
         canonical: 'page is canonical',
         no_encoding_meta_tag:
            'page with no meta tag encoding indicates whether a page is without Content-Type informative only if the encoding is not explicit in the Content-Type header for example: Content-Type: "text/html; charset=utf8"',
         no_h1_tag: 'page with empty or absent h1 tags',
         https_to_http_links:
            'HTTPS page has links to HTTP pages if true, this HTTPS page has links to HTTP pages',
         size_greater_than_3mb:
            'page with size larger than 3 MB if true, the page size is exceeding 3 MB',
         meta_charset_consistency:
            'page with meta charset tag if true, the page has meta charset tag that sets character encoding for this page',
         has_meta_refresh_redirect:
            'pages with meta refresh redirect if true, the page has <meta http-equiv=”refresh”> tag that instructs a browser to load another page after a specified time span',
         has_render_blocking_resources:
            'page with render-blocking resources if true, the page has render-blocking scripts or stylesheets',
         low_content_rate:
            'pages with metpage with low content rate indicates whether a page has the plaintext size to page size ratio of less than 0.1a refresh redirect if true, the page has <meta http-equiv=”refresh”> tag that instructs a browser to load another page after a specified time span',
         high_content_rate:
            'page with high content rate indicates whether a page has the plaintext size to page size ratio of more than 0.9 available for canonical pages only',
         low_character_count: 'indicates whether the page has less than 1024 characters',
         high_character_count: 'indicates whether the page has more than 256,000 characters',
         small_page_size:
            'indicates whether a page is too small the value will be true if a page size is smaller than 1024 bytes',
         large_page_size:
            'indicates whether a page is too heavy the value will be true if a page size exceeds 256 kbytes',
         low_readability_rate:
            'page with a low readability rate indicates whether a page is scored less than 15 points on the Flesch–Kincaid readability test',
         irrelevant_description:
            'page with irrelevant description indicates whether a page description tag is irrelevant to the content of a page the relevance threshold is 0.2 available for canonical pages only',
         irrelevant_title:
            'page with irrelevant title indicates whether a page title tag is irrelevant to the content of the page the relevance threshold is 0.3 available for canonical pages only',
         irrelevant_meta_keywords:
            'page with irrelevant meta keywords indicates whether a page keywords tags are irrelevant to the content of a page the relevance threshold is 0.6 available for canonical pages only',
         title_too_long:
            'page with a long title indicates whether the content of the title tag exceeds 65 characters',
         title_too_short:
            'page with short titles indicates whether the content of title tag is shorter than 30 characters',
         deprecated_html_tags:
            'page with deprecated tags indicates whether a page has deprecated HTML tags',
         duplicate_meta_tags:
            'page with duplicate meta tags indicates whether a page has more than one meta tag of the same type available for canonical pages only',
         duplicate_title_tag:
            'page with more than one title tag indicates whether a page has more than one title tag',
         no_image_alt: 'images without alt tags',
         no_image_title: 'images without title tags',
         no_description:
            'pages with no description indicates whether a page has an empty or absent description meta tag available for canonical pages only',
         no_title: 'page with no title indicates whether a page has an empty or absent title tag',
         no_favicon: 'page with no favicon',
         seo_friendly_url: 'page with seo-frienldy URL',
         flash: 'page with flash',
         frame: 'page with frames',
         lorem_ipsum: 'page with lorem ipsum',
         has_misspelling: 'page with misspelling',
         seo_friendly_url_characters_check:
            'indicates whether a page URL containing only uppercase and lowercase Latin characters, digits and dashes ',
         seo_friendly_url_dynamic_check:
            'the value will be true if a page has no dynamic parameters in the url',
         seo_friendly_url_keywords_check:
            'indicates whether a page URL is consistent with the keywords meta tag',
         seo_friendly_url_relative_length_check:
            'the value will be true if a page URL no longer than 120 characters',
      };

      return {
         key: key,
         description: description[key],
         value: checks[key],
      };
   });

   // we get the ls from inits
   const getLs = async () => {
      var lic = '';
      await axios
         .post(process.env.NEXT_PUBLIC_PROD_URL + '/api/init/ls', {})
         .then((res) => {
            lic = res.data.ls;
         })
         .catch((err) => {
            // return the message from error
            console.log(err.response.data.message);
         });
      return lic;
   };

   // show only 2 decimal after the point
   const round = (value, decimals) => {
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
   };

   // handle submit
   const handleCompetitorSubmit = async (data) => {
      if (!isValidUrl(data)) {
         setToastType('danger');
         setToastTitle('Error!');
         setToastMessage('Please enter a valid url!');
         setToast(true);
         // after 3sconds set toast to false (hidden)
         setTimeout(() => {
            setToast(false);
         }, 3000);
         return;
      }
      setIsLoading(true);

      // // get ls
      let ls = await getLs();

      await axios
         .post(
            process.env.NEXT_PUBLIC_PROD_URL + '/api/operations/competitor',
            { url: data, domain: window.location.hostname, ls: ls },
            { withCredentials: true }
         )
         .then((res) => {
            if (res.status === 200) {
               setIsLoading(false);
               setDataFetched(true);
               setKeywords(res.data.rankedkeywords);
               setOrganicPositions(res.data.organicPositions);
               setPaidPositions(res.data.paidPositions);
               setSeoScore(res.data.onPageResult.items[0].onpage_score);
               setChecks(res.data.onPageResult.items[0].checks);
               res.data.onPageResult.items[0].meta.htags.h1 !== undefined &&
                  setH1Tags([...res.data.onPageResult.items[0].meta.htags.h1]);
               res.data.onPageResult.items[0].meta.htags.h2 !== undefined &&
                  setH2Tags([...res.data.onPageResult.items[0].meta.htags.h2]);
               res.data.onPageResult.items[0].meta.htags.h3 !== undefined &&
                  setH3Tags([...res.data.onPageResult.items[0].meta.htags.h3]);
               res.data.onPageResult.items[0].meta.htags.h4 !== undefined &&
                  setH4Tags([...res.data.onPageResult.items[0].meta.htags.h4]);
               res.data.onPageResult.items[0].meta.htags.h5 !== undefined &&
                  setH5Tags([...res.data.onPageResult.items[0].meta.htags.h5]);
            }
         })
         .catch((err) => {
            setToastType('warning');
            setToastTitle('Error!');
            setToastMessage(err.response.data.message);
            setToast(true);
            // after 3sconds set toast to false (hidden)
            setTimeout(() => {
               setToast(false);
            }, 3000);
            setIsLoading(false);
         });
   };

   // check if url starts with https or http

   const isValidUrl = (url) => {
      var urlregex =
         /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
      return urlregex.test(url);
   };

   // Seo Score Data
   const data = [
      {
         uv: 100,
         pv: 4567,
         fill: '#f0f0f0',
      },
      {
         uv: seoScore,
         pv: 4567,
         fill:
            seoScore > 80
               ? '#2ecc71'
               : seoScore > 60
               ? '#f1c40f'
               : seoScore > 40
               ? '#e67e22'
               : '#e74c3c',
      },
   ];

   return (
      <DashLayout>
         <NextSeo
            title={'Keyword Suggestion tool'}
            description={'Main tool for keyword research tool.'}
         />
         <div className="bg-color-dashboard-bg flex flex-1 w-full md:p-7 p-2  flex-col space-y-5">
            {/* Head */}
            <div className="">
               <h1 className="font-semibold text-3xl py-3">Competitors Analysis</h1>
               <p>
                  In here you can see the keywords that your competitors are using with many other
                  useful informations.
               </p>
            </div>
            {/* Keyword search component */}

            <CompetitorSearch
               isLoading={isLoading}
               handleKeywordLookupSubmit={handleCompetitorSubmit}
            />

            {/* SEO ONPAGE */}
            <div className="flex md:flex-row flex-col gap-4 ">
               {/* Left:Score */}
               <div className="   bg-white min-h-[300px] md:w-1/4 w-full p-5 border border-border-color-light ">
                  <div className="">
                     <Tooltip
                        className="ml-auto"
                        title="Number of organic SERPs where the domain ranks at a specific position">
                        <IconButton>
                           <BsQuestionCircle className=" w-4 h-4" />
                        </IconButton>
                     </Tooltip>
                     <span className="font-semibold">On-Page Score</span>
                  </div>
                  {!dataFetched ? (
                     <div className="flex justify-center items-center h-full flex-col">
                        <span className="text-sm font-semibold"> No data</span>
                        <span className="text-xs text-gray-500">
                           Please enter a domain to fetch keywords
                        </span>
                     </div>
                  ) : (
                     <div className="w-full h-full">
                        <div className="w-full h-full justify-center items-center">
                           <ResponsiveContainer width="100%" height="50%">
                              <RadialBarChart
                                 startAngle={0}
                                 cx="50%"
                                 cy="50%"
                                 innerRadius="40%"
                                 outerRadius="40%"
                                 barSize={17}
                                 data={data}>
                                 <RadialBar minAngle={15} background clockWise dataKey="uv" />
                              </RadialBarChart>
                           </ResponsiveContainer>
                           {seoScore !== null && (
                              <div className="flex flex-col text-center">
                                 <span className="text-xl font-bold">
                                    {seoScore}
                                    <span className="font-normal text-xs">/100</span>{' '}
                                 </span>
                                 <span className="font-semibold">
                                    {seoScore > 80
                                       ? 'VERY GOOD'
                                       : seoScore > 60
                                       ? 'GOOD'
                                       : seoScore > 40
                                       ? 'NEEEDS IMPROVEMENT'
                                       : seoScore > 20
                                       ? 'BAD'
                                       : 'VERY BAD'}
                                 </span>
                                 <span className="text-sm text-title-color-muted">SEO Score</span>
                              </div>
                           )}
                        </div>
                     </div>
                  )}
               </div>
               {/* Right Meta */}

               {/* Left:Score */}
               <div className="   bg-white flex flex-col flex-grow p-5 border border-border-color-light ">
                  <div className="">
                     <Tooltip
                        className="ml-auto"
                        title="Number of organic SERPs where the domain ranks at a specific position">
                        <IconButton>
                           <BsQuestionCircle className=" w-4 h-4" />
                        </IconButton>
                     </Tooltip>
                     <span className="font-semibold">On-Page Checks</span>
                  </div>
                  {/* Checks */}
                  {!dataFetched ? (
                     <div className="flex justify-center items-center h-full flex-col">
                        <span className="text-sm font-semibold"> No data</span>
                        <span className="text-xs text-gray-500">
                           Please enter a domain to fetch keywords
                        </span>
                     </div>
                  ) : (
                     <div className="grid md:grid-cols-3 grid-cols-1 gap-4 max-h-[260px]  overflow-y-scroll">
                        {checksArray.map((check) => (
                           <div className="flex items-center w-full gap-3 border shadow-md p-2 text-sm rounded-md cursor-pointer ">
                              {/* Status */}
                              <div>
                                 <Tooltip className="ml-auto" title={check.description}>
                                    <IconButton>
                                       <AiOutlineQuestionCircle className="w-3 h-3" />
                                    </IconButton>
                                 </Tooltip>
                              </div>
                              <div className=" min-w-[240px] max-w-[240px]">
                                 <span className="font-semibold text-gray-600">{check.key}</span>
                              </div>

                              <div className="">
                                 <span className="font-semibold text-[#1A01CC] ">
                                    {check.value.toString()}
                                 </span>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
            {/* On page ends */}
            {/* Metrics */}
            <div className="grid gap-5 md:grid-cols-2 grid-cols-1 min-h-[300px]">
               {/* left grid */}
               <div className="  w-full bg-white p-5 border border-border-color-light ">
                  <div className="">
                     <Tooltip
                        className="ml-auto"
                        title="Number of organic SERPs where the domain ranks at a specific position">
                        <IconButton>
                           <BsQuestionCircle className=" w-4 h-4" />
                        </IconButton>
                     </Tooltip>
                     <span className="font-semibold">Organic Positions</span>
                  </div>
                  {/* position */}
                  {!dataFetched ? (
                     <div className="flex justify-center items-center h-full flex-col">
                        <span className="text-sm font-semibold"> No data</span>
                        <span className="text-xs text-gray-500">
                           Please enter a domain to fetch keywords
                        </span>
                     </div>
                  ) : (
                     <div className="grid grid-cols-2 my-4 px-3">
                        <div>
                           <ul className="text-sm font-semibold w-[80%] mx-auto ">
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 1</span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.pos_1}</span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 2 - 3</span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.pos_2_3}</span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 4 - 10</span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.pos_4_10}</span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 11 - 20</span>{' '}
                                 <span className="text-[#1A01CC]">
                                    {organicPositions.pos_11_20}
                                 </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 21-30 </span>{' '}
                                 <span className="text-[#1A01CC]">
                                    {organicPositions.pos_21_30}
                                 </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 31-40</span>{' '}
                                 <span className="text-[#1A01CC]">
                                    {' '}
                                    {organicPositions.pos_31_40}{' '}
                                 </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 41-50</span>{' '}
                                 <span className="text-[#1A01CC]">
                                    {' '}
                                    {organicPositions.pos_41_50}{' '}
                                 </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 51-60</span>{' '}
                                 <span className="text-[#1A01CC]">
                                    {' '}
                                    {organicPositions.pos_51_60}{' '}
                                 </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 61-70</span>{' '}
                                 <span className="text-[#1A01CC]">
                                    {' '}
                                    {organicPositions.pos_61_70}{' '}
                                 </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 71-80</span>{' '}
                                 <span className="text-[#1A01CC]">
                                    {' '}
                                    {organicPositions.pos_71_80}{' '}
                                 </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 81-90</span>{' '}
                                 <span className="text-[#1A01CC]">
                                    {' '}
                                    {organicPositions.pos_81_90}{' '}
                                 </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 91-100</span>{' '}
                                 <span className="text-[#1A01CC]">
                                    {' '}
                                    {organicPositions.pos_91_100}{' '}
                                 </span>
                              </li>
                           </ul>
                        </div>
                        <div>
                           <ul className="md:text-sm text-xs font-semibold md:w-[80%] w-[100%] mx-auto ">
                              {/* Traffic Volume */}
                              <li className="grid  grid-cols-2 items-center ">
                                 <span className="">
                                    {' '}
                                    <Tooltip
                                       className="ml-auto"
                                       title="Estimated traffic volume based on impressions
                                    estimated organic monthly traffic to the domain
                                    calculated as the product of CTR (click-through-rate) and impressions values of all keywords the domain ranks for">
                                       <IconButton>
                                          <BsQuestionCircle className=" w-3 h-3" />
                                       </IconButton>
                                    </Tooltip>{' '}
                                    Traffic Volume{' '}
                                 </span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.etv}</span>
                              </li>
                              {/* Count */}
                              <li className="grid  grid-cols-2 items-center  ">
                                 <span className="">
                                    {' '}
                                    <Tooltip
                                       className="ml-auto"
                                       title="Total count of organic SERPs that contain the domain">
                                       <IconButton>
                                          <BsQuestionCircle className=" w-3 h-3" />
                                       </IconButton>
                                    </Tooltip>{' '}
                                    Total organic
                                 </span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.count}</span>
                              </li>
                              {/* New */}
                              <li className="grid  grid-cols-2 items-center  ">
                                 <span className="">
                                    {' '}
                                    <Tooltip
                                       className="ml-auto"
                                       title="Number of new ranked elements
                                    indicates how many new ranked elements were found for this domain">
                                       <IconButton>
                                          <BsQuestionCircle className=" w-3 h-3" />
                                       </IconButton>
                                    </Tooltip>{' '}
                                    Is New
                                 </span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.is_new}</span>
                              </li>
                              {/* New */}
                              <li className="grid  grid-cols-2 items-center  ">
                                 <span className="">
                                    {' '}
                                    <Tooltip
                                       className="ml-auto"
                                       title="Rank went up
                                    indicates how many ranked elements of this domain went up in Google Search">
                                       <IconButton>
                                          <BsQuestionCircle className=" w-3 h-3" />
                                       </IconButton>
                                    </Tooltip>{' '}
                                    Is Up
                                 </span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.is_up}</span>
                              </li>
                              <li className="grid  grid-cols-2 items-center  ">
                                 <span className="">
                                    {' '}
                                    <Tooltip
                                       className="ml-auto"
                                       title="Rank went down
                                    indicates how many ranked elements of this domain went down in Google Search">
                                       <IconButton>
                                          <BsQuestionCircle className=" w-3 h-3" />
                                       </IconButton>
                                    </Tooltip>{' '}
                                    Is Down
                                 </span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.is_down}</span>
                              </li>
                              <li className="grid  grid-cols-2 items-center  ">
                                 <span className="">
                                    {' '}
                                    <Tooltip
                                       className="ml-auto"
                                       title="Lost ranked elements
                                    indicates how many ranked elements of this domain were previously presented in SERPs, but weren’t found during the last check">
                                       <IconButton>
                                          <BsQuestionCircle className=" w-3 h-3" />
                                       </IconButton>
                                    </Tooltip>{' '}
                                    Is Lost
                                 </span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.is_lost}</span>
                              </li>
                           </ul>
                           *
                        </div>
                     </div>
                  )}
               </div>
               {/* Right grid */}
               <div className="  w-full bg-white p-5 border border-border-color-light ">
                  <div className="">
                     <Tooltip
                        className="ml-auto"
                        title="Number of organic SERPs where the domain ranks at a specific position">
                        <IconButton>
                           <BsQuestionCircle className=" w-4 h-4" />
                        </IconButton>
                     </Tooltip>
                     <span className="font-semibold">Organic Positions</span>
                  </div>
                  {/* position */}
                  {!dataFetched ? (
                     <div className="flex justify-center items-center h-full flex-col">
                        <span className="text-sm font-semibold"> No data</span>
                        <span className="text-xs text-gray-500">
                           Please enter a domain to fetch keywords
                        </span>
                     </div>
                  ) : (
                     <div className="grid grid-cols-2 my-4 px-3">
                        <div>
                           <ul className="text-sm font-semibold w-[80%] mx-auto ">
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 1</span>{' '}
                                 <span className="text-[#1A01CC]">{paidPositions.pos_1}</span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 2 - 3</span>{' '}
                                 <span className="text-[#1A01CC]">{paidPositions.pos_2_3}</span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 4 - 10</span>{' '}
                                 <span className="text-[#1A01CC]">{paidPositions.pos_4_10}</span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 11 - 20</span>{' '}
                                 <span className="text-[#1A01CC]">{paidPositions.pos_11_20}</span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 21-30 </span>{' '}
                                 <span className="text-[#1A01CC]">{paidPositions.pos_21_30}</span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 31-40</span>{' '}
                                 <span className="text-[#1A01CC]"> {paidPositions.pos_31_40} </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 41-50</span>{' '}
                                 <span className="text-[#1A01CC]"> {paidPositions.pos_41_50} </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 51-60</span>{' '}
                                 <span className="text-[#1A01CC]"> {paidPositions.pos_51_60} </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 61-70</span>{' '}
                                 <span className="text-[#1A01CC]"> {paidPositions.pos_61_70} </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 71-80</span>{' '}
                                 <span className="text-[#1A01CC]"> {paidPositions.pos_71_80} </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 81-90</span>{' '}
                                 <span className="text-[#1A01CC]"> {paidPositions.pos_81_90} </span>
                              </li>
                              <li className="grid  grid-cols-2 ">
                                 <span className="">Pos 91-100</span>{' '}
                                 <span className="text-[#1A01CC]">
                                    {' '}
                                    {paidPositions.pos_91_100}{' '}
                                 </span>
                              </li>
                           </ul>
                        </div>
                        <div>
                           <ul className="md:text-sm text-xs font-semibold md:w-[80%] w-[100%] mx-auto ">
                              {/* Traffic Volume */}
                              <li className="grid  grid-cols-2 items-center ">
                                 <span className="">
                                    {' '}
                                    <Tooltip
                                       className="ml-auto"
                                       title="Estimated traffic volume based on impressions
                                    estimated organic monthly traffic to the domain
                                    calculated as the product of CTR (click-through-rate) and impressions values of all keywords the domain ranks for">
                                       <IconButton>
                                          <BsQuestionCircle className=" w-3 h-3" />
                                       </IconButton>
                                    </Tooltip>{' '}
                                    Traffic Volume{' '}
                                 </span>{' '}
                                 <span className="text-[#1A01CC]">{paidPositions.etv}</span>
                              </li>
                              {/* Count */}
                              <li className="grid  grid-cols-2 items-center  ">
                                 <span className="">
                                    {' '}
                                    <Tooltip
                                       className="ml-auto"
                                       title="Total count of organic SERPs that contain the domain">
                                       <IconButton>
                                          <BsQuestionCircle className=" w-3 h-3" />
                                       </IconButton>
                                    </Tooltip>{' '}
                                    Total organic
                                 </span>{' '}
                                 <span className="text-[#1A01CC]">{paidPositions.count}</span>
                              </li>
                              {/* New */}
                              <li className="grid  grid-cols-2 items-center  ">
                                 <span className="">
                                    {' '}
                                    <Tooltip
                                       className="ml-auto"
                                       title="Number of new ranked elements
                                    indicates how many new ranked elements were found for this domain">
                                       <IconButton>
                                          <BsQuestionCircle className=" w-3 h-3" />
                                       </IconButton>
                                    </Tooltip>{' '}
                                    Is New
                                 </span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.is_new}</span>
                              </li>
                              {/* New */}
                              <li className="grid  grid-cols-2 items-center  ">
                                 <span className="">
                                    {' '}
                                    <Tooltip
                                       className="ml-auto"
                                       title="Rank went up
                                    indicates how many ranked elements of this domain went up in Google Search">
                                       <IconButton>
                                          <BsQuestionCircle className=" w-3 h-3" />
                                       </IconButton>
                                    </Tooltip>{' '}
                                    Is Up
                                 </span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.is_up}</span>
                              </li>
                              <li className="grid  grid-cols-2 items-center  ">
                                 <span className="">
                                    {' '}
                                    <Tooltip
                                       className="ml-auto"
                                       title="Rank went down
                                    indicates how many ranked elements of this domain went down in Google Search">
                                       <IconButton>
                                          <BsQuestionCircle className=" w-3 h-3" />
                                       </IconButton>
                                    </Tooltip>{' '}
                                    Is Down
                                 </span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.is_down}</span>
                              </li>
                              <li className="grid  grid-cols-2 items-center  ">
                                 <span className="">
                                    {' '}
                                    <Tooltip
                                       className="ml-auto"
                                       title="Lost ranked elements
                                    indicates how many ranked elements of this domain were previously presented in SERPs, but weren’t found during the last check">
                                       <IconButton>
                                          <BsQuestionCircle className=" w-3 h-3" />
                                       </IconButton>
                                    </Tooltip>{' '}
                                    Is Lost
                                 </span>{' '}
                                 <span className="text-[#1A01CC]">{organicPositions.is_lost}</span>
                              </li>
                           </ul>
                           *
                        </div>
                     </div>
                  )}
               </div>
            </div>
            {/* Metrics Ends */}
            {/* Head Tags */}
            <div className="  w-full bg-white p-5 border border-border-color-light min-h-[400px]  overflow-x-scroll scrollbar-hide ">
               <div className="">
                  <Tooltip
                     className="ml-auto"
                     title="Number of organic SERPs where the domain ranks at a specific position">
                     <IconButton>
                        <BsQuestionCircle className=" w-4 h-4" />
                     </IconButton>
                  </Tooltip>
                  <span className="font-semibold">Head Tags</span>
               </div>
               {!dataFetched ? (
                  <div className="flex justify-center items-center h-full flex-col">
                     <span className="text-sm font-semibold"> No data</span>
                     <span className="text-xs text-gray-500">
                        Please enter a domain to fetch keywords
                     </span>
                  </div>
               ) : (
                  <div className="grid grid-cols-3 ">
                     {/* Head item */}
                     <div className="flex flex-col px-4 my-2">
                        <span className="font-semibold">h1 </span>
                        <ul className="my-2">
                           {h1Tags.map((tag, index) => (
                              <li className="text-sm text-gray-500">{tag}</li>
                           ))}
                        </ul>
                     </div>
                     {/* Head item */}
                     <div className="flex flex-col px-4 my-2">
                        <span className="font-semibold">h2 </span>
                        <ul className="my-2">
                           {h2Tags.map((tag, index) => (
                              <li className="text-sm text-gray-500">{tag}</li>
                           ))}
                        </ul>
                     </div>
                     {/* Head item */}
                     <div className="flex flex-col px-4 my-2">
                        <span className="font-semibold">h3 </span>
                        <ul className="my-2">
                           {h3Tags.map((tag, index) => (
                              <li className="text-sm text-gray-500">{tag}</li>
                           ))}
                        </ul>
                     </div>
                     {/* Head item */}
                     <div className="flex flex-col px-4 my-2">
                        <span className="font-semibold">h4 </span>
                        <ul className="my-2">
                           {h4Tags.map((tag, index) => (
                              <li className="text-sm text-gray-500">{tag}</li>
                           ))}
                        </ul>
                     </div>
                     {/* Head item */}
                     <div className="flex flex-col px-4 my-2">
                        <span className="font-semibold">h5 </span>
                        <ul className="my-2">
                           {h5Tags.map((tag, index) => (
                              <li className="text-sm text-gray-500">{tag}</li>
                           ))}
                        </ul>
                     </div>
                  </div>
               )}
            </div>
            {/* End Head Tags */}

            {/* Keywords */}
            <div className="  w-full bg-white p-5 border border-border-color-light min-h-[400px]  overflow-x-scroll scrollbar-hide ">
               {!dataFetched ? (
                  <div className="flex justify-center items-center h-full flex-col">
                     <span className="text-sm font-semibold"> No data</span>
                     <span className="text-xs text-gray-500">
                        Please enter a domain to fetch keywords
                     </span>
                  </div>
               ) : (
                  <div className="wrapper md:w-full w-[700px] ">
                     {/* Head */}
                     <div className="grid grid-cols-6 gap-3 py-4 text-gray-600">
                        <div className="text-xs font-semibold">
                           <Tooltip className="ml-auto" title="returned keyword">
                              <IconButton>
                                 <BsQuestionCircle className=" w-4 h-4" />
                              </IconButton>
                           </Tooltip>
                           <span>Keyword</span>
                        </div>
                        <div className="text-xs font-semibold">
                           <Tooltip
                              className="ml-auto"
                              title="average monthly search volume rate
                           represents the (approximate) number of searches for the given keyword idea on google.com">
                              <IconButton>
                                 <BsQuestionCircle className=" w-4 h-4" />
                              </IconButton>
                           </Tooltip>
                           <span>Search Volume</span>
                        </div>
                        <div className="text-xs font-semibold">
                           <Tooltip
                              className="ml-auto"
                              title="cost-per-click
                           represents the average cost per click (USD) historically paid for the keyword">
                              <IconButton>
                                 <BsQuestionCircle className=" w-4 h-4" />
                              </IconButton>
                           </Tooltip>
                           <span>Cpc</span>
                        </div>
                        <div className="text-xs font-semibold">
                           <Tooltip
                              className="ml-auto"
                              title="competition level
                           represents the relative level of competition associated with the given keyword in paid SERP only;
                           possible values: LOW, MEDIUM, HIGH">
                              <IconButton>
                                 <BsQuestionCircle className=" w-4 h-4" />
                              </IconButton>
                           </Tooltip>
                           <span>Competition Level</span>
                        </div>
                        <div className="text-xs font-semibold">
                           <Tooltip
                              className="ml-auto"
                              title="maximum bid for the ad to be displayed at the top of the first page
                           indicates the value greater than about 80% of the lowest bids for which ads were displayed (based on Google Ads statistics for advertisers)">
                              <IconButton>
                                 <BsQuestionCircle className=" w-4 h-4" />
                              </IconButton>
                           </Tooltip>
                           <span>High top page bid</span>
                        </div>
                        <div className="text-xs font-semibold">
                           <Tooltip
                              className="ml-auto"
                              title="minimum bid for the ad to be displayed at the top of the first page
                           indicates the value greater than about 20% of the lowest bids for which ads were displayed (based on Google Ads statistics for advertisers)">
                              <IconButton>
                                 <BsQuestionCircle className=" w-4 h-4" />
                              </IconButton>
                           </Tooltip>
                           <span>Low top page bid</span>
                        </div>
                     </div>
                     {/* Body */}
                     <div>
                        {keywords.map((keyword, index) => (
                           <ul className="grid grid-cols-6 gap-3 py-2 border-t border-gray-200">
                              <li className="text-xs my-3 font-semibold text-black">
                                 {keyword.keyword}
                              </li>
                              <li className="text-xs my-3 font-semibold text-black ">
                                 {keyword.keyword_info.search_volume}
                              </li>
                              <li className="text-xs my-3 font-semibold text-black ">
                           
                                 {round(keyword.keyword_info.cpc, 2)}
                              </li>
                              <li className="text-xs my-3 font-semibold text-black ">
                                 {keyword.keyword_info.competition_level}
                              </li>
                              <li className="text-xs my-3 font-semibold text-black ">
                                 {round(keyword.keyword_info.low_top_of_page_bid, 2)}
                              </li>
                              <li className="text-xs my-3 font-semibold text-black ">
                                 {round(keyword.keyword_info.high_top_of_page_bid, 2)}
                              </li>
                           </ul>
                        ))}
                     </div>
                  </div>
               )}
            </div>
            {/* Keywords Ends */}
         </div>
      </DashLayout>
   );
}

const mapStateToProps = (state) => {
   return {
      keyword: state.keywordSearch.keyword,
      result: state.keywordSearch.result,
      difficulty: state.keywordSearch.difficulty,
      search_volume_history: state.keywordSearch.search_volume_history,
   };
};

const mapDispatchToProps = (dispatch) => {
   return {
      setKeyword: (keyword) => dispatch(searchActions.setKeyword(keyword)),
      setResult: (result) => dispatch(searchActions.setResult(result)),
      setDifficulty: (difficulty) => dispatch(searchActions.setDifficulty(difficulty)),
      setSearchVolumeHistory: (search_volume_history) =>
         dispatch(searchActions.setSearchVolumeHistory(search_volume_history)),
      setToast: (toast) => dispatch(setToast(toast)),
      setToastTitle: (toastTitle) => dispatch(setToastTitle(toastTitle)),
      setToastMessage: (toastMessage) => dispatch(setToastMessage(toastMessage)),
      setToastType: (toastType) => dispatch(setToastType(toastType)),
   };
};

export async function getServerSideProps(context) {
   const session = await getSession(context);

   if (!session) {
      return {
         redirect: {
            destination: '/login',
            permanent: false,
         },
      };
   }

   return {
      props: { session },
   };
}

export default connect(mapStateToProps, mapDispatchToProps)(Analysis);
