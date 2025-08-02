// src/pages/SessionEditor.jsx

import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";

const isValidObjectId = (id) => typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id);

const SessionEditor = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const isEdit = isValidObjectId(id);
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", tags: "", json_file_url: "" });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // For debounce management and preventing unnecessary saves
  const lastSavedFormRef = useRef({ title: "", tags: "", json_file_url: "" });
  const debounceTimer = useRef(null);

  // Fetch session if editing an existing one
  useEffect(() => {
    if (isNew) {
      setLoading(false);
      lastSavedFormRef.current = { ...form };
      return;
    }
    if (isEdit) {
      api.get(`/my-sessions/${id}`)
        .then((res) => {
          const data = res.data.session || {};
          const loadedForm = {
            title: data.title || "",
            tags: (data.tags || []).join(", "),
            json_file_url: data.json_file_url || "",
          };
          setForm(loadedForm);
          lastSavedFormRef.current = { ...loadedForm };
        })
        .catch(() => toast.error("Failed to load session"))
        .finally(() => setLoading(false));
    } else {
      toast.error("Invalid session URL");
      setLoading(false);
    }
  }, [id, isNew, isEdit]);

  // ✅ FIXED: Debounced auto-save handler
  useEffect(() => {
    if (loading || saving || publishing) return;

    const hasChanged =
      form.title !== lastSavedFormRef.current.title ||
      form.tags !== lastSavedFormRef.current.tags ||
      form.json_file_url !== lastSavedFormRef.current.json_file_url;

    if (!hasChanged) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      setSaving(true);
      const payload = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };
      try {
        let res;
        if (isNew) {
          res = await api.post("/my-sessions/save-draft", payload);
        } else {
          res = await api.post("/my-sessions/save-draft", { id, ...payload });
        }
        lastSavedFormRef.current = { ...form };
        toast.success("Draft auto-saved!", {
          icon: "💾",
          duration: 1500,
        });
        if (isNew && res.data.session?._id) {
          navigate(`/my-sessions/${res.data.session._id}`, { replace: true });
        }
      } catch {
        toast.error("Auto-save failed");
      } finally {
        setSaving(false);
      }
    }, 2000);

    return () => clearTimeout(debounceTimer.current);
  }, [form, loading, saving, publishing, isNew, id, navigate]);

  // Manual save (button click)
  const handleSaveDraft = async (e) => {
    e.preventDefault();
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      let res;
      if (isNew) {
        res = await api.post("/my-sessions/save-draft", payload);
      } else {
        res = await api.post("/my-sessions/save-draft", { id, ...payload });
      }
      lastSavedFormRef.current = { ...form };
      toast.success("Draft saved!");
      if (isNew && res.data.session?._id) {
        navigate(`/my-sessions/${res.data.session._id}`, { replace: true });
      }
    } catch {
      toast.error("Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  // Publish session
  const handlePublish = async () => {
    if (isNew) return;
    setPublishing(true);
    try {
      await api.post("/my-sessions/publish", {
        id,
        title: form.title,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        json_file_url: form.json_file_url,
      });
      toast.success("Session published!");
      navigate("/my-sessions");
    } catch {
      toast.error("Publish failed");
    } finally {
      setPublishing(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-cyan-800 font-montserrat select-none relative flex items-center justify-center px-4 py-12">
      {/* Background floating orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-20 left-36 w-40 h-40 rounded-full bg-emerald-500/10 animate-pulse" />
        <div
          className="absolute bottom-40 right-32 w-28 h-28 rounded-full bg-emerald-400/20 animate-bounce"
          style={{ animationDuration: "3.5s" }}
        />
        <div
          className="absolute top-1/2 left-16 w-20 h-20 rounded-full bg-emerald-600/20 animate-ping"
          style={{ animationDuration: "5s" }}
        />
        <div className="absolute bottom-16 right-20 w-20 h-20 rounded-full bg-cyan-500/15 animate-pulse" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-400/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-l from-cyan-400/20 to-transparent blur-3xl" />
        <div className="absolute top-1/2 -left-48 w-80 h-80 rounded-full bg-gradient-to-r from-emerald-300/10 to-transparent blur-2xl" />
      </div>

      {/* Status indicator */}
      {saving && (
        <div className="fixed top-4 right-4 bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg z-50 border border-emerald-400/30">
          💾 Saving...
        </div>
      )}

      {/* ✅ PERFECT: Glassmorphic card with ideal styling */}
      <form
        onSubmit={handleSaveDraft}
        noValidate
        className="relative z-10 w-full max-w-lg backdrop-blur-xl bg-white/10 border border-white/30 rounded-3xl shadow-2xl p-10"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.08))",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
        }}
      >
        {/* ✅ IMPROVED: Better gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/8 via-transparent to-cyan-400/8 rounded-3xl" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white mb-8 tracking-tight drop-shadow-lg">
            {isNew ? "Create New Session" : isEdit ? "Edit Session" : "Invalid Session"}
          </h1>

          {loading ? (
            <div className="text-center py-20 text-emerald-200 animate-pulse">Loading...</div>
          ) : !isEdit && !isNew ? (
            <div className="text-center py-20 text-red-400 font-bold">Invalid session ID.</div>
          ) : (
            <>
              {/* ✅ PERFECT COMBO: Floating labels + bigger input boxes */}
              <div className="relative mb-8">
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-5 py-4 rounded-2xl border-2 bg-transparent text-white placeholder-transparent focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: focusedField === "title" || form.title ? "#10b981" : "rgba(255, 255, 255, 0.3)",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                  placeholder="Title"
                  required
                  minLength={2}
                  autoComplete="off"
                />
                <label
                  htmlFor="title"
                  className={`absolute left-5 transition-all duration-200 pointer-events-none ${
                    focusedField === "title" || form.title
                      ? "-top-3 text-sm text-emerald-400 bg-slate-900 px-2 rounded"
                      : "top-4 text-base text-emerald-200/70"
                  }`}
                >
                  Title
                </label>
              </div>

              <div className="relative mb-8">
                <input
                  id="tags"
                  name="tags"
                  type="text"
                  value={form.tags}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("tags")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-5 py-4 rounded-2xl border-2 bg-transparent text-white placeholder-transparent focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: focusedField === "tags" || form.tags ? "#10b981" : "rgba(255, 255, 255, 0.3)",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                  placeholder="Tags"
                  autoComplete="off"
                />
                <label
                  htmlFor="tags"
                  className={`absolute left-5 transition-all duration-200 pointer-events-none ${
                    focusedField === "tags" || form.tags
                      ? "-top-3 text-sm text-emerald-400 bg-slate-900 px-2 rounded"
                      : "top-4 text-base text-emerald-200/70"
                  }`}
                >
                  Tags
                </label>
              </div>

              <div className="relative mb-8">
                <input
                  id="json_file_url"
                  name="json_file_url"
                  type="text"
                  value={form.json_file_url}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("json_file_url")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full px-5 py-4 rounded-2xl border-2 bg-transparent text-white placeholder-transparent focus:outline-none transition-all duration-200"
                  style={{
                    borderColor: focusedField === "json_file_url" || form.json_file_url ? "#10b981" : "rgba(255, 255, 255, 0.3)",
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  }}
                  placeholder="JSON File URL"
                  autoComplete="off"
                />
                <label
                  htmlFor="json_file_url"
                  className={`absolute left-5 transition-all duration-200 pointer-events-none ${
                    focusedField === "json_file_url" || form.json_file_url
                      ? "-top-3 text-sm text-emerald-400 bg-slate-900 px-2 rounded"
                      : "top-4 text-base text-emerald-200/70"
                  }`}
                >
                  JSON File URL
                </label>
              </div>

              {/* ✅ IMPROVED: Enhanced button styling */}
              <div className="flex gap-6">
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex-1 py-3 px-6 rounded-3xl font-semibold shadow-inner transition-all duration-300 cursor-pointer overflow-hidden group relative backdrop-blur-sm ${
                    saving
                      ? "bg-gray-400/20 text-gray-300 cursor-not-allowed border border-gray-400/30"
                      : "bg-gradient-to-r from-emerald-500/80 to-cyan-600/80 text-white hover:from-emerald-600/90 hover:to-cyan-700/90 hover:scale-105 border border-emerald-400/30"
                  }`}
                >
                  {saving ? "Saving..." : "Save Draft"}
                  {!saving && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isNew || publishing}
                  className={`flex-1 py-3 px-6 rounded-3xl font-semibold shadow-inner transition-all duration-300 cursor-pointer overflow-hidden group relative backdrop-blur-sm ${
                    isNew || publishing
                      ? "bg-gray-400/20 text-gray-300 cursor-not-allowed border border-gray-400/30"
                      : "bg-gradient-to-r from-emerald-600/80 to-cyan-700/80 text-white hover:from-emerald-700/90 hover:to-cyan-800/90 hover:scale-105 border border-emerald-500/30"
                  }`}
                >
                  {publishing ? "Publishing..." : "Publish"}
                  {!isNew && !publishing && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};

export default SessionEditor;
