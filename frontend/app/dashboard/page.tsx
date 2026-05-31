'use client';

import { AlertCircle, Info, Sparkles, X } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import ShareResultButton from '../../components/ShareResultButton';
import JobCard from '../../components/JobCard';
import { useImpersonation } from '../../components/ImpersonationContext';
import DarkVeil from '../../components/DarkVeil';
import Dashboard from '../../components/Dashboard';
import Analytics from '../../components/Analytics';
import AITools from '../../components/AITools';
import Applications from '../../components/Applications';
import Image from "next/image";

interface Job {
  id: number;
  company: string;
  position: string;
  location: string;
  status: string;
  applied_date: string;
  salary_range: string;
  job_url: string;
  notes: string;
  platform: string;
}

interface Stats {
  total: number;
  by_status: { Applied: number; Screening: number; Interview: number; Offer: number; Rejected: number; };
  response_rate: number;
}

interface Trends {
  monthly_applications: Record<string, number>;
  status_distribution: Record<string, number>;
  platform_distribution: Record<string, number>;
  metrics: { total_applications: number; interview_rate: number; offer_rate: number };
}

const STATUSES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];

const statusStyles: Record<string, string> = {
  Applied: 'bg-blue-100 text-blue-700 border-blue-200',
  Screening: 'bg-purple-100 text-purple-700 border-purple-200',
  Interview: 'bg-orange-100 text-orange-700 border-orange-200',
  Offer: 'bg-green-100 text-green-700 border-green-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
};

const statusBorderColors: Record<string, string> = {
  Applied: 'border-t-blue-400',
  Screening: 'border-t-purple-400',
  Interview: 'border-t-orange-400',
  Offer: 'border-t-green-400',
  Rejected: 'border-t-red-400',
};

const statusBarColors: Record<string, string> = {
  Applied: 'bg-blue-500',
  Screening: 'bg-purple-500',
  Interview: 'bg-orange-500',
  Offer: 'bg-green-500',
  Rejected: 'bg-red-500',
};

function PremiumJobTrackerContent() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
  const { data: session, status: sessionStatus } = useSession();
  const { impersonatedUser, setImpersonatedUser } = useImpersonation();

  // Use impersonated email if set, otherwise real session email
  const activeUser = impersonatedUser || session?.user;
  const activeEmail = activeUser?.email || '';
  const activeName = activeUser?.name || '';
  const activeImage = activeUser?.image || '';

  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const initialTab = searchParams.get('tab') || 'dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Sync activeTab with URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showInterviewQuestions, setShowInterviewQuestions] = useState(false);
  const [interviewQuestions, setInterviewQuestions] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [trends, setTrends] = useState<Trends | null>(null);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatProvider, setChatProvider] = useState<string>('');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [matchResult, setMatchResult] = useState<any>(null);
  const [isMatchLoading, setIsMatchLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSyncSuccess, setIsSyncSuccess] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ added: number } | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const [activeAiView, setActiveAiView] = useState<'chat' | 'ats'>('chat');
  const dragJobRef = useRef<Job | null>(null);

  // ── Delete confirmation modal ──────────────────────────────────────────────
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const pendingDeleteJob = jobs.find(j => j.id === pendingDeleteId) ?? null;

  const [formData, setFormData] = useState({
    company: '', position: '', location: '', status: 'Applied',
    applied_date: new Date().toISOString().split('T')[0],
    salary_range: '', job_url: '', notes: '', platform: 'LinkedIn',
  });

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'X-User-Email': activeEmail,
  });

  useEffect(() => {
    if (activeEmail) { fetchJobs(); fetchStats(); fetchSuggestions(); fetchTrends(); }
  }, [activeEmail]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/jobs`, { headers: authHeaders() });
      setJobs(await res.json());
      setLoading(false);
    } catch { setLoading(false); }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/stats`, { headers: authHeaders() });
      setStats(await res.json());
    } catch { }
  };

  const fetchTrends = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/analytics/trends`, { headers: authHeaders() });
      setTrends(await res.json());
    } catch { }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/suggestions`, { headers: authHeaders() });
      const data = await res.json();
      setAiSuggestions(data.suggestions || []);
    } catch { }
  };

  const handleSubmit = async () => {
    try {
      const url = editingJob ? `${API_BASE_URL}/api/jobs/${editingJob.id}` : `${API_BASE_URL}/api/jobs`;
      const res = await fetch(url, { method: editingJob ? 'PUT' : 'POST', headers: authHeaders(), body: JSON.stringify(formData) });
      if (res.ok) { resetForm(); fetchJobs(); fetchStats(); fetchTrends(); }
    } catch { }
  };

  // Opens the styled delete confirmation modal — no window.confirm()
  const handleDelete = (id: number) => setPendingDeleteId(id);

  // Called when user clicks "Delete" in the confirmation modal
  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;
    const id = pendingDeleteId;
    setPendingDeleteId(null);
    try {
      await fetch(`${API_BASE_URL}/api/jobs/${id}`, { method: 'DELETE', headers: authHeaders() });
      fetchJobs(); fetchStats(); fetchTrends();
    } catch { }
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({ company: job.company, position: job.position, location: job.location, status: job.status, applied_date: job.applied_date, salary_range: job.salary_range, job_url: job.job_url, notes: job.notes, platform: job.platform || 'LinkedIn' });
    setShowForm(true);
    setActiveTab('applications');
  };

  const resetForm = () => {
    setEditingJob(null);
    setFormData({ company: '', position: '', location: '', status: 'Applied', applied_date: new Date().toISOString().split('T')[0], salary_range: '', job_url: '', notes: '', platform: 'LinkedIn' });
    setShowForm(false);
  };

  const updateJobStatus = async (job: Job, newStatus: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/jobs/${job.id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify({ status: newStatus }) });
      fetchJobs(); fetchStats(); fetchTrends();
    } catch { }
  };

  const handleDragStart = (job: Job) => { dragJobRef.current = job; };
  const handleDrop = (status: string) => {
    if (dragJobRef.current && dragJobRef.current.status !== status) updateJobStatus(dragJobRef.current, status);
    dragJobRef.current = null;
  };

  const exportCSV = () => {
    const headers = ['Company', 'Position', 'Location', 'Status', 'Applied Date', 'Salary', 'Platform', 'Job URL', 'Notes'];
    const rows = jobs.map(j => [j.company, j.position, j.location, j.status, j.applied_date, j.salary_range, j.platform, j.job_url, j.notes].map(v => `"${(v || '').replace(/"/g, '""')}"`));
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'jobpilot-applications.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const generateCoverLetter = async (company: string, position: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/cover-letter`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ company, position }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate cover letter');
      setCoverLetter(data.cover_letter); setShowCoverLetter(true);
    } catch (err: any) {
      setNotification({ message: `AI Error: ${err.message}`, type: 'error' });
    }
  };

  const generateInterviewQuestions = async (position: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/interview-questions`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ position }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate questions');
      setInterviewQuestions(data); setShowInterviewQuestions(true);
    } catch (err: any) {
      setNotification({ message: `AI Error: ${err.message}`, type: 'error' });
    }
  };

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsChatLoading(true);
    try {
      const history = chatMessages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] }));
      const res = await fetch(`${API_BASE_URL}/api/ai/chat`, { method: 'POST', headers: authHeaders(), body: JSON.stringify({ message: userMsg, history }) });
      const data = await res.json();
      if (data.provider) setChatProvider(data.provider);
      setChatMessages(prev => [...prev, { role: data.response ? 'ai' : 'error', content: data.response || `Error: ${data.error}` }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'error', content: 'Connection failed.' }]);
    } finally { setIsChatLoading(false); }
  };

  const handleATSScan = async () => {
    if (!resumeText.trim() || !jobDescription.trim()) return;
    setIsMatchLoading(true); setMatchResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/ai/match-resume`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'ATS Scan failed');
      setMatchResult(data);
    } catch (err: any) {
      setMatchResult({ error: err.message });
    }
    finally { setIsMatchLoading(false); }
  };

  const handleGmailSync = async () => {
    setIsSyncing(true);
    setSyncStatus(null);


    try {
      // ── Step 1: Try to sync (will return needs_auth if not yet authorised) ──
      let res: Response;
      try {
        res = await fetch(`${API_BASE_URL}/api/gmail/sync`, {
          method: 'POST',
          headers: authHeaders(),
          credentials: 'include',
        });
      } catch (fetchErr: any) {
        throw new Error(`Network error: ${fetchErr.message}`);
      }

      // Safe JSON parse — backend may return HTML on crash
      let data: any;
      try {
        data = await res.json();
      } catch {
        throw new Error(
          `Server returned a non-JSON response (status ${res.status}). ` +
          'Check Render logs for the real error.'
        );
      }

      // ── Step 2: If no Gmail auth yet, start OAuth flow ───────────────────
      if (data.error === 'needs_auth') {
        let startRes: Response;
        try {
          startRes = await fetch(`${API_BASE_URL}/api/gmail/auth-start`, {
            method: 'POST',
            headers: authHeaders(),
            credentials: 'include',
          });
        } catch (fetchErr: any) {
          throw new Error(`Could not reach auth endpoint: ${fetchErr.message}`);
        }

        let startData: any;
        try {
          startData = await startRes.json();
        } catch {
          throw new Error('Invalid response from auth-start endpoint.');
        }

        if (startData.auth_url) {
          setNotification({
            message: 'Check your browser! Grant access in the new Google tab to continue.',
            type: 'info',
          });
          window.open(startData.auth_url, '_blank');

          // Poll for OAuth completion (checks DB-backed status)
          const pollInterval = setInterval(async () => {
            try {
              const statusRes = await fetch(`${API_BASE_URL}/api/gmail/auth-status`, {
                headers: authHeaders(),
                credentials: 'include',
              });
              const statusData = await statusRes.json();

              if (statusData.status === 'done') {
                clearInterval(pollInterval);
                setNotification({ message: 'Authorization successful! Syncing emails…', type: 'success' });
                handleGmailSync();
              } else if (statusData.status === 'error') {
                clearInterval(pollInterval);
                setIsSyncing(false);
                setNotification({
                  message: `Authorization failed: ${statusData.message || 'Unknown error'}`,
                  type: 'error',
                });
              }
            } catch (pollErr) {
              console.error('Gmail auth-status poll error:', pollErr);
            }
          }, 3000);

          return; // keep isSyncing=true while polling
        }

        throw new Error(startData.error || 'Could not start Gmail authorization');
      }

      // ── Step 3: Handle sync errors ────────────────────────────────────────
      if (!res.ok) {
        throw new Error(data.error || `Sync failed with status ${res.status}`);
      }

      // ── Step 4: Success ───────────────────────────────────────────────────
      const added = data.added ?? 0;
      const updated = data.updated ?? 0;
      const skipped = data.skipped ?? 0;

      setSyncStatus({ added, updated } as any);
      setIsSyncSuccess(true);
      // Keep the "Synced!" state visible for 8 seconds so the user can see it
      setTimeout(() => setIsSyncSuccess(false), 8000);

      // Always refresh jobs — even 0 added could mean status updates happened
      fetchJobs(); fetchStats(); fetchTrends();

      if (added > 0 || updated > 0) {
        const parts = [];
        if (added > 0) parts.push(`${added} new application${added !== 1 ? 's' : ''}`);
        if (updated > 0) parts.push(`${updated} status update${updated !== 1 ? 's' : ''}`);
        if (skipped > 0) parts.push(`${skipped} skipped`);
        setNotification({
          message: `Gmail sync complete! ${parts.join(', ')}.`,
          type: 'success',
        });
      } else {
        setNotification({
          message: 'Sync complete — no new job emails matched this time.',
          type: 'info',
        });
      }

    } catch (err: any) {
      console.error('[GmailSync] Error:', err);
      setNotification({ message: `Gmail Sync Error: ${err.message}`, type: 'error' });
    } finally {
      setIsSyncing(false);
      setTimeout(() => setNotification(null), 8000);
    }
  };

  const filteredJobs = jobs.filter(job => filter === 'All' || job.status === filter);

  return (
    <div className="min-h-screen relative isolate">
      <div className="fixed inset-0 -z-10" aria-hidden="true">
        <DarkVeil
          hueShift={32}
          speed={1}
          scanlineFrequency={0.5}
          warpAmount={5}
        />
      </div>


      {/* Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
          >
            <div
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.06)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
              }}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center
                ${notification.type === 'success'
                    ? 'bg-green-500/15 text-green-400'
                    : notification.type === 'error'
                      ? 'bg-red-500/15 text-red-400'
                      : 'bg-blue-500/15 text-blue-400'
                  }`}
              >
                {notification.type === 'success' && <Sparkles size={18} />}
                {notification.type === 'error' && <AlertCircle size={18} />}
                {notification.type === 'info' && <Info size={18} />}
              </div>
              <p className="text-sm font-medium text-white/90">
                {notification.message}
              </p>
              <button
                onClick={() => setNotification(null)}
                className="ml-auto p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-4 py-10">
        <AnimatePresence mode="wait" initial={false}>

          {/* ── DASHBOARD ── */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Dashboard
                activeName={activeName}
                session={session}
                stats={stats}
                aiSuggestions={aiSuggestions}
                syncStatus={syncStatus}
                setSyncStatus={setSyncStatus}
                STATUSES={STATUSES}
                onTakeAction={() => { }}
              />
            </motion.div>
          )}

          {/* ── APPLICATIONS ── */}
          {activeTab === 'applications' && (
            <motion.div
              key="applications"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Applications
                jobs={jobs}
                filteredJobs={filteredJobs}
                STATUSES={STATUSES}
                statusStyles={statusStyles}
                statusBorderColors={statusBorderColors}

                showForm={showForm}
                setShowForm={setShowForm}
                editingJob={editingJob}
                formData={formData}
                setFormData={setFormData}

                handleSubmit={handleSubmit}
                resetForm={resetForm}
                handleDelete={handleDelete}
                handleEdit={handleEdit}

                generateCoverLetter={generateCoverLetter}
                generateInterviewQuestions={generateInterviewQuestions}

                filter={filter}
                setFilter={setFilter}

                viewMode={viewMode}
                setViewMode={setViewMode}

                exportCSV={exportCSV}

                handleGmailSync={handleGmailSync}
                isSyncing={isSyncing}
                isSyncSuccess={isSyncSuccess}
                syncStatus={syncStatus}

                handleDragStart={handleDragStart}
                handleDrop={handleDrop}
                JobCard={JobCard}
              />
            </motion.div>
          )}

          {/* ── AI TOOLS ── */}
          {activeTab === 'ai-tools' && (
            <motion.div
              key="ai-tools"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <AITools
                activeAiView={activeAiView}
                setActiveAiView={setActiveAiView}

                chatMessages={chatMessages}
                chatInput={chatInput}
                setChatInput={setChatInput}
                handleChatSend={handleChatSend}
                isChatLoading={isChatLoading}
                chatProvider={chatProvider}

                resumeText={resumeText}
                setResumeText={setResumeText}
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
                handleATSScan={handleATSScan}
                isMatchLoading={isMatchLoading}
                matchResult={matchResult}

                API_BASE_URL={API_BASE_URL}
                authHeaders={authHeaders}
              />
            </motion.div>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <Analytics
                trends={trends}
                STATUSES={STATUSES}
              />
            </motion.div>
          )}

        </AnimatePresence>

        {/* Cover Letter Modal */}
        {showCoverLetter && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-auto shadow-2xl relative">
              <h2 className="text-xl font-bold text-[#000926] mb-4">Generated Cover Letter</h2>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-6">
                <pre className="whitespace-pre-wrap text-gray-700 text-sm font-sans">{coverLetter}</pre>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button onClick={() => setShowCoverLetter(false)} className="w-full sm:w-auto bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl text-sm font-bold">Close</button>
                <div className="w-full sm:w-auto">
                  <ShareResultButton
                    data={{ cover_letter: coverLetter }}
                    label="Job Application Cover Letter"
                    apiBase={API_BASE_URL}
                    authHeaders={authHeaders}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interview Questions Modal */}
        {showInterviewQuestions && interviewQuestions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-auto shadow-2xl">
              <h2 className="text-xl font-bold text-[#000926] mb-2">Interview Preparation</h2>
              <p className="text-sm text-gray-400 mb-5">Role: <span className="font-medium text-[#0F52BA]">{interviewQuestions.position}</span></p>
              {interviewQuestions.questions?.technical && (
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-[#0F52BA] mb-3 flex items-center gap-2">⚙️ Technical Questions</h3>
                  <div className="space-y-2">
                    {interviewQuestions.questions.technical.map((q: string, i: number) => (
                      <div key={i} className="flex gap-3 p-3 bg-blue-50 rounded-xl">
                        <span className="text-[#0F52BA] font-bold text-sm shrink-0">{i + 1}.</span>
                        <p className="text-gray-700 text-sm">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {interviewQuestions.questions?.behavioral && (
                <div className="mb-5">
                  <h3 className="text-sm font-bold text-purple-600 mb-3 flex items-center gap-2">🧠 Behavioral Questions</h3>
                  <div className="space-y-2">
                    {interviewQuestions.questions.behavioral.map((q: string, i: number) => (
                      <div key={i} className="flex gap-3 p-3 bg-purple-50 rounded-xl">
                        <span className="text-purple-600 font-bold text-sm shrink-0">{i + 1}.</span>
                        <p className="text-gray-700 text-sm">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!interviewQuestions.questions?.technical && !interviewQuestions.questions?.behavioral && (
                <p className="text-gray-500 text-sm">No questions available.</p>
              )}
              <button onClick={() => setShowInterviewQuestions(false)} className="bg-[#0F52BA] text-white px-6 py-2.5 rounded-xl text-sm font-medium mt-2">Close</button>
            </div>
          </div>
        )}

        {/* ── Delete Confirmation Modal ──────────────────────────────────── */}
        {pendingDeleteId !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4"
            style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)' }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-md rounded-3xl p-8"
              style={{
                background: 'rgba(18,20,30,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.6)'
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-500/15">
                  <span className="text-red-400 text-xl">🗑️</span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Delete Application?</h3>
                  <p className="text-white/50 text-sm">This action cannot be undone.</p>
                </div>
              </div>
              {pendingDeleteJob && (
                <div className="mb-6 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-white font-semibold">{pendingDeleteJob.position}</p>
                  <p className="text-blue-400 text-sm">{pendingDeleteJob.company}</p>
                  <p className="text-white/40 text-xs mt-1">Applied: {pendingDeleteJob.applied_date}</p>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setPendingDeleteId(null)}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white/70 hover:text-white transition"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Keep it
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-white transition"
                  style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.35)' }}
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Floating AI Bubble */}
      <a
        href="https://prepify-one.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
          }}
        >
          <Image
            src="/logo.svg"
            alt="AI Assistant"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Hover Tooltip */}
        <span className="absolute -top-7 -translate-y-1/2 px-3 py-1.5 text-xs rounded-lg bg-[#1a1c20] text-white opacity-0 group-hover:opacity-100 transition">
          Prepify
        </span>
      </a>
    </div>
  );
}

export default function PremiumJobTracker() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050814] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <PremiumJobTrackerContent />
    </Suspense>
  );
}