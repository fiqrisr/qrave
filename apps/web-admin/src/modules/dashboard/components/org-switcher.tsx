import { Button, ScrollArea, Text, UnstyledButton } from "@qrave/ui";
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
    <div style={{ position: "relative" }}>
      <UnstyledButton
        w="100%"
        p={8}
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          border: "1px solid var(--mantine-color-gray-3)",
          borderRadius: "var(--mantine-radius-md)",
        }}
      >
        <Text size="sm" truncate miw={0} style={{ flex: 1 }}>
          {activeName}
        </Text>
        <ChevronsUpDown size={16} style={{ opacity: 0.5, flexShrink: 0 }} />
      </UnstyledButton>

      {open && (
        <ScrollArea
          style={{
            position: "absolute",
            left: 0,
            top: "100%",
            zIndex: 50,
            marginTop: 4,
            minWidth: 200,
            width: "100%",
            border: "1px solid var(--mantine-color-gray-2)",
            borderRadius: "var(--mantine-radius-md)",
            backgroundColor: "var(--mantine-color-white)",
            boxShadow: "var(--mantine-shadow-md)",
          }}
        >
          {orgs.map((org) => (
            <Button
              key={org.id}
              variant="subtle"
              fullWidth
              size="compact-sm"
              disabled={loading}
              onClick={() => switchOrg(org.id)}
              styles={{
                root: { justifyContent: "flex-start" },
                inner: { justifyContent: "flex-start" },
              }}
              leftSection={
                org.id === activeOrgId ? <Check size={14} /> : undefined
              }
            >
              <Text size="sm" fw={org.id === activeOrgId ? 600 : 400}>
                {org.name}
              </Text>
            </Button>
          ))}

          {orgs.length === 0 && (
            <Text size="sm" c="dimmed" p={8}>
              No cafes yet
            </Text>
          )}
        </ScrollArea>
      )}
    </div>
  );
}
