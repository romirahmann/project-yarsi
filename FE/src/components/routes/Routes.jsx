import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Layout } from "../layouts/Layouts";
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../auth/Login";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { Userpage } from "../pages/Userpage";
import { Proses } from "../pages/Proses";
import { EmployeePage } from "../pages/EmployeePage";
import { CandraPage } from "../pages/CandraPage";
import { MrPage } from "../pages/MrPage";
import { UpdatePage } from "../pages/UpdatePage";
import { ScanPage } from "../pages/ScanPage";
import { TargetsPage } from "../pages/Targets";
import { CheecksheetPage } from "../pages/CheecksheetPage";
import { KcpPage } from "../pages/KcpPage";
import { NonaktifPage } from "../pages/NonaktifPage";
import { LogPage } from "../pages/LogPage";

const rootRoute = createRootRoute();

// Layout utama untuk halaman tertentu
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => <Login />,
});

const dashboardPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  component: () => (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  ),
});
const userPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/data-users",
  component: () => (
    <ProtectedRoute>
      <Userpage />
    </ProtectedRoute>
  ),
});
const prosesPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/data-proses",
  component: () => (
    <ProtectedRoute>
      <Proses />
    </ProtectedRoute>
  ),
});
const employeePage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/data-karyawan",
  component: () => (
    <ProtectedRoute>
      <EmployeePage />
    </ProtectedRoute>
  ),
});
const candraPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/data-candra",
  component: () => (
    <ProtectedRoute>
      <CandraPage />
    </ProtectedRoute>
  ),
});

const mrPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/data-mr",
  component: () => (
    <ProtectedRoute>
      <MrPage />
    </ProtectedRoute>
  ),
});
const updatePage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/update-database",
  component: () => (
    <ProtectedRoute>
      <UpdatePage />
    </ProtectedRoute>
  ),
});
const scanPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/scanning",
  component: () => (
    <ProtectedRoute>
      <ScanPage />
    </ProtectedRoute>
  ),
});

const targetPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/targets",
  component: () => (
    <ProtectedRoute>
      <TargetsPage />
    </ProtectedRoute>
  ),
});
const checkPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/checksheet",
  component: () => (
    <ProtectedRoute>
      <CheecksheetPage />
    </ProtectedRoute>
  ),
});

const kcpPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/data-kcp",
  component: () => (
    <ProtectedRoute>
      <KcpPage />
    </ProtectedRoute>
  ),
});

const nonaktifPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/nonaktifMR",
  component: () => (
    <ProtectedRoute>
      <NonaktifPage />
    </ProtectedRoute>
  ),
});
const logPage = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/logpage",
  component: () => (
    <ProtectedRoute>
      <LogPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  layoutRoute.addChildren([
    dashboardPage,
    userPage,
    prosesPage,
    employeePage,
    candraPage,
    mrPage,
    updatePage,
    scanPage,
    targetPage,
    checkPage,
    kcpPage,
    nonaktifPage,
    logPage,
  ]),
  loginRoute,
]);

export const router = createRouter({
  routeTree,
});
