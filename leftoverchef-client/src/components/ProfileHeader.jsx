// client/src/components/ProfileHeader.jsx
import React from 'react';

// Simple header: avatar, name, email, stats, edit button if owner.
// Style using tailwind classes (if you use tailwind). Replace classes if not.
export default function ProfileHeader({ profile, isOwner = false, onEdit }) {
  const { name, email, avatarUrl, joinedAt, stats } = profile || {};

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 flex items-center gap-6">
      <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
        {avatarUrl ? (
          // handle images that might be stored as imageUrl vs avatarUrl
          <img src={avatarUrl} alt={`${name} avatar`} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
            {name ? name.charAt(0).toUpperCase() : 'U'}
          </div>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{name || 'Unnamed'}</h1>
            {email && <div className="text-sm text-gray-600">{email}</div>}
            {joinedAt && (
              <div className="text-xs text-gray-400 mt-1">Joined {new Date(joinedAt).toLocaleDateString()}</div>
            )}
          </div>

          {isOwner && (
            <div>
              <button
                onClick={onEdit}
                className="px-3 py-1 rounded-md border shadow-sm hover:bg-gray-50"
              >
                Edit profile
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox label="Total listings" value={stats?.totalListings ?? 0} />
          <StatBox label="Available now" value={stats?.availableNow ?? 0} />
          <StatBox label="Claimed" value={stats?.claimed ?? 0} />
          <StatBox label="Meals donated" value={stats?.mealsDonated ?? 0} />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-gray-50 p-3 rounded-md text-center">
      <div className="text-xl font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
