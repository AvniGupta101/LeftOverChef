// client/src/pages/ProfilePage.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import ProfileHeader from '../components/ProfileHeader';
import DonorListingsList from '../components/DonorListingsList';
import { AuthContext } from '../context/AuthContext';

export default function ProfilePage() {
  const { id } = useParams(); // profile id
  const { user: authUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingListings, setLoadingListings] = useState(true);
  const [error, setError] = useState(null);

  const isOwner = authUser && authUser._id === id;

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      setLoadingProfile(true);
      setError(null);
      try {
        const res = await api.get(`/users/${id}`);
        if (!mounted) return;
        setProfile(res.data);
      } catch (err) {
        console.error('Failed to load profile', err);
        setError(err?.response?.data?.message || 'Failed to load profile');
      } finally {
        if (mounted) setLoadingProfile(false);
      }
    }

    async function fetchListings() {
      setLoadingListings(true);
      try {
        const res = await api.get(`/users/${id}/listings?limit=50`);
        if (!mounted) return;
        setListings(res.data.data || []);
        setMeta(res.data.meta || null);
      } catch (err) {
        console.error('Failed to load listings', err);
      } finally {
        if (mounted) setLoadingListings(false);
      }
    }

    fetchProfile();
    fetchListings();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loadingProfile) return <div className="p-6">Loading profile…</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!profile) return <div className="p-6">Profile not found</div>;

  return (
    <div className="max-w-5xl mx-auto p-4">
      <ProfileHeader
        profile={profile}
        isOwner={isOwner}
        onEdit={() => {
          // If you implement EditProfileModal later, toggle it here.
          // For now navigate to /profile/:id/edit or open a modal.
          navigate(`/profile/${id}/edit`);
        }}
      />

      <section className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Donor Listings</h2>
        {loadingListings ? (
          <div>Loading listings…</div>
        ) : listings.length === 0 ? (
          <div className="text-gray-600">No listings yet.</div>
        ) : (
          <DonorListingsList listings={listings} />
        )}

        {meta && meta.pages > 1 && (
          <div className="mt-4 text-sm text-gray-600">
            Page {meta.page} of {meta.pages} — total {meta.total} listings
          </div>
        )}
      </section>
    </div>
  );
}
