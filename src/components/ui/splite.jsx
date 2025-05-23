'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

export function SplineScene({ scene, className }) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      }
    >
      <Spline
        scene={scene}
        className={className}
      />
    </Suspense>
  )
}