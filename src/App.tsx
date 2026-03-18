import { Refine } from "@refinedev/core";

import routerProvider, { NavigateToResource, UnsavedChangesNotifier } from "@refinedev/react-router";

import { BrowserRouter, Routes, Route, Outlet } from "react-router";

import { RefineAiErrorComponent } from "@/components/catch-all";

import { useNotificationProvider } from "@/components/refine-ui/notification/use-notification-provider";

import { Toaster } from "@/components/refine-ui/notification/toaster";

import { Layout } from "@/components/refine-ui/layout/layout";

import { dataProvider } from "@/providers/data";

import ContentsListPage from "@/pages/contents/list";
import ContentsCreatePage from "@/pages/contents/create";
import ContentsEditPage from "@/pages/contents/edit";
import BundlesListPage from "@/pages/bundles/list";
import BundlesCreatePage from "@/pages/bundles/create";
import BundlesEditPage from "@/pages/bundles/edit";
import ViewBundlesPage from "./pages/view-bundles/view-bundles";

const App = () => {
  return (
    <BrowserRouter>
      <Refine
        routerProvider={routerProvider}
        dataProvider={dataProvider}
        notificationProvider={useNotificationProvider}
        options={{
          title: {
            text: "",
            icon: (
              <img
                src="/awg_logo.png"
                alt="AWG Logo"
                className="h-12 w-12 object-contain"
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
          {
            name: "view-bundles",
            list: "/view-bundles",
            meta: {
              label: "Bundles",
            },
          },
        ]}>
        <Routes>
          <Route
            element={
              <Layout >
                <Outlet />
              </Layout>
            }>
            <Route index element={<NavigateToResource resource="contents" />} />
            <Route path="/contents" element={<ContentsListPage />} />
            <Route path="/contents/create" element={<ContentsCreatePage />} />
            <Route path="/contents/edit/:id" element={<ContentsEditPage />} />
            <Route path="/bundles" element={<BundlesListPage />} />
            <Route path="/bundles/create" element={<BundlesCreatePage />} />
            <Route path="/bundles/edit/:id" element={<BundlesEditPage />} />
            <Route path="/view-bundles" element={<ViewBundlesPage />} />
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
