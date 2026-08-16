import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import AppLayout from './ui/AppLayout';
import NotFound from './ui/NotFound';
import Home from './pages/Home';
import Products from './pages/Products';
import Product from './pages/Product';
import Login from './pages/Login';
import ProtectedRoute from './ui/ProtectedRoute';
import Signup from './pages/Signup';
import PublicRoute from './ui/PublicRoute';
import VerifyEmailPromptPage from './pages/VerifyEmailPromptPage';
import Account from './pages/Account';
import ProfileSection from './features/account/ProfileSection';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Addresses from './features/account/Addresses';
import UpdatePassword from './features/account/UpdatePassword';
import ProductsTable from './features/adminPanel/products/ProductsTable';
import Admin from './pages/Admin';
import UsersTable from './features/adminPanel/users/UsersTable';
import CategoriesTable from './features/adminPanel/categories/CategoriesTable';
import SubCategoriesTable from './features/adminPanel/subcategories/SubCategoriesTable';
import OrdersTable from './features/adminPanel/orders/OrdersTable';
import UpdateProduct from './features/adminPanel/products/UpdateProduct';
import ForgotPasswordPage from './pages/ForgotPassword';
import VerifyResetCodePage from './pages/VerifyResetCodePage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import UserOrders from './features/account/UserOrders';
import AdminProtectedRoute from './ui/AdminProtectedRoute';
import Store from './pages/Store';
import Contact from './pages/Contact';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Search from './pages/Search';
import ScrollToTop from './ui/ScrollTop';
import CheckoutPage from './pages/CheckoutPage';
import Dashboard from './features/adminPanel/dashboard/Dashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false, // or a custom retry function
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}

      <BrowserRouter>
        <ScrollToTop />

        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            {/* auth */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/verifyEmailPrompt"
              element={
                <PublicRoute>
                  <VerifyEmailPromptPage />
                </PublicRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicRoute>
                  <ForgotPasswordPage />
                </PublicRoute>
              }
            />
            <Route
              path="/verify-reset-code"
              element={
                <PublicRoute>
                  <VerifyResetCodePage />
                </PublicRoute>
              }
            />
            <Route
              path="/reset-password"
              element={
                <PublicRoute>
                  <ResetPasswordPage />
                </PublicRoute>
              }
            />
            {/* products */}
            <Route path="/products" element={<Products />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/search" element={<Search />} />

            {/* cart & wishlist */}
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<CheckoutPage />} />
            </Route>

            {/* account */}
            <Route element={<ProtectedRoute />}>
              <Route path="/account" element={<Account />}>
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<ProfileSection />} />
                <Route path="password" element={<UpdatePassword />} />
                <Route path="addresses" element={<Addresses />} />
                <Route path="orders" element={<UserOrders />} />
              </Route>
            </Route>

            {/* admin */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<Admin />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ProductsTable />} />
                <Route path="products/:productId" element={<UpdateProduct />} />
                <Route path="categories" element={<CategoriesTable />} />
                <Route path="subcategories" element={<SubCategoriesTable />} />
                <Route path="orders" element={<OrdersTable />} />
                <Route path="users" element={<UsersTable />} />
              </Route>
            </Route>

            <Route path="pages/store" element={<Store />} />
            <Route path="pages/contact" element={<Contact />} />
            <Route path="pages/shipping" element={<Shipping />} />
            <Route path="pages/returns" element={<Returns />} />
            <Route path="pages/privacy" element={<Privacy />} />
            <Route path="pages/terms" element={<Terms />} />
            <Route path="pages/cookies" element={<Cookies />} />
          </Route>

          {/* fallback route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: '8px' }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: '16px',
            maxWidth: '500px',
            padding: '16px 24px',
            backgroundColor: '#ffffff', // fully opaque white
            color: '#333333',
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
