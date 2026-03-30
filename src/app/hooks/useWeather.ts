import { useState, useEffect } from 'react';
import { serverUrl } from '../lib/supabase';

interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  visibility: number;
  uvIndex: number;
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    rainChance: number;
    condition: string;
  }>;
  hourly: Array<{
    time: string;
    temp: number;
    humidity: number;
  }>;
}

export function useWeather(location?: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        setLoading(true);
        setError(null);

        const query = location ? `?location=${encodeURIComponent(location)}` : '';
        const response = await fetch(`${serverUrl}/weather${query}`);

        if (!response.ok) {
          throw new Error(`Weather API error: ${response.statusText}`);
        }

        const data = await response.json();
        setWeather(data);
      } catch (err) {
        console.error('Failed to fetch weather:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
        
        // Fallback to mock data
        setWeather({
          location: location || 'Ludhiana, Punjab',
          temperature: 28,
          condition: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 12,
          rainfall: 5,
          visibility: 10,
          uvIndex: 6,
          forecast: [
            { day: 'Mon', high: 30, low: 22, rainChance: 20, condition: 'Sunny' },
            { day: 'Tue', high: 29, low: 21, rainChance: 60, condition: 'Rainy' },
            { day: 'Wed', high: 28, low: 20, rainChance: 80, condition: 'Heavy Rain' },
            { day: 'Thu', high: 27, low: 19, rainChance: 40, condition: 'Cloudy' },
            { day: 'Fri', high: 29, low: 21, rainChance: 10, condition: 'Partly Cloudy' },
            { day: 'Sat', high: 31, low: 23, rainChance: 5, condition: 'Sunny' },
            { day: 'Sun', high: 32, low: 24, rainChance: 0, condition: 'Clear' },
          ],
          hourly: [
            { time: '00:00', temp: 22, humidity: 70 },
            { time: '03:00', temp: 20, humidity: 75 },
            { time: '06:00', temp: 21, humidity: 72 },
            { time: '09:00', temp: 25, humidity: 65 },
            { time: '12:00', temp: 28, humidity: 60 },
            { time: '15:00', temp: 30, humidity: 55 },
            { time: '18:00', temp: 27, humidity: 62 },
            { time: '21:00', temp: 24, humidity: 68 },
          ],
        });
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, [location]);

  return { weather, loading, error };
}
