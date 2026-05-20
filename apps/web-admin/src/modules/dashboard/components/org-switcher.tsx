import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { authClient, useSession } from "@/lib/auth-client";

interface Org {
  id: string;
  name: string;
  slug: string;
}

export function OrgSwitcher() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orgs, setOrgs] = useState<Org[]>([]);

  const activeOrgId = session?.session?.activeOrganizationId;

  useEffect(() => {
    async function loadOrgs() {
      const res = await authClient.organization.list();
      if (res.data) {
        setOrgs(res.data as Org[]);
      }
    }
    loadOrgs();
  }, []);

  async function switchOrg(orgId: string) {
    setLoading(true);
    await authClient.organization.setActive({ organizationId: orgId });
    setLoading(false);
    setOpen(false);
    globalThis.window.location.reload();
  }

  const activeName = activeOrgId
    ? (orgs.find((o) => o.id === activeOrgId)?.name ?? "Select cafe")
    : "Select cafe";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50 w-full"
      >
        <span className="truncate flex-1 text-left">{activeName}</span>
        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full min-w-[200px] rounded-md border border-gray-200 bg-white shadow-lg">
          {orgs.map((org) => (
            <button
              key={org.id}
              type="button"
              onClick={() => switchOrg(org.id)}
              disabled={loading}
              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 text-left"
            >
              {org.id === activeOrgId && (
                <Check className="h-4 w-4 text-indigo-600" />
              )}
              <span className={org.id === activeOrgId ? "font-medium" : ""}>
                {org.name}
              </span>
            </button>
          ))}

          {orgs.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">No cafes yet</div>
          )}
        </div>
      )}
    </div>
  );
}
