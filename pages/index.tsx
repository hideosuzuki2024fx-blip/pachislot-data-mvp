// 🔧 added: ゼロ手間記録の核となるMVPフロントエンドコード

import Head from 'next/head'
import { useState } from 'react'

const Home: React.FC = () => {
  // 記録状態を管理するstate
  const [isRecording, setIsRecording] = useState(false);

  // P1: ゼロ手間記録を開始・終了するシンプルなトグル関数
  const toggleRecording = () => {
    // 記録ロジック（将来的にSupabaseと連携）は後続フェーズで実装
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <Head>
        <title>パチスロ収支 (MVP)</title>
        <meta name="description" content="ゼロ手間記録と期待値可視化に特化したパチスロ収支管理アプリ" />
      </Head>

      <main className="flex flex-col items-center w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-white">
          {isRecording ? '遊技中...' : '記録を開始する'}
        </h1>

        {/* 記録開始・終了ボタン (P1: ゼロ手間記録のUI) */}
        <button
          onClick={toggleRecording}
          className={`w-full aspect-square rounded-full transition-all duration-300 shadow-2xl 
            ${isRecording 
              ? 'bg-red-600 hover:bg-red-700 text-white text-5xl border-8 border-red-400 animate-pulse'
              : 'bg-green-500 hover:bg-green-600 text-gray-900 text-5xl border-8 border-green-400'
            }`}
          style={{ width: 'min(80vw, 300px)', height: 'min(80vw, 300px)' }} // スマホでの視認性確保
        >
          {isRecording ? '終了/確定' : 'START'}
        </button>

        {isRecording && (
          <p className="text-red-300 text-lg">
            記録をストップするには、もう一度ボタンを押してください。
          </p>
        )}
      </main>

      <footer className="mt-10 text-gray-500 text-sm">
        MVP Verification Phase.
      </footer>
    </div>
  )
}

export default Home
