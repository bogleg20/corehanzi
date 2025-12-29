"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProgressBar } from "@/components/ProgressBar";

interface Stats {
  learnedCount: number;
  dueReviewsCount: number;
  streak: number;
  levelProgress: { level: number; learned: number; total: number }[];
  todayStats: { newWordsToday: number; reviewsToday: number };
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load dashboard.</p>
      </div>
    );
  }

  const totalWords = stats.levelProgress.reduce((sum, l) => sum + l.total, 0);
  const totalLearned = stats.levelProgress.reduce(
    (sum, l) => sum + l.learned,
    0
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome Back!
        </h1>
        <p className="text-gray-600">
          Ready to continue your Chinese learning journey?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-red-600">
            {stats.streak}
          </div>
          <div className="text-sm text-gray-500">Day Streak</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">
            {stats.learnedCount}
          </div>
          <div className="text-sm text-gray-500">Words Learned</div>
        </div>
        <div className="bg-white rounded-xl shadow p-4 text-center">
          <div className="text-3xl font-bold text-orange-600">
            {stats.dueReviewsCount}
          </div>
          <div className="text-sm text-gray-500">Due Reviews</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link
          href="/learn"
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-6 text-center transition-colors"
        >
          <div className="text-3xl mb-2">📖</div>
          <div className="text-lg font-medium">Learn New Words</div>
          <div className="text-sm opacity-80">
            {totalWords - totalLearned} words remaining
          </div>
        </Link>
        <Link
          href="/review"
          className={`rounded-xl p-6 text-center transition-colors ${
            stats.dueReviewsCount > 0
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-200 text-gray-500"
          }`}
        >
          <div className="text-3xl mb-2">🔄</div>
          <div className="text-lg font-medium">Review</div>
          <div className="text-sm opacity-80">
            {stats.dueReviewsCount > 0
              ? `${stats.dueReviewsCount} cards due`
              : "All caught up!"}
          </div>
        </Link>
      </div>

      {/* Today's Activity */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Today&apos;s Activity
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.todayStats.newWordsToday}
            </div>
            <div className="text-sm text-gray-600">New Words</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.todayStats.reviewsToday}
            </div>
            <div className="text-sm text-gray-600">Reviews Done</div>
          </div>
        </div>
      </div>

      {/* Progress by Level */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Progress by HSK Level
        </h2>
        <div className="space-y-4">
          {stats.levelProgress.map((level) => (
            <ProgressBar
              key={level.level}
              current={level.learned}
              total={level.total}
              label={`HSK ${level.level}`}
              color={
                level.level === 1 ? "green" : level.level === 2 ? "blue" : "red"
              }
            />
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/practice"
          className="bg-white hover:bg-gray-50 rounded-xl shadow p-4 text-center transition-colors"
        >
          <div className="text-2xl mb-1">✏️</div>
          <div className="font-medium text-gray-900">Practice</div>
        </Link>
        <Link
          href="/words"
          className="bg-white hover:bg-gray-50 rounded-xl shadow p-4 text-center transition-colors"
        >
          <div className="text-2xl mb-1">📖</div>
          <div className="font-medium text-gray-900">Browse Words</div>
        </Link>
      </div>
    </div>
  );
}
