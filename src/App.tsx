import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login/Login";
import Signup from "./signup/Signup";
import Main from "./pages/MainPage";
import Dashboard from "./pages/Dashboard";
import NewSale from "./pages/NewSale";
import Products from "./pages/Products";
import Reports from "./pages/Reports/Reports";
import Customers from "./pages/Customers/Customers";
import Settings from "./pages/Settings";
import CustomersGeneral from "./pages/Customers/CustomersGeneral";
import CustomersPayments from "./pages/Customers/CustomersPayments";
import ReportsGeneral from "./pages/Reports/ReportsGeneral";
import ReportsSales from "./pages/Reports/ReportsSales";
import ReportsProducts from "./pages/Reports/ReportsProducts";
import ReportsCustomers from "./pages/Reports/ReportsCustomers";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/Signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route path="/main" element={<Main />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="newsale" element={<NewSale />} />
          <Route path="products" element={<Products />} />
          <Route path="reports" element={<Reports />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<ReportsGeneral />} />
            <Route path="sales" element={<ReportsSales />} />
            <Route path="products" element={<ReportsProducts />} />
            <Route path="customers" element={<ReportsCustomers />} />
          </Route>
          <Route path="customers" element={<Customers />}>
            <Route index element={<Navigate to="general" replace />} />
            <Route path="general" element={<CustomersGeneral />} />
            <Route path="payments" element={<CustomersPayments />} />
          </Route>
          <Route path="settings" element={<Settings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
