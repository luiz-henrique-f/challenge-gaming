// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
// import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from './context/AuthContext.tsx'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import React from 'react'

import { routeTree } from './routeTree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="dark">
      <div className='bg-background text-foreground'>
        <AuthProvider>
    <RouterProvider router={router} />
        </AuthProvider>
      </div>
    </div>
  </React.StrictMode>,
)

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <div className="dark">
//       <div className='bg-background text-foreground'>
//         <AuthProvider>
//         <App />
//         <Toaster position='top-right'/>
//         </AuthProvider>
//       </div>
//     </div>
//   </StrictMode>,
// )
