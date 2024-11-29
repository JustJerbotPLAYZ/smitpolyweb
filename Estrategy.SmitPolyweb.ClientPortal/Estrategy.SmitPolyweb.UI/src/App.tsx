import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Reminder from "./pages/Reminder";
import AddTicketLocation from "./pages/ticket/AddTicketLocation";
import AddTicketCustomer from "./pages/ticket/AddTicketCustomer";
import AddTicketCertificate from "./pages/ticket/AddTicketCertificate";
import ScheduleTicket from "./pages/ticket/ScheduleTicket";
import Customer from "./pages/customer/Customer";
import User from "./pages/user/User";

import EditCustomer from "./pages/customer/EditCustomer";
import CreateCustomer from "./pages/customer/CreateCustomer";
import ArticleType from "./pages/articleType/ArticleType";
import AddArticle from "./pages/article/AddArticle";
import EditArticle from "./pages/article/EditArticle";
import Property from "./pages/property/Property";
import EditProperty from "./pages/property/EditProperty";
import EditUser from "./pages/user/EditUser";
import EditArticleType from "./pages/articleType/EditArticleType";
import Article from "./pages/article/Article";
import CreateArticleType from "./pages/articleType/CreateArticleType";
import CreateNewUser from "./pages/user/CreateUser";
import AddCertificate from "./pages/certificate/CreateCertificate";
import EditCertificate from "./pages/certificate/EditCertificate";
import Certificate from "./pages/certificate/Certificate";
import CreateProperty from "./pages/property/CreateProperty";
import EditTicket from "./pages/ticket/EditTicket";
import Ticket from "./pages/ticket/Ticket";
import { PrivateRoute } from "./components/PrivateRoute";
import NotFound from "./pages/NotFound";

export default function App() {
    const roleName = localStorage.getItem("roleName")?.toLowerCase();

    function getRoutesByRole() {
        switch (roleName) {
            case "customer":
                return (
                    <Routes>
                        <Route path="/" element={<Login />} />

                        <Route path="/certificate" element={<PrivateRoute><Certificate /></PrivateRoute>} />

                        <Route path="/user" element={<PrivateRoute><User /></PrivateRoute>} />
                        <Route path="/user/create" element={<PrivateRoute><CreateNewUser /></PrivateRoute>} />
                        <Route path="/user/edit/:id" element={<PrivateRoute><EditUser /></PrivateRoute>} />

                        {/* NOTE: Keep this route last. '*' is a fallback to check for existing urls */}
                        <Route path="*" element={<PrivateRoute><NotFound /></PrivateRoute>} />
                    </Routes>
                );
                break;
            case "customerread":
                return (
                    <Routes>
                        <Route path="/" element={<Login />} />

                        <Route path="/certificate" element={<PrivateRoute><Certificate /></PrivateRoute>} />

                        {/* NOTE: Keep this route last. '*' is a fallback to check for existing urls */}
                        <Route path="*" element={<PrivateRoute><NotFound /></PrivateRoute>} />
                    </Routes>
                );
                break;
            case "mechanic":
                return (
                    <Routes>
                        <Route path="/" element={<Login />} />

                        <Route path="/certificate" element={<PrivateRoute><Certificate /></PrivateRoute>} />
                        <Route path="/certificate/create" element={<PrivateRoute><AddCertificate /></PrivateRoute>} />
                        <Route path="/certificate/edit/:id" element={<PrivateRoute><EditCertificate /></PrivateRoute>} />

                        <Route path="/ticket" element={<PrivateRoute><Ticket /></PrivateRoute>} />
                        <Route path="/ticket/edit/:id" element={<PrivateRoute><EditTicket /></PrivateRoute>} />
                        <Route path="/ticket/create/addCustomer" element={<PrivateRoute><AddTicketCustomer /></PrivateRoute>} />
                        <Route path="/ticket/create/addLocation" element={<PrivateRoute><AddTicketLocation /></PrivateRoute>} />
                        <Route path="/ticket/create/addCertificates" element={<PrivateRoute><AddTicketCertificate /></PrivateRoute>} />
                        <Route path="/ticket/create/scheduleTicket" element={<PrivateRoute><ScheduleTicket /></PrivateRoute>} />

                        {/* NOTE: Keep this route last. '*' is a fallback to check for existing urls */}
                        <Route path="*" element={<PrivateRoute><NotFound /></PrivateRoute>} />
                    </Routes>
                )
            case "admin":
                return (
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/reminder" element={<PrivateRoute><Reminder /></PrivateRoute>} />

                        <Route path="/article" element={<PrivateRoute><Article /></PrivateRoute>} />
                        <Route path="/article/create" element={<PrivateRoute><AddArticle /></PrivateRoute>} />
                        <Route path="/article/edit/:id" element={<PrivateRoute><EditArticle /></PrivateRoute>} />

                        <Route path="/articleType" element={<PrivateRoute><ArticleType /></PrivateRoute>} />
                        <Route path="/articleType/create" element={<PrivateRoute><CreateArticleType /></PrivateRoute>} />
                        <Route path="/articleType/edit/:id" element={<PrivateRoute><EditArticleType /></PrivateRoute>} />

                        <Route path="/certificate" element={<PrivateRoute><Certificate /></PrivateRoute>} />
                        <Route path="/certificate/create" element={<PrivateRoute><AddCertificate /></PrivateRoute>} />
                        <Route path="/certificate/edit/:id" element={<PrivateRoute><EditCertificate /></PrivateRoute>} />

                        <Route path="/customer" element={<PrivateRoute><Customer /></PrivateRoute>} />
                        <Route path="/customer/edit/:id" element={<PrivateRoute><EditCustomer /></PrivateRoute>} />
                        <Route path="/customer/create" element={<PrivateRoute><CreateCustomer /></PrivateRoute>} />

                        <Route path="/property" element={<PrivateRoute><Property /></PrivateRoute>} />
                        <Route path="/property/create" element={<PrivateRoute><CreateProperty /></PrivateRoute>} />
                        <Route path="/property/edit/:id" element={<PrivateRoute><EditProperty /></PrivateRoute>} />

                        <Route path="/ticket" element={<PrivateRoute><Ticket /></PrivateRoute>} />
                        <Route path="/ticket/edit/:id" element={<PrivateRoute><EditTicket /></PrivateRoute>} />
                        <Route path="/ticket/create/addCustomer" element={<PrivateRoute><AddTicketCustomer /></PrivateRoute>} />
                        <Route path="/ticket/create/addLocation" element={<PrivateRoute><AddTicketLocation /></PrivateRoute>} />
                        <Route path="/ticket/create/addCertificates" element={<PrivateRoute><AddTicketCertificate /></PrivateRoute>} />
                        <Route path="/ticket/create/scheduleTicket" element={<PrivateRoute><ScheduleTicket /></PrivateRoute>} />

                        <Route path="/user" element={<PrivateRoute><User /></PrivateRoute>} />
                        <Route path="/user/create" element={<PrivateRoute><CreateNewUser /></PrivateRoute>} />
                        <Route path="/user/edit/:id" element={<PrivateRoute><EditUser /></PrivateRoute>} />

                        {/* NOTE: Keep this route last. '*' is a fallback to check for existing urls */}
                        <Route path="*" element={<PrivateRoute><NotFound /></PrivateRoute>} />
                    </Routes>
                );
                break;
            default:
                return (
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="*" element={<PrivateRoute><NotFound /></PrivateRoute>} />
                    </Routes>
                );


        }
    }

    return (
         getRoutesByRole() 
    );
}
