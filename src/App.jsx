// eslint-disable-next-line no-unused-vars
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Login from "./Auth/components/Login";
// import UserManagement from "./User/UserMangement";
// import ForgetPass from "./Auth/components/ForgetPassword";
// import EmailVerification from "./Auth/components/EmailVerification";
// import ResetPassword from "./Auth/components/ResetPassword";
// import LandingPage from "./DashBoard/LandingPage";
// import AdminAccountCreate from "./User/AdminAccoutCreate";
// import InviteUser from "./User/InviteUser";
// import EditUser from "./User/EditUser";
// import SignUp from "./Auth/components/SignUp";
// import Desktop from "./DashBoard/Desktop";
// import CreateDebtInstrumentForm from "./DashBoard/CreateDebtInstrumentForm ";
// import MultiStepForm from "./DashBoard/components/form/MultiStepForm";
import ModuleOneRoutes from "./ModuleOneRoutes";
// import ModuleTwoRoutes from "./ModuleTwoRoutes";
import ProtectedRoute from "./ProtectedRoute";
// import { SessionProvider } from './utils/SessionChecker';

function App() {
  return (
    <>
      <Router>
        {/* <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/usermanagement" element={<UserManagement />} />
            <Route path="/forgetpassword" element={<ForgetPass />} />
            <Route path="/Resetpassword" element={<ResetPassword />} />
            <Route path="/emailverify" element={<EmailVerification />} />
            <Route path="/landingpage" element={<LandingPage />} />
            <Route
              path="/adminaccountcreate"
              element={<AdminAccountCreate />}
            />
            <Route path="/inviteuser" element={<InviteUser />} />
            <Route path="/edituser" element={<EditUser />} />
            <Route path="/desktop/:roleId" element={<Desktop />} />
            <Route
              path="/createdeptinstrumentform"
              element={<CreateDebtInstrumentForm />}
            />
            <Route path="/multistepform" element={<MultiStepForm />} />
          </Routes> */}
             
        <Routes>
          {/* unprotectecd routes */}
          <Route path="/*" element={<ModuleOneRoutes />} />
          {/* <Route path="/user-" element={<ModuleTwoRoutes />} /> */}

          {/* {/ Protected Routes /} */}
          <Route element={<ProtectedRoute />}></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
