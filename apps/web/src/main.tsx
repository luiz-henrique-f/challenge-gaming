// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
// import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from './context/AuthContext.tsx'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import ReactDOM from 'react-dom/client'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { routeTree } from './routeTree.gen'
import { Toaster } from 'sonner'
import { NotificationsProvider } from './components/notifications/NotificationsProvider.tsx'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="dark">
      <div className='text-foreground'>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <NotificationsProvider>
              <Toaster position='top-right' />
              <RouterProvider router={router} />
            </NotificationsProvider>
          </QueryClientProvider>
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
