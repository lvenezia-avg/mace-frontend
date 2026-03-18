import { Refine, Authenticated } from "@refinedev/core";

import routerProvider, { NavigateToResource, UnsavedChangesNotifier } from "@refinedev/react-router";

import { BrowserRouter, Routes, Route, Outlet } from "react-router";

import { RefineAiErrorComponent } from "@/components/catch-all";

import { useNotificationProvider } from "@/components/refine-ui/notification/use-notification-provider";

import { Toaster } from "@/components/refine-ui/notification/toaster";

import { Layout } from "@/components/refine-ui/layout/layout";

import { dataProvider } from "@/providers/data";
import { authProvider } from "@/providers/auth";

import ContentsListPage from "@/pages/contents/list";
import ContentsCreatePage from "@/pages/contents/create";
import ContentsEditPage from "@/pages/contents/edit";
import BundlesListPage from "@/pages/bundles/list";
import BundlesCreatePage from "@/pages/bundles/create";
import BundlesEditPage from "@/pages/bundles/edit";
import LoginPage from "@/pages/login/index";

const App = () => {
  return (
    <BrowserRouter>
      <Refine
        routerProvider={routerProvider}
        dataProvider={dataProvider}
        authProvider={authProvider}
        notificationProvider={useNotificationProvider}
        options={{
          title: {
            text: "",
            icon: (
              <img
                src="/awg_logo.png"
                alt="AWG Logo"
                className="h-16 w-16 object-contain"
                style={{
                  transform: "scale(1.6)",
                  margin: "-8px",
                }}
              />
            ),
          },
        }}
        resources={[
          {
            name: "contents",
            list: "/contents",
            create: "/contents/create",
            edit: "/contents/edit/:id",
            meta: {
              label: "Contents",
            },
          },
          {
            name: "bundles",
            list: "/bundles",
            create: "/bundles/create",
            edit: "/bundles/edit/:id",
            meta: {
              label: "Bundles",
            },
          },
        ]}>
        <Routes>
          {/* Auth routes — if already authenticated, redirect away */}
          <Route
            element={
              <Authenticated key="auth-pages" fallback={<Outlet />}>
                <NavigateToResource resource="contents" />
              </Authenticated>
            }
          >
            <Route path="/login" element={<LoginPage />} />
          </Route>

          {/* Protected routes — if not authenticated, redirect to /login */}
          <Route
            element={
              <Authenticated key="protected-routes">
                <Layout>
                  <Outlet />
                </Layout>
              </Authenticated>
            }
          >
            <Route index element={<NavigateToResource resource="contents" />} />
            <Route path="/contents" element={<ContentsListPage />} />
            <Route path="/contents/create" element={<ContentsCreatePage />} />
            <Route path="/contents/edit/:id" element={<ContentsEditPage />} />
            <Route path="/bundles" element={<BundlesListPage />} />
            <Route path="/bundles/create" element={<BundlesCreatePage />} />
            <Route path="/bundles/edit/:id" element={<BundlesEditPage />} />
            <Route path="*" element={<RefineAiErrorComponent />} />
          </Route>
        </Routes>
        <Toaster />
        <UnsavedChangesNotifier />
      </Refine>
    </BrowserRouter>
  );
};

export default App;
