import React from 'react'
import { AGING_BUCKETS } from '../../utils/exportHelpers'

export default function AgingPeriodSelector({ selectedAging, agingAll, onAgingAll, onAgingBucket }) {
  return (
    <div className='flex flex-col gap-3'>
      <label className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
        agingAll
          ? "border-primary bg-primary/5"
          : "border-gray-200 hover:border-gray-300"
      }`}>
        <input
          type='checkbox'
          className='checkbox checkbox-primary checkbox-sm'
          checked={agingAll}
          onChange={onAgingAll}
        />
        <div className='flex flex-col'>
          <span className='text-sm font-semibold'>All Aging Periods</span>
          <span className='text-xs text-base-content/50'>Include every aging period in the report</span>
        </div>
      </label>

      <div className='flex items-center gap-3'>
        <div className='flex-1 h-px bg-base-300' />
        <span className='text-xs text-base-content/40'>or select individually</span>
        <div className='flex-1 h-px bg-base-300' />
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2'>
        {AGING_BUCKETS.map((bucket) => (
          <label
            key={bucket.value}
            className={`flex items-center gap-3 px-2 py-3 rounded-xl border-2 cursor-pointer transition-all ${
              selectedAging.includes(bucket.value)
                ? "border-primary bg-primary/5"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type='checkbox'
              className='checkbox checkbox-primary checkbox-sm'
              checked={selectedAging.includes(bucket.value)}
              onChange={() => onAgingBucket(bucket.value)}
            />

            <div className='flex flex-col'>
              <span className='text-sm font-semibold'>{bucket.label}</span>
              <span className='text-xs text-base-content/50'>{bucket.desc}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
