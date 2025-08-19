import { MdAdminPanelSettings } from "react-icons/md";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminOrdersPage from "./admin-orders.page";
import AdminSalesPage from "./admin-sales.page";
import CreateProductPage from "./create-product-page";

export default function AdminDashboardPage() {
  return (
    <main className="px-4 lg:px-16 min-h-screen py-8 space-y-6">
      <h1 className="text-4xl font-bold flex items-center gap-2">
        <MdAdminPanelSettings />
        Admin Dashboard
      </h1>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">All Orders</TabsTrigger>
          <TabsTrigger value="analytics">Sales Dashboard</TabsTrigger>
          <TabsTrigger value="products">Create Products</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
            {/* Admin Orders Page */}
          <AdminOrdersPage />
        </TabsContent>
        <TabsContent value="analytics">
            {/* Admin Sales Page */}
          <AdminSalesPage />
        </TabsContent>
        <TabsContent value="products">
            {/* Create Product Page */}
          <CreateProductPage />
        </TabsContent>
      </Tabs>
    </main>
  );
}