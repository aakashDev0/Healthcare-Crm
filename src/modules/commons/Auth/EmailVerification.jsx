// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";
// import SessionChecker from "../../utils/SessionChecker";
const EmailVerifiaction = () => {
  const navigate = useNavigate();

  return (
    <>
    {/* <SessionChecker/> */}
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full px-6 md:px-12 py-12 bg-[#F5F5F5] gap-6">
      {/* Left Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left pl-10 md:pl-20">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="flex items-center gap-1 mb-1">
            <img
              src="/ALM LOGO BRIGHT.png"
              alt="Logo"
              className="w-45 h-30 object-contain"
            />
          </div>
          {/* Description */}
          <p className="text-[#5A5A5A] font-inter text-[14px] font-normal leading-[24px] mb-6">
            Directly addresses professional learners, emphasizing career
            advancement and practical skill acquisition.
          </p>

          {/* Secure Connection */}
          <div className="flex items-center gap-3 w-full max-w-[350px] px-5 py-3 border border-[#107A2B] rounded-[13px] bg-[rgba(52,199,89,0.24)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 30 30"
              fill="none"
            >
              <path
                d="M13.6875 19.4062L20.5625 12.5L18.9688 10.9062L13.6875 16.2188L11.0312 13.5625L9.4375 15.1562L13.6875 19.4062ZM15 27C12.1875 26.3125 9.85938 24.7204 8.01562 22.2238C6.17188 19.7269 5.25 16.9544 5.25 13.9062V6.75L15 3L24.75 6.75V13.9062C24.75 16.9544 23.8281 19.7269 21.9844 22.2238C20.1406 24.7204 17.8125 26.3125 15 27ZM15 24.6562C17.1667 23.9844 18.9583 22.6406 20.375 20.625C21.7917 18.6094 22.5 16.3698 22.5 13.9062V8.28125L15 5.40625L7.5 8.28125V13.9062C7.5 16.3698 8.20833 18.6094 9.625 20.625C11.0417 22.6406 12.8333 23.9844 15 24.6562Z"
                fill="#1B8135"
              />
            </svg>
            <div>
              <div className="text-base text-[14px] font-medium text-green-800">
                Secure Connection
              </div>
              <div className="text-green-700 text-[14px] self-stretch">
                Your connection to this site is encrypted
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full h-126 lg:w-1/2 p-8 bg-[#FFFFFF] lg:p-20 flex items-center">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="52"
                height="42"
                viewBox="0 0 52 42"
                fill="none"
              >
                <path
                  d="M42.2004 41.7L38.8004 38.3L42.5337 34.5H32.4004V29.7H42.5337L38.8004 25.9L42.2004 22.5L51.6004 32.1L42.2004 41.7ZM5.20039 35.3C3.88039 35.3 2.75039 34.83 1.81039 33.89C0.870391 32.95 0.400391 31.82 0.400391 30.5V4.89998C0.400391 3.57998 0.870391 2.44998 1.81039 1.50998C2.75039 0.569977 3.88039 0.0999756 5.20039 0.0999756H37.1717C38.5242 0.0999756 39.6671 0.569977 40.6004 1.50998C41.5337 2.44998 42.0004 3.57998 42.0004 4.89998L42.0671 16.1C41.2226 16.1444 40.3893 16.2222 39.5671 16.3333C38.7448 16.4444 37.9559 16.6111 37.2004 16.8333V8.23331L21.2004 19.3L5.20039 8.23331V30.5H26.0671C26.0226 30.6778 26.0004 30.9 26.0004 31.1666V32.1C26.0004 32.5444 26.0448 33.0778 26.1337 33.7C26.2226 34.3222 26.3115 34.8555 26.4004 35.3H5.20039ZM8.86706 4.89998L21.2004 13.5L33.5337 4.89998H8.86706Z"
                  fill="#34A853"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-[24px] font-semibold mb-4">
            Verify your email address
          </h1>

          <p className="text-gray-600 text-[16px] mb-8">
            <b>Please click on the link</b> in the email we just sent you to
            confirm your email adress
          </p>

          <button className="text-blue-500 text-[16px] hover:text-blue-600 font-medium mb-6">
            Resend Email
          </button>

          <div className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800">
            <button
              className="flex items-center gap-2"
              onClick={() => navigate("/")}
            >
              Logout
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.125 11.25H4V9.75H13.125L8.9375 5.5625L10 4.5L16 10.5L10 16.5L8.9375 15.4375L13.125 11.25Z"
                  fill="#898989"
                />
              </svg>
            </button>
          </div>

          <div className="mt-25 text-[14px] flex text-center text-gray-600">
            Need help? Contact your system administrator
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default EmailVerifiaction;
