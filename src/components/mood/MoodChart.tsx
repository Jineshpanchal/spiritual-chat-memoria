
import React from "react";
import { MoodEntry } from "@/types/mood";
import { formatDate, getMoodColor } from "@/utils/moodUtils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip
} from "recharts";

interface MoodChartProps {
  entries: MoodEntry[];
  days?: number;
}

const MoodChart = ({ entries, days = 30 }: MoodChartProps) => {
  const chartConfig = {
    very_low: { 
      label: "Very Low", 
      theme: { 
        light: "#ef4444",
        dark: "#ef4444" 
      } 
    },
    low: { 
      label: "Low", 
      theme: { 
        light: "#f97316",
        dark: "#f97316" 
      } 
    },
    neutral: { 
      label: "Neutral", 
      theme: { 
        light: "#eab308",
        dark: "#eab308" 
      } 
    },
    good: { 
      label: "Good", 
      theme: { 
        light: "#84cc16",
        dark: "#84cc16" 
      } 
    },
    excellent: { 
      label: "Excellent", 
      theme: { 
        light: "#22c55e",
        dark: "#22c55e" 
      } 
    },
  };

  // Create an array of the last 'days' days
  const generateDateArray = () => {
    const dateArray = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Find entry for this date if exists
      const entry = entries.find(e => e.date.startsWith(dateString));
      
      dateArray.push({
        date: dateString,
        level: entry ? entry.level : null,
        formattedDate: formatDate(date.toISOString())
      });
    }
    
    return dateArray;
  };

  const chartData = generateDateArray();

  return (
    <div className="h-[300px] w-full">
      <ChartContainer
        config={chartConfig}
        className="h-full"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 16, right: 8, bottom: 32, left: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="formattedDate"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={8}
              tickFormatter={(value) => value.split(",")[0]}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  formatter={(value: number) => {
                    const labelMap = {
                      1: "Very Low",
                      2: "Low",
                      3: "Neutral",
                      4: "Good",
                      5: "Excellent"
                    };
                    return labelMap[value as keyof typeof labelMap] || "";
                  }}
                />
              }
            />
            <ReferenceLine y={3} stroke="#94a3b8" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="level"
              stroke="#9b87f5"
              strokeWidth={2}
              activeDot={{ r: 6, style: { fill: "#9b87f5", opacity: 0.8 } }}
              dot={(props: any) => {
                if (props.payload.level === null) {
                  return null;
                }
                return (
                  <circle
                    cx={props.cx}
                    cy={props.cy}
                    r={4}
                    fill={getMoodColor(props.payload.level)}
                    style={{ opacity: 0.8 }}
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default MoodChart;
