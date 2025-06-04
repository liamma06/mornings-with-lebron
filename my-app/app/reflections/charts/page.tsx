'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import { format, parseISO } from 'date-fns';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { ChartOptions } from 'chart.js';

// Register Chart.js components
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
    [key: string]: number;
  };
  dominantEmotion: string;
  date: string;
}

export default function ReflectionsChartsPage() {
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleEmotions, setVisibleEmotions] = useState({
    happy: true,
    sad: true,
    anxious: true,
    hopeful: true, 
    tired: true,
    angry: true,
    calm: true
  });

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

  // Emoji for each emotion
  const emotionEmojis = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    hopeful: '🌱',
    tired: '😴',
    angry: '😠',
    calm: '😌'
  };

  useEffect(() => {
    const fetchReflections = async () => {
      try {
        const response = await fetch('http://localhost:5000/reflection');
        const data = await response.json();
        
        // Sort by date (oldest first for charts)
        const sortedData = data.sort((a: Reflection, b: Reflection) => 
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        
        setReflections(sortedData);
      } catch (err) {
        console.error('Error fetching reflection data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchReflections();
  }, []);

  const toggleEmotion = (emotion: keyof typeof visibleEmotions) => {
    setVisibleEmotions(prev => ({
      ...prev,
      [emotion]: !prev[emotion]
    }));
  };

  // Format dates for x-axis
  const labels = reflections.map(r => format(parseISO(r.date), 'MMM d'));

  // Prepare datasets (one per emotion)
  const datasets = Object.entries(emotionColors)
    .filter(([emotion]) => visibleEmotions[emotion as keyof typeof visibleEmotions])
    .map(([emotion, color]) => ({
      label: `${emotionEmojis[emotion as keyof typeof emotionEmojis]} ${emotion}`,
      data: reflections.map(r => r.emotions[emotion] * 100),
      borderColor: color,
      backgroundColor: color.replace('1)', '0.2)'),
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 4,
      pointHoverRadius: 6
    }));

  const chartData = {
    labels,
    datasets
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `${context.dataset.label}: ${context.raw.toFixed(0)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          // Fix the callback function signature to match what Chart.js expects
          callback: function(tickValue: number | string, index: number, ticks: any) {
            // Ensure we handle both string and number types
            const value = typeof tickValue === 'number' ? tickValue : parseFloat(tickValue);
            return `${value}%`;
          }
        },
        title: {
          display: true,
          text: 'Intensity'
        }
      }
    }
  };

  // Calculate emotion frequencies for insights
  const emotionFrequencies = Object.keys(emotionColors).map(emotion => {
    return {
      emotion,
      count: reflections.filter(r => r.dominantEmotion === emotion).length
    };
  });

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-yellow-50 py-20 flex items-center justify-center">
        <div className="text-amber-600 text-xl">Loading your emotional insights...</div>
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
      </div>
    );
  }

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
                backgroundColor: visibleEmotions[emotion as keyof typeof visibleEmotions] 
                  ? color.replace('1)', '0.1)') 
                  : '#f3f4f6',
                borderColor: visibleEmotions[emotion as keyof typeof visibleEmotions] 
                  ? color 
                  : '#d1d5db',
                color: visibleEmotions[emotion as keyof typeof visibleEmotions] 
                  ? '#1f2937' 
                  : '#9ca3af'
              }}
              onClick={() => toggleEmotion(emotion as keyof typeof visibleEmotions)}
            >
              <span>{emotionEmojis[emotion as keyof typeof emotionEmojis]}</span>
              <span className="capitalize">{emotion}</span>
            </button>
          ))}
        </div>

        {/* Chart display area */}
        <div className="h-80 mb-8">
          <Line data={chartData} options={chartOptions} />
        </div>

        {/* Insights section */}
        <div className="mt-8 bg-amber-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Key Insights</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="font-medium">Most common dominant emotion</p>
              {(() => {
                const emotionCounts = emotionFrequencies
                  .sort((a, b) => b.count - a.count);
                const topEmotion = emotionCounts[0];
                
                return topEmotion ? (
                  <div className="flex items-center mt-2">
                    <span className="text-xl mr-2">
                      {emotionEmojis[topEmotion.emotion as keyof typeof emotionEmojis]}
                    </span>
                    <span className="capitalize">{topEmotion.emotion}</span>
                    <span className="ml-auto text-amber-600 font-medium">
                      {((topEmotion.count / reflections.length) * 100).toFixed(0)}%
                    </span>
                  </div>
                ) : null;
              })()}
            </div>
            
            <div className="bg-white p-3 rounded shadow-sm">
              <p className="font-medium">Typical emotional balance</p>
              <div className="flex items-center mt-2">
                {Object.entries(emotionEmojis)
                  .sort((a, b) => {
                    const avgA = reflections.reduce((sum, r) => sum + r.emotions[a[0]], 0) / reflections.length;
                    const avgB = reflections.reduce((sum, r) => sum + r.emotions[b[0]], 0) / reflections.length;
                    return avgB - avgA;
                  })
                  .slice(0, 3)
                  .map(([emotion, emoji]) => (
                    <span key={emotion} className="mr-1" title={emotion}>{emoji}</span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}