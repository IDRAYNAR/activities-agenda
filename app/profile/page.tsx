"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { FiEdit2, FiTrash2, FiSave, FiX } from "react-icons/fi";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  // Redirection si non connecté
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Met à jour le formulaire quand la session change
  useEffect(() => {
    if (session?.user) {
      setFormData({
        firstName: session.user.firstName || "",
        lastName: session.user.lastName || "",
        email: session.user.email || "",
        currentPassword: "",
        newPassword: "",
      });
      setIsLoading(false);
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Mise à jour du profil...");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      // Mise à jour de la session avec les nouvelles données
      await update({
        ...session,
        user: {
          ...session?.user,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email
        }
      });

      toast.success("Profil mis à jour avec succès", { id: loadingToast });
      setIsEditing(false);
      
      // Émet un événement pour forcer le rafraîchissement
      window.dispatchEvent(new Event('emailUpdated'));
      
      // Force le rafraîchissement de la page
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue", { id: loadingToast });
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await fetch('/api/profile', {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete account');
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      throw error;
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await new Promise((resolve) => {
      toast((t: { id: string }) => (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-medium text-gray-900">
            Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(false);
              }}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                toast.dismiss(t.id);
                resolve(true);
              }}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Supprimer
            </button>
          </div>
        </div>
      ));
    });

    if (confirmed) {
      try {
        const success = await deleteAccount();
        if (success) {
          signOut({ callbackUrl: '/' });
        }
      } catch (error) {
        console.error('Erreur lors de la suppression du compte', error);
        toast.error('Une erreur est survenue lors de la suppression du compte');
      }
    }
  };

  const handlePasswordReset = async () => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session?.user?.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      toast.success('Un email de réinitialisation a été envoyé');
      setShowPasswordReset(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600">⚠️ Veuillez vous connecter pour accéder à votre profil. ⚠️</p>
        </div>
      </div>

    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Profil</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-700"
              >
                <FiEdit2 className="mr-2" />
                Modifier
              </button>
            ) : (
              <div className="flex space-x-3">
                <button
                  type="submit"
                  form="profile-form"
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  <FiSave className="mr-2" />
                  Enregistrer
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <FiX className="mr-2" />
                  Annuler
                </button>
              </div>
            )}
          </div>

          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
              />
            </div>

            {isEditing && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sécurité</h2>
            <button
              onClick={() => setShowPasswordReset(!showPasswordReset)}
              className="text-sm text-violet-600 hover:text-violet-500 font-medium"
            >
              {showPasswordReset ? 'Masquer' : 'Réinitialiser le mot de passe'}
            </button>
          </div>

          {showPasswordReset && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-4">
                Nous enverrons un lien de réinitialisation à votre adresse email : 
                <span className="font-medium ml-1">{session?.user?.email}</span>
              </p>
              <button
                onClick={handlePasswordReset}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-md hover:bg-violet-700"
              >
                Envoyer le lien de réinitialisation
              </button>
            </div>
          )}
        </div>

        {/* Delete Account Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Supprimer le compte</h2>
          <button
            onClick={handleDeleteAccount}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            <FiTrash2 className="mr-2" />
            Supprimer le compte
          </button>
        </div>
      </div>
    </div>
  );
} 