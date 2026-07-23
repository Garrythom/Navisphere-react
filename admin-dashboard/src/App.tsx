import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";
import { LoginPage } from "@/pages/LoginPage";
import { OverviewPage } from "@/pages/OverviewPage";
import { OrdersListPage } from "@/pages/OrdersListPage";
import { OrderFormPage } from "@/pages/OrderFormPage";
import { OrderDetailPage } from "@/pages/OrderDetailPage";
import { UpdateEditPage } from "@/pages/UpdateEditPage";
import { MessagesListPage } from "@/pages/MessagesListPage";
import { MessageDetailPage } from "@/pages/MessageDetailPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/orders" element={<OrdersListPage />} />
              <Route path="/orders/new" element={<OrderFormPage />} />
              <Route path="/orders/:id" element={<OrderDetailPage />} />
              <Route path="/orders/:id/updates/:updateId/edit" element={<UpdateEditPage />} />
              <Route path="/messages" element={<MessagesListPage />} />
              <Route path="/messages/:id" element={<MessageDetailPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
