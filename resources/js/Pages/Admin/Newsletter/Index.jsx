import AdminLayout from "../../../Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";

export default function NewsletterIndex({ subscribers, total, active }) {
    const [search, setSearch] = useState("");

    const filtered = subscribers.filter((s) =>
        s.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm("Supprimer cet abonné ?")) {
            router.delete(`/admin/newsletter/${id}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="Newsletter — Admin" />
            <div className="p-6 max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Newsletter
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {active} abonnés actifs sur {total} inscrits
                        </p>
                    </div>
                    <a
                        href="/admin/newsletter/export"
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                            />
                        </svg>
                        Exporter CSV
                    </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Total inscrits
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                            {total}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Actifs
                        </p>
                        <p className="text-2xl font-bold text-emerald-600">
                            {active}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                            Désinscrits
                        </p>
                        <p className="text-2xl font-bold text-gray-400">
                            {total - active}
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Rechercher un email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <svg
                        className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                    </svg>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    {filtered.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            <svg
                                className="w-12 h-12 mx-auto mb-3 opacity-30"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                                />
                            </svg>
                            <p className="text-sm font-medium">
                                Aucun abonné trouvé
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Email
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Langue
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Statut
                                    </th>
                                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Date
                                    </th>
                                    <th className="px-4 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {sub.email}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 uppercase text-xs">
                                            {sub.locale}
                                        </td>
                                        <td className="px-4 py-3">
                                            {sub.is_active ? (
                                                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                                    Actif
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5 rounded-full">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                    Désinscrit
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-xs">
                                            {new Date(
                                                sub.subscribed_at
                                            ).toLocaleDateString("fr-CH")}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() =>
                                                    handleDelete(sub.id)
                                                }
                                                className="text-red-500 hover:text-red-700 text-xs font-medium transition-colors"
                                            >
                                                Supprimer
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
