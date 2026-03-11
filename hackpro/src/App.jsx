// src/App.jsx
import React, {
  useEffect,
  useRef,
  useState,
  Suspense,
  useCallback,
  lazy,
  memo,
  Component,
} from "react";
import {
  Routes,
  Route,
  useLocation,
  BrowserRouter,
  useNavigate,
  Navigate,
} from "react-router-dom";
import PropTypes from "prop-types";
import AOS from "aos";
import "aos/dist/aos.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { ThemeProvider } from "./components/profile/ThemeProvider";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./components/global.css";

// ─── Lazy Components ─────────────────────────────────────────────────
const AuthPage       = lazy(() => import("./components/LoginModal"));
const Home           = lazy(() => import("./components/Home"));
const Menu           = lazy(() => import("./components/Menu"));
const AboutUs        = lazy(() => import("./components/AboutUs"));
const ContactUs      = lazy(() => import("./components/ContactUs"));
const PartnerPage    = lazy(() => import("./components/PartnerPage"));
const Checkout       = lazy(() => import("./components/Checkout"));
const OrderSuccess   = lazy(() => import("./components/OrderSuccess"));
const Profile        = lazy(() => import("./components/profile/Profile"));
const ChangePassword = lazy(() => import("./components/ChangePassword"));
const Orders         = lazy(() => import("./components/Orders"));

// ─── Route → Page Title + Description Map ────────────────────────────
const APP_NAME = "Flavor Fleet"; // ← change to your brand name

const PAGE_META = {
  "/":                { title: "Home",             description: "Welcome to our restaurant. Order fresh food online." },
  "/menu":            { title: "Menu",             description: "Browse our full menu and place your order." },
  "/aboutus":         { title: "About Us",         description: "Learn more about who we are and our story." },
  "/contact-us":      { title: "Contact Us",       description: "Get in touch with us for any queries." },
  "/partner":         { title: "Partner With Us",  description: "Join us as a delivery or business partner." },
  "/login":           { title: "Sign In",          description: "Sign in to your account." },
  "/checkout":        { title: "Checkout",         description: "Complete your order." },
  "/order-success":   { title: "Order Placed!",    description: "Your order has been placed successfully." },
  "/profile":         { title: "My Profile",       description: "Manage your account and preferences." },
  "/change-password": { title: "Change Password",  description: "Update your account password." },
  "/orders":          { title: "My Orders",        description: "View your order history." },
  "/admin/dashboard": { title: "Admin Dashboard",  description: "Admin control panel." },
  "/admin/profile":   { title: "Admin Profile",    description: "Manage admin account." },
  "/access-denied":   { title: "Access Denied",    description: "" },
};

// ─── Path Config ─────────────────────────────────────────────────────
const HIDE_HEADER_PATHS = new Set([
  "/login",
  "/checkout",
  "/order-success",
  "/profile",
  "/change-password",
  "/orders",
  "/admin/profile",
  "/admin/dashboard",
]);

const SHOW_FOOTER_PATHS = new Set(["/", "/aboutus", "/contact-us", "/partner"]);

// ─── Error Boundary ──────────────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Wire up Sentry or your error tracker here in production:
    // Sentry.captureException(error, { extra: info });
    console.error("App crashed:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="fullpage-center">
          <h1 style={{ fontSize: "4rem", margin: 0 }}>💥</h1>
          <h2>Something went wrong</h2>
          <p>An unexpected error occurred. Our team has been notified.</p>
          <button className="btn-dark" onClick={this.handleReset}>
            Return to Home
          </button>
          {import.meta.env.DEV && (
            <pre className="error-details">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

ErrorBoundary.propTypes = { children: PropTypes.node.isRequired };

// ─── Static Pages (memoized) ─────────────────────────────────────────
const NotFound = memo(() => (
  <div className="fullpage-center">
    <h1 className="error-code">404</h1>
    <h2>Page Not Found</h2>
    <p>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
    <button className="btn-dark" onClick={() => window.history.back()}>
      Go Back
    </button>
  </div>
));
NotFound.displayName = "NotFound";

const AccessDenied = memo(() => (
  <div className="fullpage-center">
    <h1 style={{ fontSize: "4rem", margin: 0 }}>⚠️</h1>
    <h2 style={{ color: "#dc2626" }}>Access Denied</h2>
    <p>You don&apos;t have permission to access this page. Admin privileges required.</p>
    <button className="btn-dark" onClick={() => window.history.back()}>
      Go Back
    </button>
  </div>
));
AccessDenied.displayName = "AccessDenied";

const LoadingSpinner = memo(() => (
  <div className="fullpage-center" aria-live="polite" aria-busy="true">
    <div className="spinner" role="status">
      <span className="sr-only">Loading…</span>
    </div>
  </div>
));
LoadingSpinner.displayName = "LoadingSpinner";

// ─── Route Guards ────────────────────────────────────────────────────
function PublicRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user && location.pathname === "/login") {
    return <Navigate to="/" replace />;
  }
  return children;
}
PublicRoute.propTypes = { children: PropTypes.node.isRequired };

// Idiomatic React Router v6: declarative <Navigate> — no side-effect needed
function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
PrivateRoute.propTypes = { children: PropTypes.node.isRequired };

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user.role !== "ADMIN") {
    toast.error("Access denied. Admin privileges required.", {
      toastId: "admin-denied",
      autoClose: 4000,
    });
    return <Navigate to="/access-denied" replace />;
  }
  return children;
}
AdminRoute.propTypes = { children: PropTypes.node.isRequired };

// ─── Custom Hook: Page Meta (title + description per route) ──────────
function usePageMeta(pathname) {
  useEffect(() => {
    const meta = PAGE_META[pathname];
    document.title = meta ? `${meta.title} | ${APP_NAME}` : APP_NAME;

    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement("meta");
      descTag.setAttribute("name", "description");
      document.head.appendChild(descTag);
    }
    descTag.setAttribute("content", meta?.description ?? "");
  }, [pathname]);
}

// ─── Custom Hook: Scroll Management ──────────────────────────────────
function useScrollManagement(pathname) {
  const prevPathRef = useRef(null);

  useEffect(() => {
    prevPathRef.current = pathname;
    window.scrollTo({ top: 0, behavior: "smooth" });
    AOS.refresh();
  }, [pathname]);
}

// ─── Custom Hook: Idle Preload ────────────────────────────────────────
// Silently prefetches the most commonly visited pages during browser idle time
// so navigation feels instant for users.
function useIdlePreload() {
  useEffect(() => {
    if (!("requestIdleCallback" in window)) return;

    const modules = [
      () => import("./components/Menu"),
      () => import("./components/Home"),
      () => import("./components/profile/Profile"),
      () => import("./components/Orders"),
    ];

    const id = requestIdleCallback(
      () => modules.forEach((load) => load().catch(() => {})),
      { timeout: 4000 }
    );

    return () => cancelIdleCallback(id);
  }, []);
}

// ─── App Content ─────────────────────────────────────────────────────
function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const [shouldScrollToOffers, setShouldScrollToOffers] = useState(false);

  const showHeader = !HIDE_HEADER_PATHS.has(location.pathname);
  const showFooter = SHOW_FOOTER_PATHS.has(location.pathname);

  usePageMeta(location.pathname);
  useScrollManagement(location.pathname);
  useIdlePreload();

  // Offers scroll side-effect
  useEffect(() => {
    if (shouldScrollToOffers && location.pathname === "/menu" && menuRef.current) {
      const timer = setTimeout(() => {
        menuRef.current.scrollToOffers?.();
        setShouldScrollToOffers(false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, shouldScrollToOffers]);

  const handleOffersClick = useCallback(() => {
    if (location.pathname !== "/menu") {
      setShouldScrollToOffers(true);
      navigate("/menu", { state: { scrollToOffers: true } });
    } else {
      menuRef.current?.scrollToOffers?.();
    }
  }, [location.pathname, navigate]);

  const handleAuthSuccess = useCallback(() => {
    const intended = location.state?.from?.pathname || "/";
    navigate(intended, { replace: true, state: { authSuccess: true } });
  }, [location.state, navigate]);

  return (
    <div className="app-container">
      {showHeader && <Header onOffersClick={handleOffersClick} />}

      {/* id + tabIndex for "skip to content" accessibility links */}
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public */}
            <Route path="/"           element={<PublicRoute><Home /></PublicRoute>} />
            <Route path="/aboutus"    element={<PublicRoute><AboutUs /></PublicRoute>} />
            <Route path="/contact-us" element={<PublicRoute><ContactUs /></PublicRoute>} />
            <Route path="/partner"    element={<PublicRoute><PartnerPage /></PublicRoute>} />

            {/* Auth */}
            <Route path="/login" element={<AuthPage onSuccess={handleAuthSuccess} />} />

            {/* Protected */}
            <Route path="/menu"             element={<PrivateRoute><Menu ref={menuRef} /></PrivateRoute>} />
            <Route path="/checkout"         element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/order-success"    element={<PrivateRoute><OrderSuccess /></PrivateRoute>} />
            <Route path="/profile"          element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/change-password"  element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
            <Route path="/orders"           element={<PrivateRoute><Orders /></PrivateRoute>} />

            {/* Admin */}
            <Route path="/admin/profile"    element={<AdminRoute><Profile adminView /></AdminRoute>} />
            <Route path="/admin/dashboard"  element={<AdminRoute><Profile adminView /></AdminRoute>} />

            {/* Misc */}
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      {showFooter && <Footer />}

      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
        role="alert"
        aria-live="polite"
        transition={Slide}
        style={{ zIndex: 10000, marginTop: "60px" }}
      />
    </div>
  );
}

// ─── Root ────────────────────────────────────────────────────────────
export default function App() {
  const resizeTimer = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
      easing: "ease-out-cubic",
      mirror: false,
      disable: window.innerWidth < 768,
      throttleDelay: 99,
    });

    const handleResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(() => {
        AOS.refresh({ disable: window.innerWidth < 768 });
      }, 150);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) AOS.refresh();
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(resizeTimer.current);
    };
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export { AppContent };
