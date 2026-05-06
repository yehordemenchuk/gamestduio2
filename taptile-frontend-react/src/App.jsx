import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { SessionModal } from "./components/SessionModal.jsx";
import { CommunityPage } from "./pages/CommunityPage.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { PlayPage } from "./pages/PlayPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/play" element={<PlayPage />} />
            <Route path="/community" element={<CommunityPage />} />
          </Route>
        </Route>
      </Routes>
      <SessionModal />
    </>
  );
}
