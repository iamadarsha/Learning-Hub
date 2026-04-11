"use client";

import { UserAvatar } from "@/components/user-avatar";
import { useTRPC } from "@/trpc/client";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  BellIcon,
  EyeIcon,
  SettingsIcon,
  ShieldIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const SettingsView = () => {
  const { user, isLoaded } = useUser();
  const trpc = useTRPC();

  const { data: profile } = useQuery(
    trpc.users.getMyProfile.queryOptions()
  );
  const { data: xpData } = useQuery(
    trpc.users.getMyXP.queryOptions()
  );

  const upsertProfile = useMutation(
    trpc.users.upsertProfile.mutationOptions({
      onSuccess: () => toast.success("Profile updated"),
      onError: (err) => toast.error(err.message),
    })
  );

  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("");
  const [team, setTeam] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");

  // Populate fields when profile loads
  const p = profile?.profile;
  if (p && !displayName && !role && !team && !bio && !skills) {
    if (p.displayName) setDisplayName(p.displayName);
    if (p.role) setRole(p.role);
    if (p.team) setTeam(p.team);
    if (p.bio) setBio(p.bio);
    if (p.skills) setSkills(p.skills.join(", "));
  }

  const handleSaveProfile = () => {
    upsertProfile.mutate({
      displayName: displayName || undefined,
      role: role || undefined,
      team: team || undefined,
      bio: bio || undefined,
      skills: skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : undefined,
    });
  };

  return (
    <div className="max-w-3xl mx-auto mb-10 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#009BFF]/10 flex items-center justify-center">
          <SettingsIcon className="size-5 text-[#009BFF]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-[#FCFCFC]">Settings</h1>
          <p className="text-white/40 text-sm">Manage your profile and preferences</p>
        </div>
      </div>

      {/* Profile Section */}
      <section className="bg-[#00084D]/40 border border-white/[0.08] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <UserIcon className="size-4 text-[#009BFF]" />
          <h2 className="text-lg font-semibold text-[#FCFCFC]">Profile</h2>
        </div>

        {/* Avatar + basic info */}
        {isLoaded && user && (
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/[0.06]">
            <UserAvatar imageUrl={user.imageUrl} name={user.fullName || "User"} size="lg" className="size-16" />
            <div>
              <p className="text-[#FCFCFC] font-semibold text-lg">{user.fullName}</p>
              <p className="text-white/40 text-sm">{user.primaryEmailAddress?.emailAddress}</p>
              {xpData && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-medium text-[#009BFF] bg-[#009BFF]/10 px-2 py-0.5 rounded-full">
                    Level {xpData.level} · {xpData.totalXp?.toLocaleString()} XP
                  </span>
                  {xpData.streak > 0 && (
                    <span className="text-xs text-white/40">🔥 {xpData.streak} day streak</span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Editable fields */}
        <div className="space-y-4">
          <Field label="Display Name" value={displayName} onChange={setDisplayName} placeholder="How you appear to others" />
          <Field label="Job Title" value={role} onChange={setRole} placeholder="e.g. Senior AI Engineer" />
          <Field label="Team" value={team} onChange={setTeam} placeholder="e.g. Engineering, Creative, Data" />
          <Field label="Skills" value={skills} onChange={setSkills} placeholder="Comma-separated: Claude, n8n, Python" />
          <div>
            <label className="block text-sm font-medium text-[#FCFCFC] mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Tell the team what you're working on..."
              className="w-full px-4 py-3 bg-[#00084D]/60 border border-white/[0.08] rounded-xl text-[#FCFCFC] placeholder:text-white/30 focus:outline-none focus:border-[#009BFF] focus:ring-1 focus:ring-[#009BFF]/30 transition-all resize-none text-sm"
            />
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={upsertProfile.isPending}
            className="px-6 py-2.5 bg-[#009BFF] hover:bg-[#009BFF]/90 text-white font-medium text-sm rounded-full transition-colors disabled:opacity-50"
          >
            {upsertProfile.isPending ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-[#00084D]/40 border border-white/[0.08] rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <BellIcon className="size-4 text-[#4CC3AE]" />
          <h2 className="text-lg font-semibold text-[#FCFCFC]">Notifications</h2>
        </div>
        <div className="space-y-3">
          <ToggleRow icon={<EyeIcon className="size-4" />} label="New Resource Alerts" description="Get notified when new resources are added" />
          <ToggleRow icon={<BellIcon className="size-4" />} label="XP Milestones" description="Celebrate when you level up" defaultChecked />
        </div>
      </section>

      {/* Privacy */}
      <section className="bg-[#00084D]/40 border border-white/[0.08] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <ShieldIcon className="size-4 text-white/60" />
          <h2 className="text-lg font-semibold text-[#FCFCFC]">Privacy</h2>
        </div>
        <ToggleRow icon={<UserIcon className="size-4" />} label="Show on Expert Directory" description="Appear in the experts listing" defaultChecked />
      </section>
    </div>
  );
};

// ─── Reusable components ───

function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#FCFCFC] mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-[#00084D]/60 border border-white/[0.08] rounded-xl text-[#FCFCFC] placeholder:text-white/30 focus:outline-none focus:border-[#009BFF] focus:ring-1 focus:ring-[#009BFF]/30 transition-all text-sm"
      />
    </div>
  );
}

function ToggleRow({ icon, label, description, checked, defaultChecked, disabled }: {
  icon: React.ReactNode; label: string; description: string;
  checked?: boolean; defaultChecked?: boolean; disabled?: boolean;
}) {
  const [on, setOn] = useState(checked ?? defaultChecked ?? false);
  const isOn = checked !== undefined ? checked : on;

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <span className="text-white/40">{icon}</span>
        <div>
          <p className="text-sm text-[#FCFCFC] font-medium">{label}</p>
          <p className="text-xs text-white/30">{description}</p>
        </div>
      </div>
      <button
        onClick={() => !disabled && setOn(!isOn)}
        disabled={disabled}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          isOn ? "bg-[#009BFF]" : "bg-white/10"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            isOn ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
