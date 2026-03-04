import { CalendarX2, DollarSign, FileText, TrendingUp } from 'lucide-react'
import React from 'react'

export default function KpiCards({ kpi }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
              <div className="flex justify-between items-start">
                  <div className="flex-1">
                      <h2 className="text-sm font-medium opacity-70 mb-2">
                          Total Outstanding
                      </h2>
                      <p className="text-2xl font-bold">
                          ₱{" "}{(kpi.totalOutstanding / 1000000).toFixed(2)}M
                      </p>
                      <p className="text-sm opacity-60 mt-2">
                          {kpi.totalCount.toLocaleString()} invoices
                      </p>
                  </div>
                  <div className="p-3 bg-four rounded-full ">
                      <DollarSign size={24} strokeWidth={1.5} />
                  </div>
              </div>
          </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
              <div className="flex justify-between items-start">
                  <div className="flex-1">
                      <h2 className="text-sm font-medium opacity-70 mb-2">Total Overdue</h2>
                      <p className="text-2xl font-bold">
                          ₱{" "}{(kpi.totalOverdue / 1000000).toFixed(2)}M
                      </p>
                      <p className="text-sm mt-2">
                          <span className="font-semibold text-error">{kpi.overduePercentage}%</span>
                          <span className="opacity-60"> of outstanding</span>
                      </p>
                  </div>
                  <div className="p-3 bg-three rounded-full">
                      <CalendarX2 size={24} strokeWidth={1.5} />
                  </div>
              </div>
          </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
              <div className="flex justify-between items-start">
                  <div className="flex-1">
                      <h2 className="text-sm font-medium opacity-70 mb-2">
                          Average Invoice Amount
                      </h2>
                      <p className="text-2xl font-bold">
                          ₱{" "}{(kpi.avgInvoiceAmount / 1000).toFixed(1)}K
                      </p>
                      <p className="text-sm opacity-60 mt-2">
                          per oustanding invoices
                      </p>
                  </div>
                  <div className="p-3 bg-five rounded-full">
                      <TrendingUp size={24} strokeWidth={1.5} />
                  </div>
              </div>
          </div>
      </div>

      <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
              <div className="flex justify-between items-start">
                  <div className="flex-1">
                      <h2 className="text-sm font-medium opacity-70 mb-2">Total Invoices</h2>
                      <p className="text-2xl font-bold">
                          {kpi.totalCount.toLocaleString()} invoices
                      </p>
                      <div className="flex gap-2 mt-2">
                          <div className="badge badge-info badge-sm">
                              {kpi.openCount.toLocaleString()} open
                          </div>
                          <div className="badge bg-rose-300 badge-sm">
                              {kpi.overdueCount.toLocaleString()} overdue
                          </div>
                      </div>
                  </div>
                  <div className="p-3 bg-two rounded-full">
                      <FileText size={24} strokeWidth={1.5} />
                  </div>
              </div>
          </div>
      </div>
  </div>
  )
}
