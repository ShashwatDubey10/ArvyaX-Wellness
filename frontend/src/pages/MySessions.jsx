import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchSessions = async () => {
    try {
      const res = await api.get("/my-sessions");
      setSessions(Array.isArray(res.data.sessions) ? res.data.sessions : []);
    } catch (err) {
      setSessions([]);
      toast.error("Failed to load sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleDelete = (id, title) => {
    toast.custom((t) => (
      <div className="bg-white rounded-xl shadow-xl p-6 text-gray-900 flex flex-col items-center min-w-[260px] z-50">
        <div className="mb-3 font-semibold text-lg text-emerald-600">
          Delete session?
        </div>
        <div className="mb-3 text-sm text-gray-700 text-center">
          Are you sure you want to delete{" "}
          <span className="font-bold">"{title}"</span>?<br />
          This action cannot be undone.
        </div>
        <div className="flex gap-4 mt-2">
          <button
            className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
          <button
            className="cursor-pointer px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
            onClick={async () => {
              try {
                await api.delete(`/my-sessions/${id}`);
                toast.dismiss(t.id);
                toast.success("Session deleted successfully.", {
                  style: { background: "#065f46", color: "#fff" },
                });
                fetchSessions();
              } catch {
                toast.dismiss(t.id);
                toast.error("Failed to delete session.", {
                  style: { background: "#dc2626", color: "#fff" },
                });
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    ));
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (session.tags || []).some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus =
      filterStatus === "all" || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

  const publishedCount = sessions.filter(
    (s) => s.status === "published"
  ).length;
  const draftCount = sessions.filter((s) => s.status === "draft").length;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-800 font-montserrat select-none">
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-24 left-24 w-36 h-36 rounded-full bg-emerald-500/10 animate-pulse" />
        <div
          className="absolute bottom-40 right-32 w-28 h-28 rounded-full bg-emerald-400/20 animate-bounce"
          style={{ animationDuration: "3.5s" }}
        />
        <div
          className="absolute top-1/2 left-12 w-20 h-20 rounded-full bg-emerald-600/20 animate-ping"
          style={{ animationDuration: "5s" }}
        />
        <div className="absolute bottom-20 right-16 w-20 h-20 rounded-full bg-cyan-500/15 animate-pulse" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-r from-emerald-400/30 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-gradient-to-l from-cyan-400/30 to-transparent blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto p-8 md:p-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight drop-shadow-md text-white">
              My Sessions
            </h1>
            <p className="mt-2 text-lg text-emerald-200/80">
              All your created sessions with quick access to edit, publish, or
              delete.
            </p>
          </div>

          <Link
            to="/my-sessions/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-700 rounded-3xl shadow-lg text-white font-semibold px-8 py-3 transition-transform duration-300 hover:scale-105 hover:shadow-emerald-500/30 cursor-pointer"
          >
            <svg
              viewBox="0 0 24 24"
              width={20}
              height={20}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1 stroke-white stroke-[1.5px]"
            >
              <path d="M15 12L12 12" strokeLinecap="round" />
              <path d="M12 12L9 12" strokeLinecap="round" />
              <path d="M12 12L12 9" strokeLinecap="round" />
              <path d="M12 12L12 15" strokeLinecap="round" />
              <path
                d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
                strokeLinecap="round"
              />
            </svg>
            New Session
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="text-center py-6 bg-white/10 border border-white/20 rounded-2xl shadow">
            <div className="text-3xl font-bold text-emerald-300">
              {sessions.length}
            </div>
            <div className="mt-1 text-lg text-white font-semibold">Total</div>
          </div>
          <div className="text-center py-6 bg-white/10 border border-white/20 rounded-2xl shadow">
            <div className="text-3xl font-bold text-emerald-400">
              {publishedCount}
            </div>
            <div className="mt-1 text-lg text-white font-semibold">
              Published
            </div>
          </div>
          <div className="text-center py-6 bg-white/10 border border-white/20 rounded-2xl shadow">
            <div className="text-3xl font-bold text-emerald-200">
              {draftCount}
            </div>
            <div className="mt-1 text-lg text-white font-semibold">Drafts</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text"
            className="w-full md:flex-1 px-5 py-3 rounded-2xl border border-white/20 bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
            placeholder="Search by title or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="relative w-full md:w-auto">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className={`
                w-full md:w-auto
                px-5 py-3
                pl-5 pr-10
                rounded-xl
                bg-white/15
                text-emerald-300
                font-medium
                border-2 border-white/10
                shadow-[0_4px_24px_2px_rgba(16,185,129,0.07)]
                backdrop-blur-xl
                focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200/40
                hover:border-emerald-400
                transition-all duration-300
                cursor-pointer
                appearance-none
              `}
              style={{ backgroundImage: "none" }}
            >
              <option className="bg-slate-900 text-emerald-200" value="all">
                All Status
              </option>
              <option
                className="bg-slate-900 text-emerald-300"
                value="published"
              >
                Published
              </option>
              <option className="bg-slate-900 text-amber-200" value="draft">
                Draft
              </option>
            </select>

            <span
              className="
                pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xl
                text-emerald-300
                transition-transform duration-300
                peer-focus:rotate-180
              "
              aria-hidden="true"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
                <path
                  d="M6 8l4 4 4-4"
                  stroke="#34D399"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-emerald-200/80">
            Loading your sessions...
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-16 text-center relative overflow-hidden">
            <p className="text-lg text-white">
              No sessions found. Try a different search or create new sessions!
            </p>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSessions.map((session) => (
              <div
                key={session._id}
                className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl p-6 relative transition-all flex flex-col group hover:shadow-2xl hover:border-emerald-300/60"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-white truncate group-hover:text-emerald-300 cursor-pointer">
                    {session.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold cursor-default ${
                      session.status === "published"
                        ? "bg-emerald-700 text-emerald-300"
                        : "bg-amber-700 text-amber-300"
                    }`}
                  >
                    {session.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-emerald-200 truncate mb-4">
                  {Array.isArray(session.tags) && session.tags.length > 0
                    ? session.tags.join(", ")
                    : "No tags"}
                </p>
                <div className="mt-auto flex justify-between items-center text-xs text-emerald-400 mb-3">
                  <span>{formatDate(session.updatedAt)}</span>
                  {session.json_file_url && (
                    <a
                      href={session.json_file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-emerald-300 hover:text-emerald-100 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View JSON
                    </a>
                  )}
                </div>
                <div className="flex gap-3">
                  <Link
                    to={`/my-sessions/${session._id}`}
                    className="cursor-pointer flex-1 py-2 px-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 hover:text-emerald-200 text-sm font-medium rounded-xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 text-center"
                    aria-label={`Edit session ${session.title}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(session._id, session.title)}
                    className="cursor-pointer py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 text-sm font-medium rounded-xl border border-red-500/30 hover:border-red-400/50 transition-all duration-300"
                    aria-label={`Delete session ${session.title}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MySessions;
