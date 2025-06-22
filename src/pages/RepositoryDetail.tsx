
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import ChartContainer from '@/components/ChartContainer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

// Mock data for repository analytics
const contributorData = [
  { name: 'John Doe', commits: 145, color: '#8884d8' },
  { name: 'Jane Smith', commits: 89, color: '#82ca9d' },
  { name: 'Bob Wilson', commits: 67, color: '#ffc658' },
  { name: 'Alice Brown', commits: 45, color: '#ff7300' },
  { name: 'Charlie Davis', commits: 23, color: '#00ff88' },
];

const commitTimelineData = [
  { date: '2024-01-01', commits: 12 },
  { date: '2024-01-08', commits: 19 },
  { date: '2024-01-15', commits: 8 },
  { date: '2024-01-22', commits: 15 },
  { date: '2024-01-29', commits: 25 },
  { date: '2024-02-05', commits: 18 },
  { date: '2024-02-12', commits: 22 },
];

const issueStatusData = [
  { name: 'Open', value: 12, color: '#ff7300' },
  { name: 'Closed', value: 45, color: '#82ca9d' },
  { name: 'In Progress', value: 8, color: '#8884d8' },
];

const prActivityData = [
  { week: 'Week 1', opened: 5, merged: 3, closed: 1 },
  { week: 'Week 2', opened: 8, merged: 6, closed: 1 },
  { week: 'Week 3', opened: 6, merged: 4, closed: 2 },
  { week: 'Week 4', opened: 7, merged: 5, closed: 1 },
];

const RepositoryDetail = () => {
  const { name } = useParams<{ name: string }>();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">{name}</h1>
                <p className="text-muted-foreground mt-2">
                  Detailed analytics and collaboration insights
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="outline">Public</Badge>
                <Button variant="outline">
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>

          {/* Repository Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
            <StatCard
              title="Total Commits"
              value="369"
              description="28 this month"
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              title="Contributors"
              value="5"
              description="2 active this week"
              trend={{ value: 25, isPositive: true }}
            />
            <StatCard
              title="Pull Requests"
              value="47"
              description="3 pending review"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Issues"
              value="65"
              description="12 currently open"
              trend={{ value: -12, isPositive: false }}
            />
          </div>

          {/* Main Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Contributor Activity */}
            <ChartContainer 
              title="Top Contributors" 
              description="Commit count by team member"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contributorData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip />
                  <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Issue Status */}
            <ChartContainer 
              title="Issue Status Distribution" 
              description="Current state of repository issues"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={issueStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {issueStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Issues']} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Timeline Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Commit Timeline */}
            <ChartContainer 
              title="Commit Activity Timeline" 
              description="Weekly commit frequency over time"
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={commitTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <Area 
                    type="monotone" 
                    dataKey="commits" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* PR Activity */}
            <ChartContainer 
              title="Pull Request Activity" 
              description="Weekly PR statistics"
            >
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="opened" 
                    stroke="#8884d8" 
                    strokeWidth={3}
                    name="Opened"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="merged" 
                    stroke="#82ca9d" 
                    strokeWidth={3}
                    name="Merged"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="closed" 
                    stroke="#ff7300" 
                    strokeWidth={3}
                    name="Closed"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RepositoryDetail;
