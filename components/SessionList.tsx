// 🔧 changed: P2の最終実装 - 累計収支と合計の計算・表示ロジックを追加

import React, { useEffect, useState, useMemo } from 'react'; // 🔧 changed: useMemoをインポート
import { supabase } from '../lib/supabase';

interface Session {
  id: string;
  start_time: string;
  end_time: string | null;
  investment: number;
  recovery: number;
}

const SessionList: React.FC<{ refreshKey: number }> = ({ refreshKey }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔧 added: データを集計するための計算ロジック（パフォーマンス最適化のためuseMemoを使用）
  const totals = useMemo(() => {
    const totalInvestment = sessions.reduce((sum, s) => sum + s.investment, 0);
    const totalRecovery = sessions.reduce((sum, s) => sum + s.recovery, 0);
    const totalBalance = totalRecovery - totalInvestment;

    return { totalInvestment, totalRecovery, totalBalance };
  }, [sessions]); // sessionsデータが更新されるたびに再計算する

  useEffect(() => {
    fetchSessions();
  }, [refreshKey]);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data: sessionsData, error } = await supabase
        .from('sessions')
        .select('*')
        .order('start_time', { ascending: false });

      if (error) throw error;
      
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
      
      {/* 🔧 added: 累計・合計表示UI */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-2xl mb-6 border-2 border-green-500">
        <p className="text-sm font-light text-gray-400">累積サマリー</p>
        <p 
          className={`text-4xl font-extrabold ${totals.totalBalance >= 0 ? 'text-green-400' : 'text-red-400'} transition-colors duration-300`}
        >
          {totals.totalBalance.toLocaleString()}円
        </p>
        <div className="flex justify-between text-sm mt-2 pt-2 border-t border-gray-700">
          <p className="text-gray-400">総投資額:</p>
          <p className="text-yellow-300 font-medium">{totals.totalInvestment.toLocaleString()}円</p>
        </div>
        <div className="flex justify-between text-sm">
          <p className="text-gray-400">総回収額:</p>
          <p className="text-blue-300 font-medium">{totals.totalRecovery.toLocaleString()}円</p>
        </div>
      </div>
      {/* 🔧 added: /累計・合計表示UI */}


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
