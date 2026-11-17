import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./AuthProvider";
import { LanguageProvider } from "./LanguageContext";
import { LoginModal } from "./LoginModal";

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <RouterProvider router={router} />
        <LoginModal />
      </AuthProvider>
    </LanguageProvider>
  );
}
