// 🔧 changed: ゼロ手間記録（P1）ロジックの実装。Supabase連携とセッション管理を追加。

import Head from 'next/head';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // 🔧 changed: Supabaseクライアントをインポート

// 遊技セッションの型定義
interface Session {
  id: string;
  start_time: string;
  end_time: string | null;
  investment: number;
  recovery: number;
}

const Home: React.FC = () => {
  // isRecordingではなく、現在のセッションID（遊技中ならそのID）を保持
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null); // 🔧 changed
  const [loading, setLoading] = useState(true);

  // 1. 起動時にアクティブなセッションをチェックする (将来的にはユーザー認証と連携)
  // MVP検証フェーズでは、ローカルストレージを使って単純にアクティブセッションを保持します
  useEffect(() => {
    const savedSessionId = localStorage.getItem('activeSessionId');
    if (savedSessionId) {
      setActiveSessionId(savedSessionId);
    }
    setLoading(false);
  }, []);

  // 2. ゼロ手間記録の核心ロジック
  const toggleRecording = async () => {
    if (loading) return;
    setLoading(true);

    if (activeSessionId) {
      // 終了処理
      await handleEndSession();
    } else {
      // 開始処理
      await handleStartSession();
    }
    setLoading(false);
  };

  // 3. 遊技開始処理
  const handleStartSession = async () => {
    try {
      // データベースに開始時刻のみを挿入
      const { data, error } = await supabase
        .from('sessions')
        .insert([{ user_id: 'mvp_anon_user' }]) // MVP検証中は仮のユーザーIDを使用
        .select('id')
        .single();
      
      if (error) throw error;
      
      const newSessionId = data.id;
      setActiveSessionId(newSessionId);
      localStorage.setItem('activeSessionId', newSessionId);
      alert('遊技記録を開始しました。\nデータ保存が始まりました。');

    } catch (error) {
      console.error('Error starting session:', error);
      alert('記録開始に失敗しました。コンソールを確認してください。');
    }
  };

  // 4. 遊技終了処理
  const handleEndSession = async () => {
    // 終了時に投資額と回収額をアラートで取得し、入力の手間を最小化（P1解決）
    const investmentStr = prompt('遊技終了！\n投資金額（円）を入力してください（例: 20000）:', '0');
    const recoveryStr = prompt('回収金額（円）を入力してください（例: 50000）:', '0');
    
    // 入力値のバリデーションと数値変換
    const investment = parseInt(investmentStr || '0', 10);
    const recovery = parseInt(recoveryStr || '0', 10);

    if (isNaN(investment) || isNaN(recovery) || investment < 0 || recovery < 0) {
      alert('入力が無効です。終了処理を中断します。');
      return;
    }

    try {
      // データベースの該当セッションを更新
      const { error } = await supabase
        .from('sessions')
        .update({ 
          end_time: new Date().toISOString(), // 終了時刻を自動記録
          investment: investment,
          recovery: recovery,
        })
        .eq('id', activeSessionId);
      
      if (error) throw error;

      // 状態とローカルストレージをクリア
      setActiveSessionId(null);
      localStorage.removeItem('activeSessionId');
      alert(`記録を確定しました。\n収支: ${recovery - investment}円`);

    } catch (error) {
      console.error('Error ending session:', error);
      alert('記録終了に失敗しました。コンソールを確認してください。');
    }
  };


  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <Head>
        <title>パチスロ収支 (MVP)</title>
        <meta name="description" content="ゼロ手間記録と期待値可視化に特化したパチスロ収支管理アプリ" />
      </Head>

      <main className="flex flex-col items-center w-full max-w-md space-y-8">
        <h1 className="text-3xl font-bold text-white">
          {activeSessionId ? '遊技中...' : '記録を開始する'}
        </h1>

        {/* 記録開始・終了ボタン (P1: ゼロ手間記録のUI) */}
        <button
          onClick={toggleRecording}
          disabled={loading} // 処理中はボタンを無効化
          className={`w-full aspect-square rounded-full transition-all duration-300 shadow-2xl 
            ${activeSessionId 
              ? 'bg-red-600 hover:bg-red-700 text-white text-5xl border-8 border-red-400 animate-pulse'
              : 'bg-green-500 hover:bg-green-600 text-gray-900 text-5xl border-8 border-green-400'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          style={{ width: 'min(80vw, 300px)', height: 'min(80vw, 300px)' }} // スマホでの視認性確保
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
      </main>

      <footer className="mt-10 text-gray-500 text-sm">
        MVP Verification Phase.
      </footer>
    </div>
  )
}

export default Home
