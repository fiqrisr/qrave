import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboard, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useSession } from "@/lib/auth-client";

export const Route = createFileRoute("/_dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  const { data: session } = useSession();
  const activeOrg = session?.session?.activeOrganizationId;
  const menuUrl = activeOrg
    ? `http://localhost:3000/api/m/${activeOrg}/menu`
    : "";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8 text-indigo-600" />
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick stats placeholder */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Welcome back</h2>
          <p className="mt-1 text-gray-500">
            Manage your cafe menu and kitchen orders from here.
          </p>
        </div>

        {/* QR Code card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-4">
            <QrCode className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">
              Menu QR Code
            </h2>
          </div>

          {activeOrg ? (
            <div className="flex flex-col items-center gap-4">
              <QRCodeSVG value={menuUrl} size={180} />
              <p className="text-xs text-gray-500 text-center break-all">
                {menuUrl}
              </p>
            </div>
          ) : (
            <p className="text-gray-500">
              Select a cafe to generate a QR code.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
