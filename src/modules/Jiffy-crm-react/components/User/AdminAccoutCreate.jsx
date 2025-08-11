// eslint-disable-next-line no-unused-vars
import React from "react";
import SessionChecker from "../utils/SessionChecker";

const AdminAccountCreate = () => {
  return (
    <>
    <SessionChecker/>
      <div className="flex min-h-screen w-full bg-[#F5F5F5]">
      <div className="w-1/2 hidden md:flex items-center justify-center px-6 lg:px-20 bg-[#F5F5F5] fixed h-screen">
          <div className="w-full max-w-lg text-center md:text-left">
            <div className="flex items-center gap-1 mb-4">
              <img
                src="/ALM LOGO BRIGHT.png"
                alt="Logo"
                className="w-45 h-30 object-contain"
              />
            </div>
            <p className="text-[#5A5A5A] text-sm md:text-[14px] leading-[22px] md:leading-[24px] mb-6">
              Directly addresses professional learners, emphasizing career
              advancement and practical skill acquisition.
            </p>

            <div className="flex items-center gap-3 w-full max-w-[350px] px-4 py-3 border border-[#107A2B] rounded-lg bg-[rgba(52,199,89,0.24)]">
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
                <div className="text-[14px] md:text-base font-medium text-green-800">
                  Secure Connection
                </div>
                <div className="text-green-700 text-[14px]">
                  Your connection to this site is encrypted
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2 ml-auto mr-4 md:mr-8 h-screen mt-2 overflow-y-auto bg-white flex flex-col items-center rounded-lg shadow-md p-3">
          <div className="w-full max-w-md mt-2 ">
            <h2 className="text-[24px] font-medium flex text-gray-800 mb-1 text-center">
              Complete your setup
            </h2>
            <p className="text-gray-600 flex text-[14px] mb-5 ">
              Set up your password to access the learning management system.
            </p>

            <form className="w-full">
              <div className="mb-3">
                <label
                  htmlFor="email"
                  className="block font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-1">
                  New password
                </label>
                <div className="relative mb-3">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                    >
                      <path
                        d="M5.99417 18.5C5.58139 18.5 5.22917 18.3531 4.9375 18.0594C4.64583 17.7656 4.5 17.4125 4.5 17V9C4.5 8.5875 4.64687 8.23438 4.94062 7.94063C5.23437 7.64688 5.5875 7.5 6 7.5H6.5V5.5C6.5 4.39333 6.89049 3.45 7.67146 2.67C8.45229 1.89 9.39674 1.5 10.5048 1.5C11.6127 1.5 12.5556 1.89 13.3333 2.67C14.1111 3.45 14.5 4.39333 14.5 5.5V7.5H15C15.4125 7.5 15.7656 7.64688 16.0594 7.94063C16.3531 8.23438 16.5 8.5875 16.5 9V17C16.5 17.4125 16.3531 17.7656 16.0592 18.0594C15.7653 18.3531 15.4119 18.5 14.9992 18.5H5.99417ZM6 17H15V9H6V17ZM10.5044 14.5C10.9181 14.5 11.2708 14.3527 11.5625 14.0581C11.8542 13.7635 12 13.4094 12 12.9956C12 12.5819 11.8527 12.2292 11.5581 11.9375C11.2635 11.6458 10.9094 11.5 10.4956 11.5C10.0819 11.5 9.72917 11.6473 9.4375 11.9419C9.14583 12.2365 9 12.5906 9 13.0044C9 13.4181 9.14729 13.7708 9.44187 14.0625C9.73646 14.3542 10.0906 14.5 10.5044 14.5ZM8 7.5H13V5.5C13 4.80556 12.7569 4.21528 12.2708 3.72917C11.7847 3.24306 11.1944 3 10.5 3C9.80556 3 9.21528 3.24306 8.72917 3.72917C8.24306 4.21528 8 4.80556 8 5.5V7.5Z"
                        fill="#666666"
                      />
                    </svg>{" "}
                  </div>
                  <input
                    required
                    type="password"
                    placeholder="Enter your new password"
                    className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-1">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="21"
                      viewBox="0 0 21 21"
                      fill="none"
                    >
                      <path
                        d="M5.99417 18.5C5.58139 18.5 5.22917 18.3531 4.9375 18.0594C4.64583 17.7656 4.5 17.4125 4.5 17V9C4.5 8.5875 4.64687 8.23438 4.94062 7.94063C5.23437 7.64688 5.5875 7.5 6 7.5H6.5V5.5C6.5 4.39333 6.89049 3.45 7.67146 2.67C8.45229 1.89 9.39674 1.5 10.5048 1.5C11.6127 1.5 12.5556 1.89 13.3333 2.67C14.1111 3.45 14.5 4.39333 14.5 5.5V7.5H15C15.4125 7.5 15.7656 7.64688 16.0594 7.94063C16.3531 8.23438 16.5 8.5875 16.5 9V17C16.5 17.4125 16.3531 17.7656 16.0592 18.0594C15.7653 18.3531 15.4119 18.5 14.9992 18.5H5.99417ZM6 17H15V9H6V17ZM10.5044 14.5C10.9181 14.5 11.2708 14.3527 11.5625 14.0581C11.8542 13.7635 12 13.4094 12 12.9956C12 12.5819 11.8527 12.2292 11.5581 11.9375C11.2635 11.6458 10.9094 11.5 10.4956 11.5C10.0819 11.5 9.72917 11.6473 9.4375 11.9419C9.14583 12.2365 9 12.5906 9 13.0044C9 13.4181 9.14729 13.7708 9.44187 14.0625C9.73646 14.3542 10.0906 14.5 10.5044 14.5ZM8 7.5H13V5.5C13 4.80556 12.7569 4.21528 12.2708 3.72917C11.7847 3.24306 11.1944 3 10.5 3C9.80556 3 9.21528 3.24306 8.72917 3.72917C8.24306 4.21528 8 4.80556 8 5.5V7.5Z"
                        fill="#666666"
                      />
                    </svg>{" "}
                  </div>
                  <input
                    required
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-100 mt-3 rounded-md p-4 mb-3">
                <h3 className="text-blue-600 font-medium mb-2">
                  Password Requirements
                </h3>
                <ul className="list-disc pl-5 text-blue-600 text-[14px]">
                  <li className="mb-1">Minimum 8 characters</li>
                  <li className="mb-1">At least one uppercase letter</li>
                  <li className="mb-1">At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>
              <div className="mb-3">
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
                >
                  Complete Account Setup
                </button>
              </div>
              <div className="mb-2">
                <button
                  type="button"
                  className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>

            <p className="text-gray-500 text-[14px] flex mt-8">
              Need help? Contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAccountCreate;
