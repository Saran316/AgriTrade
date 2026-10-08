import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Categories from "./pages/Categories";
import Crops from "./pages/Crops";
import Orders from "./pages/Orders";
import CropDetails from "./pages/CropDetails";
import Profile from "./pages/Profile";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import background from "./assets/agritrade-background.jpg";

function App() {
    return (
        <div
            className="min-h-screen bg-cover bg-fixed bg-center"
            style={{
                backgroundImage: `
         
          url(${background})
        `,
            }}
        >
            <Navbar />

            <main className="min-h-[calc(100vh-72px)]">
                <Routes>

                    {/* Public Pages */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Pages */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/categories"
                        element={
                            <ProtectedRoute>
                                <Categories />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/crops"
                        element={
                            <ProtectedRoute>
                                <Crops />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/crops/:id"
                        element={
                            <ProtectedRoute>
                                <CropDetails />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                </Routes>
            </main>
        </div>
    );
}

export default App;