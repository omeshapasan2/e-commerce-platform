import { useState, useMemo } from "react";
import { useGetDailySalesQuery } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

const TZ = "Asia/Colombo";

function formatDateLabel(isoDate) {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleDateString("en-LK", { month: "short", day: "numeric", timeZone: TZ });
}

export default function AdminSalesPage() {
  const [range, setRange] = useState("7d");
  const { data, isLoading, isError, refetch } = useGetDailySalesQuery(range);
  const series = data?.data || [];

  const total = useMemo(
    () => series.reduce((sum, p) => sum + (Number(p.total) || 0), 0),
    [series]
  );

  return (
    <main className="px-4 lg:px-16 min-h-screen py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold">Sales Dashboard</h1>
          <p className="text-sm opacity-70">Daily totals ({data?.timezone || TZ})</p>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-70">Range total</div>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("en-LK", { style: "currency", currency: "USD" }).format(total)}
          </div>
        </div>
      </div>

      <Tabs value={range} onValueChange={(v) => setRange(v)}>
        <TabsList>
          <TabsTrigger value="7d">Last 7 days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 days</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="py-4 sm:py-0">
        <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
            <CardTitle>Daily Sales</CardTitle>
            <CardDescription>Totals per day for the selected range</CardDescription>
          </div>
          <div className="flex">
            <button
              onClick={() => refetch()}
              className="border-t sm:border-t-0 sm:border-l px-6 py-4 sm:px-8 sm:py-6 text-sm hover:bg-muted/50"
              title="Refresh"
            >
              Refresh
            </button>
          </div>
        </CardHeader>

        <CardContent className="px-2 sm:p-6">
          {isLoading && (
            <div className="flex items-center justify-center h-[300px]">
              <Spinner variant="ellipsis" size={32} />
            </div>
          )}

          {isError && (
            <div className="text-sm text-red-600 px-2 py-4">
              Couldn’t load sales data
              <button onClick={() => refetch()} className="ml-3 underline">Try again</button>
            </div>
          )}
          {!isLoading && !isError && (
            <ChartContainer
              config={{
                total: { label: "Total", color: "var(--chart-1)" },
              }}
              className="aspect-auto h-[300px] w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  accessibilityLayer
                  data={series}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={24}
                    interval={series.length > 14 ? 2 : 0}
                    tickFormatter={formatDateLabel}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[160px]"
                        nameKey="total"
                        labelFormatter={(value) =>
                          new Date(`${value}T00:00:00`).toLocaleDateString("en-LK", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            timeZone: TZ,
                          })
                        }
                        valueFormatter={(v) =>
                          new Intl.NumberFormat("en-LK", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          }).format(Number(v) || 0)
                        }
                      />
                    }
                  />
                  <Line
                    dataKey="total"
                    type="monotone"
                    stroke={`var(--chart-1)`}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </CardContent>
      </Card>
    </main>
  );
}