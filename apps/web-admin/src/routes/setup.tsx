import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/setup")({
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      throw redirect({ to: "/login" });
    }
    // Already has an active org — go to dashboard
    if (session.data.session.activeOrganizationId) {
      throw redirect({ to: "/" });
    }
  },
  component: SetupPage,
});

function SetupPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCreating(true);

    try {
      const res = await authClient.organization.create({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
      });

      if (res.error) {
        setError(res.error.message ?? "Failed to create cafe");
        return;
      }

      // Activate the new org and redirect
      if (res.data?.id) {
        await authClient.organization.setActive({
          organizationId: res.data.id,
        });
      }

      globalThis.window.location.href = "/";
    } catch {
      setError("Failed to create cafe");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md p-8 bg-white rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold text-center">Create Your Cafe</h2>
        <p className="text-center text-gray-500 text-sm">
          You need a cafe to get started. Create one now.
        </p>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <div>
          <label
            htmlFor="org-name"
            className="block text-sm font-medium text-gray-700"
          >
            Cafe Name
          </label>
          <input
            id="org-name"
            type="text"
            required
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label
            htmlFor="org-slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug
          </label>
          <input
            id="org-slug"
            type="text"
            placeholder={name.toLowerCase().replace(/\s+/g, "-")}
            value={slug}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSlug(e.target.value)
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <p className="mt-1 text-xs text-gray-400">
            Auto-generated from name if left empty
          </p>
        </div>

        <button
          type="submit"
          disabled={creating}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-white font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {creating ? "Creating..." : "Create Cafe"}
        </button>
      </form>
    </div>
  );
}
