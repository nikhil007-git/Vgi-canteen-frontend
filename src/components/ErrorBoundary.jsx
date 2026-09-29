import React from 'react';
import { AlertTriangle, RefreshCw, Home, Sparkles } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);

    // Check if error is due to stale deployment chunks
    const isChunkError =
      error?.message?.includes('dynamically imported module') ||
      error?.message?.includes('Failed to load module script') ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Failed to fetch dynamically');

    if (isChunkError) {
      const lastReload = Number(sessionStorage.getItem('chunk_reload_time') || 0);
      if (Date.now() - lastReload > 12000) {
        sessionStorage.setItem('chunk_reload_time', String(Date.now()));
        window.location.reload();
      }
    }
  }

  handleHardReload = () => {
    try {
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } catch (e) {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const isChunkError =
        this.state.error?.message?.includes('dynamically imported module') ||
        this.state.error?.message?.includes('Failed to load module script') ||
        this.state.error?.message?.includes('Loading chunk');

      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl text-center space-y-4">
            <div className={`w-16 h-16 ${isChunkError ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'} rounded-2xl flex items-center justify-center mx-auto`}>
              {isChunkError ? <Sparkles className="w-8 h-8" /> : <AlertTriangle className="w-8 h-8" />}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {isChunkError ? 'New Update Available' : 'Something went wrong'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {isChunkError
                ? 'A new version of the app was recently deployed. Please refresh to load the latest changes.'
                : 'An unexpected error occurred while loading this page.'}
            </p>
            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-700 text-left font-mono text-xs text-rose-300 overflow-x-auto max-h-40">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleHardReload}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{isChunkError ? 'Refresh Application' : 'Reload Page'}</span>
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Go to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
