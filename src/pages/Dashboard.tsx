
import Navbar from '@/components/Navbar';
import StatCard from '@/components/StatCard';
import ChartContainer from '@/components/ChartContainer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

// Mock data for now - we'll replace this with real data later
const commitData = [
  { name: 'Mon', commits: 12 },
  { name: 'Tue', commits: 19 },
  { name: 'Wed', commits: 8 },
  { name: 'Thu', commits: 15 },
  { name: 'Fri', commits: 25 },
  { name: 'Sat', commits: 6 },
  { name: 'Sun', commits: 4 },
];

const languageData = [
  { name: 'TypeScript', value: 45, color: '#3178c6' },
  { name: 'JavaScript', value: 30, color: '#f7df1e' },
  { name: 'Python', value: 15, color: '#3776ab' },
  { name: 'Other', value: 10, color: '#8884d8' },
];

const prData = [
  { month: 'Jan', opened: 15, merged: 12, closed: 2 },
  { month: 'Feb', opened: 22, merged: 18, closed: 3 },
  { month: 'Mar', opened: 18, merged: 16, closed: 1 },
  { month: 'Apr', opened: 25, merged: 22, closed: 2 },
  { month: 'May', opened: 20, merged: 17, closed: 2 },
  { month: 'Jun', opened: 28, merged: 24, closed: 3 },
];

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold">Welcome to your Dashboard!</h1>
            <p className="text-muted-foreground mt-2">
              Here's an overview of your GitHub activity and collaboration metrics
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-slide-up">
            <StatCard
              title="Total Repositories"
              value="24"
              description="8 active this month"
              trend={{ value: 12, isPositive: true }}
            />
            <StatCard
              title="Total Commits"
              value="1,247"
              description="89 this week"
              trend={{ value: 8, isPositive: true }}
            />
            <StatCard
              title="Pull Requests"
              value="156"
              description="12 pending review"
              trend={{ value: -3, isPositive: false }}
            />
            <StatCard
              title="Code Reviews"
              value="89"
              description="5 completed today"
              trend={{ value: 15, isPositive: true }}
            />
          </div>

          {/* Charts Grid */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Commit Activity */}
            <ChartContainer 
              title="Weekly Commit Activity" 
              description="Commits made in the last 7 days"
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={commitData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="commits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            {/* Language Distribution */}
            <ChartContainer 
              title="Language Distribution" 
              description="Programming languages used across repositories"
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Pull Request Trends */}
          <ChartContainer 
            title="Pull Request Trends" 
            description="Monthly pull request activity over the last 6 months"
            className="w-full"
          >
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={prData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
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
      </main>
    </div>
  );
};

export default Dashboard;
