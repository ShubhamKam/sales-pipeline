import React from 'react';
import { usePipelineStore } from '@/store';
import { Card } from '@/components/ui/card';
import {
  DollarSign,
  Users,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export function Dashboard() {
  const stages = usePipelineStore((state) => state.stages);

  // Calculate metrics
  const totalDeals = stages.reduce((acc, stage) => acc + stage.deals.length, 0);
  const totalValue = stages.reduce(
    (acc, stage) => acc + stage.deals.reduce((sum, deal) => sum + deal.value, 0),
    0
  );
  const avgDealValue = totalDeals > 0 ? totalValue / totalDeals : 0;
  const closedDeals = stages.find((s) => s.id === 'closed')?.deals.length || 0;
  const conversionRate = totalDeals > 0 ? (closedDeals / totalDeals) * 100 : 0;

  // Stage distribution for the chart
  const stageDistribution = stages.map((stage) => ({
    name: stage.title,
    value: stage.deals.length,
  }));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <div className="p-6 flex items-start space-x-4">
            <div className="bg-blue-500/10 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Total Pipeline Value</p>
              <h3 className="text-2xl font-bold text-slate-900">
                ${totalValue.toLocaleString()}
              </h3>
              <div className="flex items-center text-sm text-green-600">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>12% from last month</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-start space-x-4">
            <div className="bg-purple-500/10 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Active Deals</p>
              <h3 className="text-2xl font-bold text-slate-900">{totalDeals}</h3>
              <div className="flex items-center text-red-600 text-sm">
                <ArrowDownRight className="h-4 w-4 mr-1" />
                <span>4% from last month</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-start space-x-4">
            <div className="bg-green-500/10 p-3 rounded-full">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Avg. Deal Value</p>
              <h3 className="text-2xl font-bold text-slate-900">
                ${Math.round(avgDealValue).toLocaleString()}
              </h3>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>8% from last month</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6 flex items-start space-x-4">
            <div className="bg-orange-500/10 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-500">Conversion Rate</p>
              <h3 className="text-2xl font-bold text-slate-900">
                {conversionRate.toFixed(1)}%
              </h3>
              <div className="flex items-center text-green-600 text-sm">
                <ArrowUpRight className="h-4 w-4 mr-1" />
                <span>2% from last month</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Pipeline Distribution</h3>
            <div className="space-y-4">
              {stageDistribution.map((stage) => (
                <div key={stage.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{stage.name}</span>
                    <span className="text-slate-500">{stage.value} deals</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{
                        width: `${(stage.value / totalDeals) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="col-span-3">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {stages.flatMap((stage) =>
                stage.deals
                  .slice(0, 2)
                  .map((deal) => (
                    <div
                      key={deal.id}
                      className="flex items-start space-x-3 border-b border-slate-100 pb-3 last:border-0"
                    >
                      <div className="bg-blue-500/10 p-2 rounded-full">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{deal.title}</p>
                        <p className="text-sm text-slate-500">
                          Added to {stage.title}
                        </p>
                      </div>
                      <div className="ml-auto text-sm font-medium text-green-600">
                        ${deal.value.toLocaleString()}
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}