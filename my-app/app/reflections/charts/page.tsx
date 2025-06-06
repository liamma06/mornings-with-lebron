'use client';

import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import Link from 'next/link';
import { API_BASE_URL } from '../../../lib/config';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Reflection {
  id: number;
  text: string;
  emotions: {
    happy: number;
    sad: number;
    anxious: number;
    hopeful: number;
    tired: number;
    angry: number;
    calm: number;
  };
  dominantEmotion: string;
  date: string;
}

interface VisibleEmotions {
  happy: boolean;
  sad: boolean;
  anxious: boolean;
  hopeful: boolean;
  tired: boolean;
  angry: boolean;
  calm: boolean;
}

export default function ReflectionsChartsPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);

  // Colors for each emotion
  const emotionColors = {
    happy: 'rgba(255, 206, 86, 1)',  // Yellow
    sad: 'rgba(54, 162, 235, 1)',     // Blue
    anxious: 'rgba(153, 102, 255, 1)', // Purple
    hopeful: 'rgba(75, 192, 192, 1)',  // Teal
    tired: 'rgba(201, 203, 207, 1)',   // Gray
    angry: 'rgba(255, 99, 132, 1)',    // Red
    calm: 'rgba(46, 204, 113, 1)'      // Green
  };

  // Emojis for each emotion
  const emotionEmojis = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    hopeful: '🌟',
    tired: '😴',
    angry: '😠',
    calm: '😌'
  };

  // State for toggling emotions visibility
  const [visibleEmotions, setVisibleEmotions] = useState<VisibleEmotions>({
    happy: true,
    sad: true,
    anxious: true,
    hopeful: true,
    tired: true,
    angry: true,
    calm: true
  });

  useEffect(() => {
    fetchReflections();
  }, []);

  const fetchReflections = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/reflection`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        setReflections(data);
      }
    } catch (error) {
      console.error('Error fetching reflections:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleEmotion = (emotion: keyof VisibleEmotions) => {
    setVisibleEmotions(prev => ({
      ...prev,
      [emotion]: !prev[emotion]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-yellow-50 py-12">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-xl text-amber-800">Loading your emotional journey...</p>
          </div>
        </div>
      </div>
    );
  }

  if (reflections.length < 2) {
    return (
      <div className="min-h-screen w-full bg-yellow-50 py-12">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Emotional Insights</h1>
            <Link href="/reflections">
              <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer">
                Back to Reflections
              </span>
            </Link>
          </div>
          
          <div className="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-amber-200 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-amber-800 mb-2">Not enough data yet</p>
            <p className="text-gray-600 mb-8">Add at least 2 reflections to see your emotional patterns.</p>
            
            <Link href="/reflections/new">
              <span className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors cursor-pointer">
                Add a New Reflection
              </span>
            </Link>
          </div>
        </div>
        
        {/* Back to Home Button */}
        <Link href="/" className="fixed bottom-6 right-24 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full shadow-lg transition-colors z-50">
          ← Home
        </Link>
      </div>
    );
  }

  // Prepare chart data
  const sortedReflections = [...reflections].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const chartData = {
    labels: sortedReflections.map(reflection => 
      new Date(reflection.date).toLocaleDateString()
    ),
    datasets: Object.entries(emotionColors)
      .filter(([emotion]) => visibleEmotions[emotion as keyof VisibleEmotions])
      .map(([emotion, color]) => ({
        label: `${emotionEmojis[emotion as keyof typeof emotionEmojis]} ${emotion.charAt(0).toUpperCase() + emotion.slice(1)}`,
        data: sortedReflections.map(reflection => 
          reflection.emotions[emotion as keyof typeof reflection.emotions]
        ),
        borderColor: color,
        backgroundColor: color.replace('1)', '0.1)'),
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }))
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Emotional Journey Over Time',
        font: {
          size: 18,
          weight: 'bold' as const
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: function(value: string | number) {
            return `${(Number(value) * 100).toFixed(0)}%`;
          }
        },
        title: {
          display: true,
          text: 'Emotion Intensity'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date'
        }
      }
    },
  };

  return (
    <div className="min-h-screen w-full bg-yellow-50 py-12">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Emotional Insights</h1>
          <Link href="/reflections">
            <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 transition-colors cursor-pointer">
              Back to Reflections
            </span>
          </Link>
        </div>

        {/* Emotion toggles */}
        <div className="flex flex-wrap gap-2 mb-4">
          {Object.entries(emotionColors).map(([emotion, color]) => (
            <button
              key={emotion}
              className="px-3 py-1 rounded-full text-sm flex items-center gap-1 border"
              style={{
                backgroundColor: visibleEmotions[emotion as keyof VisibleEmotions] 
                  ? color.replace('1)', '0.1)') 
                  : '#f3f4f6',
                borderColor: visibleEmotions[emotion as keyof VisibleEmotions] 
                  ? color 
                  : '#d1d5db',
                color: visibleEmotions[emotion as keyof VisibleEmotions] 
                  ? '#1f2937' 
                  : '#9ca3af'
              }}
              onClick={() => toggleEmotion(emotion as keyof VisibleEmotions)}
            >
              <span>{emotionEmojis[emotion as keyof typeof emotionEmojis]}</span>
              <span>{emotion.charAt(0).toUpperCase() + emotion.slice(1)}</span>
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="h-96 mb-6">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(emotionColors).map(([emotion, color]) => {
            const avgIntensity = sortedReflections.reduce((sum, reflection) => 
              sum + reflection.emotions[emotion as keyof typeof reflection.emotions], 0
            ) / sortedReflections.length;

            return (
              <div key={emotion} className="p-4 rounded-lg border" style={{backgroundColor: color.replace('1)', '0.05)')}}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{emotionEmojis[emotion as keyof typeof emotionEmojis]}</span>
                  <span className="font-semibold capitalize">{emotion}</span>
                </div>
                <div className="text-2xl font-bold" style={{color: color}}>
                  {(avgIntensity * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Average</div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Back to Home Button */}
      <Link href="/" className="fixed bottom-6 right-24 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full shadow-lg transition-colors z-50">
        ← Home
      </Link>
    </div>
  );
}