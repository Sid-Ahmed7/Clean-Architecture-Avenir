"use client";

import { withAdminProtection } from "@/components/auth/withRoleProtection";

function AdminPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Administration</h1>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Panneau d'administration</h2>
        <p className="text-gray-700 mb-4">
          Cette page est accessible uniquement aux administrateurs du système.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-800 mb-2">Gestion des utilisateurs</h3>
            <p className="text-sm text-blue-600">Gérer tous les utilisateurs du système</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-800 mb-2">Paramètres système</h3>
            <p className="text-sm text-green-600">Configurer les paramètres globaux</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-800 mb-2">Journaux d'audit</h3>
            <p className="text-sm text-purple-600">Consulter les journaux d'activité</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Protect this page so only ADMIN users can access it
// If a non-admin user tries to access this page, they will be redirected to the dashboard
export default withAdminProtection("/dashboard")(AdminPage);