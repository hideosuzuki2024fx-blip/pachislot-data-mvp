// 🔧 changed: PWA対応のためmanifest.jsonをリンク

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import SessionList from '../components/SessionList';

// 遊技セッションの型定義
interface Session {
  id: string;
  start_time: string;
  end_time: string | null;
  investment: number;
  recovery: number;
}

// ... (Homeコンポーネント内の関数は変更なし)

const Home: React.FC = () => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); 

  // ... (useEffect, toggleRecording, handleStartSession, handleEndSession関数は変更なし)

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <Head>
        <title>パチスロ収支 (MVP)</title>
        <meta name="description" content="ゼロ手間記録と期待値可視化に特化したパチスロ収支管理アプリ" />
        <link rel="manifest" href="/manifest.json" /> {/* 🔧 added: PWAマニフェストリンク */}
        <meta name="theme-color" content="#111827" /> {/* 🔧 added: PWAテーマカラー */}
      </Head>
      
      {/* ... (main, button, SessionListコンポーネントは変更なし) */}
      <main className="flex flex-col items-center w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-white">
          {activeSessionId ? '遊技中...' : '記録を開始する'}
        </h1>

        <button
          onClick={toggleRecording}
          disabled={loading}
          className={`w-full aspect-square rounded-full transition-all duration-300 shadow-2xl 
            ${activeSessionId 
              ? 'bg-red-600 hover:bg-red-700 text-white text-5xl border-8 border-red-400 animate-pulse'
              : 'bg-green-500 hover:bg-green-600 text-gray-900 text-5xl border-8 border-green-400'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          style={{ width: 'min(80vw, 300px)', height: 'min(80vw, 300px)' }}
        >
          {loading 
            ? '処理中...' 
            : activeSessionId ? '終了/確定' : 'START'
          }
        </button>

        {activeSessionId && (
          <p className="text-red-300 text-lg">
            記録をストップするには、もう一度ボタンを押してください。
          </p>
        )}
        
        <SessionList refreshKey={refreshKey} />

      </main>

      <footer className="mt-10 text-gray-500 text-sm">
        MVP Verification Phase.
      </footer>
    </div>
  )
}

export default Home
