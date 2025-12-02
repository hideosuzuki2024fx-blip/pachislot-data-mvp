// 🔧 changed: P2の動的更新ロジックを実装 (components/SessionList.tsx)

import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Session {
  id: string;
  start_time: string;
  end_time: string | null;
  investment: number;
  recovery: number;
}

// 🔧 changed: refreshKeyをPropsで受け取る
const SessionList: React.FC<{ refreshKey: number }> = ({ refreshKey }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔧 changed: refreshKeyが変更されたら、データを再取得する
  useEffect(() => {
    fetchSessions();
  }, [refreshKey]); 

  const fetchSessions = async () => {
    setLoading(true);
    try {
      // データベースから全てのセッションデータを取得 (最新順)
      const { data: sessionsData, error } = await supabase
        .from('sessions')
        .select('*')
        .order('start_time', { ascending: false });

      if (error) throw error;
      
      // 取得したデータを状態にセット
      if (sessionsData) {
        setSessions(sessionsData as Session[]);
      }

    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center mt-8">データを読み込み中...</div>;
  }

  return (
    <div className="w-full mt-12">
      <h2 className="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">
        全記録セッション ({sessions.length}件)
      </h2>
      
      {sessions.length === 0 ? (
        <p className="text-gray-400">まだ記録がありません。STARTボタンを押して遊技を記録しましょう。</p>
      ) : (
        <ul className="space-y-4">
          {sessions.map((session) => (
            <li key={session.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <p className="text-sm text-gray-400">開始: {new Date(session.start_time).toLocaleString()}</p>
              <p className="text-lg font-bold text-white">収支: {session.recovery - session.investment}円</p>
              <p className="text-sm text-gray-400">投資: {session.investment}円 / 回収: {session.recovery}円</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionList;
