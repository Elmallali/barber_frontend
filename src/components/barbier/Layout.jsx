// src/layouts/BarbierLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { TopNavigation } from "../../components/barbier/TopNavigation";
import { ViewAllClientsModal } from "../../components/barbier/ViewAllClientsModal";

export function BarbierLayout() {
  const [showViewAll, setShowViewAll] = useState(false);
  const clients = useSelector((state) => state.queue.clients);

  return (
    <div className="min-h-screen bg-[#f9fafb] font-['Inter',sans-serif]">
      <TopNavigation
        onNavigate={(page) =>
          window.dispatchEvent(
            new CustomEvent("navigateBarbier", { detail: page })
          )
        }
        onOpenViewAll={() => setShowViewAll(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <ViewAllClientsModal
        isOpen={showViewAll}
        onClose={() => setShowViewAll(false)}
        clients={clients}
      />
    </div>
  );
}
