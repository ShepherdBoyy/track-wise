import React from 'react'

export default function SectionCard({ step, title, children }) {
  return (
    <div className='bg-base-100 rounded-2xl border border-base-300 overflow-hidden'>
      <div className='flex items-center gap-3 px-5 py-3.5 border-b border-base-300 bg-base-50'>
        <div className='w-6 h-6 rounded-full bg-primary text-primary-content flex items-center justify-center shrink-0'>
          <span className='text-xs font-semibold'>{step}</span>
        </div>

        <span className='font-semibold text-sm'>{title}</span>
      </div>
      
      <div className='px-5 py-4'>
        {children}
      </div>
    </div>
  )
}