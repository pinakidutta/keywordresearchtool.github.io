import React from 'react';
import FrontNavbar from '../components/FrontNavbar';
import { NextSeo } from 'next-seo';
import {
   BsQuestionCircle,
   BsCheckLg,
   BsDashLg,
   BsChevronDown,
} from 'react-icons/bs';
import FrontFooter from '../components/FrontFooter';

const privacy = () => {
   // meta description
   const pageTitle = 'KW | Privacy Policy';
   const pageDescription = 'KW | Privacy Policy';

   const solutions = [
      {
         name: 'Analytics',
         description:
            'Get a better understanding of where your traffic is coming from.',
         href: '#',
         icon: BsCheckLg,
      },
      {
         name: 'Engagement',
         description:
            'Speak directly to your customers in a more meaningful way.',
         href: '#',
         icon: BsCheckLg,
      },
      {
         name: 'Security',
         description: "Your customers' data will be safe and secure.",
         href: '#',
         icon: BsCheckLg,
      },
      {
         name: 'Integrations',
         description:
            "Connect with third-party tools that you're already using.",
         href: '#',
         icon: BsCheckLg,
      },
      {
         name: 'Automations',
         description:
            'Build strategic funnels that will drive your customers to convert',
         href: '#',
         icon: BsCheckLg,
      },
      {
         name: 'Reports',
         description:
            'Get detailed reports that will help you make more informed decisions ',
         href: '#',
         icon: BsCheckLg,
      },
   ];
   const navigation = {
      solutions: [
         { name: 'Marketing', href: '#' },
         { name: 'Analytics', href: '#' },
         { name: 'Commerce', href: '#' },
         { name: 'Insights', href: '#' },
      ],
      support: [
         { name: 'Pricing', href: '#' },
         { name: 'Documentation', href: '#' },
         { name: 'Guides', href: '#' },
         { name: 'API Status', href: '#' },
      ],
      company: [
         { name: 'About', href: '#' },
         { name: 'Blog', href: '#' },
         { name: 'Jobs', href: '#' },
         { name: 'Press', href: '#' },
         { name: 'Partners', href: '#' },
      ],
      legal: [
         { name: 'Claim', href: '#' },
         { name: 'Privacy', href: '#' },
         { name: 'Terms', href: '#' },
      ],
      social: [
         {
            name: 'Facebook',
            href: '#',
            icon: (props) => (
               <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                  <path
                     fillRule="evenodd"
                     d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                     clipRule="evenodd"
                  />
               </svg>
            ),
         },
         {
            name: 'Instagram',
            href: '#',
            icon: (props) => (
               <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                  <path
                     fillRule="evenodd"
                     d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                     clipRule="evenodd"
                  />
               </svg>
            ),
         },
         {
            name: 'Twitter',
            href: '#',
            icon: (props) => (
               <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
               </svg>
            ),
         },
         {
            name: 'GitHub',
            href: '#',
            icon: (props) => (
               <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                  <path
                     fillRule="evenodd"
                     d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                     clipRule="evenodd"
                  />
               </svg>
            ),
         },
         {
            name: 'Dribbble',
            href: '#',
            icon: (props) => (
               <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
                  <path
                     fillRule="evenodd"
                     d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                     clipRule="evenodd"
                  />
               </svg>
            ),
         },
      ],
   };

   return (
      <div>
         {/*    header */}
         <NextSeo title={pageTitle} description={pageDescription} />
         <FrontNavbar solutions={solutions} color="#2DCB73" />
         <div>
            <div className="relative py-16 bg-white overflow-hidden">
               <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
                  <div
                     className="relative h-full text-lg max-w-[80%] mx-auto"
                     aria-hidden="true">
                     <svg
                        className="absolute  top-12 left-full transform translate-x-32"
                        width={404}
                        height={384}
                        fill="none"
                        viewBox="0 0 404 384">
                        <defs>
                           <pattern
                              id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                              x={0}
                              y={0}
                              width={20}
                              height={20}
                              patternUnits="userSpaceOnUse">
                              <rect
                                 x={0}
                                 y={0}
                                 width={4}
                                 height={4}
                                 className="text-gray-200"
                                 fill="currentColor"
                              />
                           </pattern>
                        </defs>
                        <rect
                           width={404}
                           height={384}
                           fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
                        />
                     </svg>
                     <svg
                        className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
                        width={404}
                        height={384}
                        fill="none"
                        viewBox="0 0 404 384">
                        <defs>
                           <pattern
                              id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                              x={0}
                              y={0}
                              width={20}
                              height={20}
                              patternUnits="userSpaceOnUse">
                              <rect
                                 x={0}
                                 y={0}
                                 width={4}
                                 height={4}
                                 className="text-gray-200"
                                 fill="currentColor"
                              />
                           </pattern>
                        </defs>
                        <rect
                           width={404}
                           height={384}
                           fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
                        />
                     </svg>
                     <svg
                        className="absolute bottom-12 left-full transform translate-x-32"
                        width={404}
                        height={384}
                        fill="none"
                        viewBox="0 0 404 384">
                        <defs>
                           <pattern
                              id="d3eb07ae-5182-43e6-857d-35c643af9034"
                              x={0}
                              y={0}
                              width={20}
                              height={20}
                              patternUnits="userSpaceOnUse">
                              <rect
                                 x={0}
                                 y={0}
                                 width={4}
                                 height={4}
                                 className="text-gray-200"
                                 fill="currentColor"
                              />
                           </pattern>
                        </defs>
                        <rect
                           width={404}
                           height={384}
                           fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
                        />
                     </svg>
                  </div>
               </div>
               <div className="relative px-4 sm:px-6 lg:px-8">
                  <div className="text-lg max-w-[80%] mx-auto">
                     <div>
                        <span className="block text-base text-center text-[#2DCB73] font-semibold tracking-wide uppercase">
                           PAGE
                        </span>
                     </div>
                     <h1 className="text-4xl w-full text-center font-bold my-4">
                        {' '}
                        Privacy Policy{' '}
                     </h1>

                     <p className="mt-8 text-xl text-gray-500 leading-8">
                        At kwmaster, accessible from www.kwmaster.com, one of
                        our main priorities is the privacy of our visitors. This
                        Privacy Policy document contains types of information
                        that is collected and recorded by kwmaster and how we
                        use it.
                     </p>
                     <p className="mt-8 text-xl text-gray-500 leading-8">
                        If you have additional questions or require more
                        information about our Privacy Policy, do not hesitate to
                        contact us.
                     </p>
                  </div>
                  <div className="mt-6 max-w-[80%] prose-indigo prose-lg text-gray-500 mx-auto">
                     <p>
                        This <strong>Privacy Policy</strong> applies only to our
                        online activities and is valid for visitors to our
                        website with regards to the information that they shared
                        and/or collect in kwmaster. This policy is not
                        applicable to any information collected offline or via
                        channels other than this website. Our Privacy Policy was
                        created with the help of the Free Privacy Policy
                        Generator.
                     </p>
                     <p>
                        <strong>Consent</strong>
                     </p>
                     <p>
                        By using our website, you hereby consent to our Privacy
                        Policy and agree to its terms.
                     </p>
                     <p>
                        <strong>Information we collect</strong>
                     </p>
                     <p>
                        The personal information that you are asked to provide,
                        and the reasons why you are asked to provide it, will be
                        made clear to you at the point we ask you to provide
                        your personal information.
                     </p>

                     <p>
                        If you contact us directly, we may receive additional
                        information about you such as your name, email address,
                        phone number, the contents of the message and/or
                        attachments you may send us, and any other information
                        you may choose to provide.
                     </p>
                     <p>
                        When you register for an Account, we may ask for your
                        contact information, including items such as name,
                        company name, address, email address, and telephone
                        number.
                     </p>
                     <p>
                        <strong>How we use your information</strong>
                     </p>

                     <ul role="list">
                        <li>Provide, operate, and maintain our website</li>
                        <li>Improve, personalize, and expand our website</li>
                        <li>
                           Develop new products, services, features, and
                           functionality
                        </li>
                        <li>
                           Communicate with you, either directly or through one
                           of our partners, including for customer service, to
                           provide you with updates and other information
                           relating to the website, and for marketing and
                           promotional purposes
                        </li>
                        <li>Send you emails</li>
                        <li>Find and prevent fraud</li>
                     </ul>

                     <p>
                        <strong>Log Files</strong>
                     </p>

                     <p>
                        kwmaster follows a standard procedure of using log
                        files. These files log visitors when they visit
                        websites. All hosting companies do this and a part of
                        hosting services' analytics. The information collected
                        by log files include internet protocol (IP) addresses,
                        browser type, Internet Service Provider (ISP), date and
                        time stamp, referring/exit pages, and possibly the
                        number of clicks. These are not linked to any
                        information that is personally identifiable. The purpose
                        of the information is for analyzing trends,
                        administering the site, tracking users' movement on the
                        website, and gathering demographic information.
                     </p>

                     <p>
                        <strong>Cookies and Web Beacons</strong>
                     </p>
                     <p>
                        Like any other website, kwmaster uses 'cookies'. These
                        cookies are used to store information including
                        visitors' preferences, and the pages on the website that
                        the visitor accessed or visited. The information is used
                        to optimize the users' experience by customizing our web
                        page content based on visitors' browser type and/or
                        other information.
                     </p>
                     <p>
                        For more general information on cookies, please read the
                        Cookies article on TermsFeed website.
                     </p>

                     <p>
                        <strong>Advertising Partners Privacy Policies</strong>
                     </p>

                     <p>
                        You may consult this list to find the Privacy Policy for
                        each of the advertising partners of kwmaster.
                     </p>

                     <p>
                        Third-party ad servers or ad networks uses technologies
                        like cookies, JavaScript, or Web Beacons that are used
                        in their respective advertisements and links that appear
                        on kwmaster, which are sent directly to users' browser.
                        They automatically receive your IP address when this
                        occurs. These technologies are used to measure the
                        effectiveness of their advertising campaigns and/or to
                        personalize the advertising content that you see on
                        websites that you visit.
                     </p>
                     <p>
                        Note that kwmaster has no access to or control over
                        these cookies that are used by third-party advertisers.
                     </p>

                     <p>
                        <strong>Third Party Privacy Policies</strong>
                     </p>
                     <p>
                        kwmaster's Privacy Policy does not apply to other
                        advertisers or websites. Thus, we are advising you to
                        consult the respective Privacy Policies of these
                        third-party ad servers for more detailed information. It
                        may include their practices and instructions about how
                        to opt-out of certain options.
                     </p>
                     <p>
                        You can choose to disable cookies through your
                        individual browser options. To know more detailed
                        information about cookie management with specific web
                        browsers, it can be found at the browsers' respective
                        websites.
                     </p>
                     <p>
                        <strong>
                           CCPA Privacy Rights (Do Not Sell My Personal
                           Information)
                        </strong>
                     </p>
                     <p>
                        Under the CCPA, among other rights, California consumers
                        have the right to:
                     </p>
                     <p>
                        Request that a business that collects a consumer's
                        personal data disclose the categories and specific
                        pieces of personal data that a business has collected
                        about consumers.
                     </p>
                     <p>
                        Request that a business delete any personal data about
                        the consumer that a business has collected.
                     </p>
                     <p>
                        Request that a business that sells a consumer's personal
                        data, not sell the consumer's personal data.
                     </p>
                     <p>
                        If you make a request, we have one month to respond to
                        you. If you would like to exercise any of these rights,
                        please contact us.
                     </p>
                     <p>
                        <strong>GDPR Data Protection Rights</strong>
                     </p>
                     <p>
                        We would like to make sure you are fully aware of all of
                        your data protection rights. Every user is entitled to
                        the following:
                     </p>
                     <p>
                        The right to access – You have the right to request
                        copies of your personal data. We may charge you a small
                        fee for this service.
                     </p>
                     <p>
                        The right to rectification – You have the right to
                        request that we correct any information you believe is
                        inaccurate. You also have the right to request that we
                        complete the information you believe is incomplete.
                     </p>
                     <p>
                        The right to erasure – You have the right to request
                        that we erase your personal data, under certain
                        conditions.
                     </p>
                     <p>
                        The right to restrict processing – You have the right to
                        request that we restrict the processing of your personal
                        data, under certain conditions.
                     </p>
                     <p>
                        The right to object to processing – You have the right
                        to object to our processing of your personal data, under
                        certain conditions.
                     </p>
                     <p>
                        The right to data portability – You have the right to
                        request that we transfer the data that we have collected
                        to another organization, or directly to you, under
                        certain conditions.
                     </p>
                     <p>
                        If you make a request, we have one month to respond to
                        you. If you would like to exercise any of these rights,
                        please contact us.
                     </p>
                     <p>
                        <strong>Children's Information</strong>
                     </p>
                     <p>
                        Another part of our priority is adding protection for
                        children while using the internet. We encourage parents
                        and guardians to observe, participate in, and/or monitor
                        and guide their online activity.
                     </p>
                     <p>
                        kwmaster does not knowingly collect any Personal
                        Identifiable Information from children under the age of
                        13. If you think that your child provided this kind of
                        information on our website, we strongly encourage you to
                        contact us immediately and we will do our best efforts
                        to promptly remove such information from our records.
                     </p>
                  </div>
               </div>
            </div>
         </div>
         <FrontFooter navigation={navigation} />
      </div>
   );
};

export default privacy;
