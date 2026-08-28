import React from "react";
import { Bed, Bath, Maximize, MoreVertical, Eye, MessageSquare } from "lucide-react";

const SellerListingTable = ({ properties, activeTab, onTabChange, stats }) => {
  const tabs = [
    { name: "All", key: "ALL", count: stats?.total_properties || 0 },
    { name: "Active", key: "ACTIVE", count: stats?.active_count || 0 },
    { name: "Pending", key: "PENDING", count: stats?.pending_count || 0 },
    { name: "Draft", key: "DRAFT", count: stats?.draft_count || 0 },
    { name: "Sold/Rented", key: "SOLD_RENTED", count: stats?.sold_rented_count || 0 },
  ];

  const filteredProperties = properties.filter((item) => {
    if (activeTab === "ALL") return true;
    return item.status === activeTab;
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6 shadow-sm">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-4">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {tab.name} ({tab.count})
          </button>
        ))}
      </div>

      {/* Property Cards */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm">
          No properties found in this tab.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => {
            const coverImage =
              property.images?.find((img) => img.is_cover)?.url ||
              property.images?.[0]?.url ||
              property.cover_image_url ||
              "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80";

            return (
              <div
                key={property.id}
                className="flex flex-col md:flex-row items-center gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow bg-white"
              >
                <img
                  src={coverImage}
                  alt={property.title}
                  className="w-full md:w-56 h-36 object-cover rounded-lg bg-slate-100"
                />

                <div className="flex-1 space-y-2 w-full">
                  <div>
                    <div className="text-xl font-bold text-slate-900">
                      ${property.price}{" "}
                      <span className="text-xs font-normal text-slate-500">
                        / {property.price_unit?.toLowerCase()}
                      </span>
                    </div>
                    <h2 className="text-base font-semibold text-slate-800">{property.title}</h2>
                    <p className="text-xs text-slate-500">
                      {property.address || `${property.district || ""}, ${property.province || ""}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Bed className="w-4 h-4 text-slate-400" /> {property.bedrooms || 0} Bed
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="w-4 h-4 text-slate-400" /> {property.bathrooms || 0} Bath
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-4 h-4 text-slate-400" /> {property.size_sqm || 0} m²
                    </span>
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                      property.status === "ACTIVE"
                        ? "bg-emerald-100 text-emerald-700"
                        : property.status === "PENDING"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {property.status}
                  </span>

                  <div className="text-right text-[11px] text-slate-500 space-y-0.5">
                    <div className="flex items-center gap-1 justify-end">
                      <Eye className="w-3 h-3" /> Views:{" "}
                      <span className="font-semibold text-slate-700">{property.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 justify-end">
                      <MessageSquare className="w-3 h-3" /> Inquiries:{" "}
                      <span className="font-semibold text-slate-700">{property.inquiry_count || 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button className="px-3 py-1 border border-blue-600 text-blue-600 hover:bg-blue-50 text-xs font-medium rounded-md transition-colors">
                      View Listing
                    </button>
                    <button className="p-1 text-slate-400 hover:text-slate-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerListingTable;