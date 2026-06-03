import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, clearToken, type StoredFile } from '../lib/api';

type DashboardFile = StoredFile & {
  isPending?: boolean;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 B';

  const units = ['B', 'KB', 'MB', 'GB'];
  const sizeIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** sizeIndex;

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[sizeIndex]}`;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<DashboardFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const totalStorage = useMemo(
    () => files.reduce((total, file) => total + file.fileSize, 0),
    [files],
  );

  const loadFiles = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.get<StoredFile[]>('/files');
      setFiles(response.data);
    } catch {
      setError('Could not load your files. Please sign in again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadFiles();
  }, []);

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;

    if (!selectedFile) {
      setError('Choose a file before uploading.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    const pendingFile: DashboardFile = {
      id: `pending-${Date.now()}`,
      originalFilename: selectedFile.name,
      fileSize: selectedFile.size,
      contentType: selectedFile.type || null,
      createdAt: new Date().toISOString(),
      isPending: true,
    };

    setIsUploading(true);
    setError('');
    setFiles((currentFiles) => [pendingFile, ...currentFiles]);

    try {
      const response = await api.post<StoredFile>('/files/upload', formData);
      setFiles((currentFiles) => [
        response.data,
        ...currentFiles.filter((file) => file.id !== pendingFile.id),
      ]);
    } catch {
      setError('Upload failed. Check the backend and try again.');
      setFiles((currentFiles) => currentFiles.filter((file) => file.id !== pendingFile.id));
      setIsUploading(false);
      return;
    }

    setSelectedFile(null);
    form.reset();
    setError('');
    setIsUploading(false);
  };

  const handleDownload = async (file: StoredFile) => {
    try {
      const response = await api.get(`/files/${file.id}/download`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(response.data);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = file.originalFilename;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Download failed.');
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await api.delete(`/files/${fileId}`);
      setFiles((currentFiles) => currentFiles.filter((file) => file.id !== fileId));
    } catch {
      setError('Delete failed.');
    }
  };

  const handleLogout = () => {
    clearToken();
    navigate('/login');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/90">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-2xl font-black uppercase tracking-tight text-white">
            Pharos<span className="text-cyan-400">.</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-fit rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[360px_1fr]">
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
          <h1 className="text-2xl font-bold text-white">Secure file storage</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Upload private files, retrieve them later, and manage your own vault through authenticated API requests.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Files</p>
              <p className="mt-1 text-2xl font-bold text-white">{files.length}</p>
            </div>
            <div className="rounded-md border border-slate-800 bg-slate-950 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Storage</p>
              <p className="mt-1 text-2xl font-bold text-white">{formatBytes(totalStorage)}</p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-300">Select file</span>
              <input
                type="file"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                className="mt-2 block w-full rounded-md border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300 file:mr-3 file:rounded-md file:border-0 file:bg-cyan-400 file:px-3 file:py-2 file:font-semibold file:text-slate-950"
              />
            </label>
            <button
              type="submit"
              disabled={isUploading}
              className="w-full rounded-md bg-cyan-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {isUploading ? 'Uploading...' : 'Upload file'}
            </button>
          </form>

          {error && (
            <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
              {error}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-bold text-white">Your files</h2>
          </div>

          {isLoading ? (
            <p className="p-5 text-sm text-slate-400">Loading files...</p>
          ) : files.length === 0 ? (
            <p className="p-5 text-sm text-slate-400">No files uploaded yet.</p>
          ) : (
            <ul className="divide-y divide-slate-800">
              {files.map((file) => (
                <li key={file.id} className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-white">{file.originalFilename}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {formatBytes(file.fileSize)} · {file.contentType ?? 'unknown type'} ·{' '}
                      {file.isPending ? 'uploading...' : new Date(file.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={file.isPending}
                      onClick={() => void handleDownload(file)}
                      className="rounded-md border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      disabled={file.isPending}
                      onClick={() => void handleDelete(file.id)}
                      className="rounded-md border border-red-500/50 px-3 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
