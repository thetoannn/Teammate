import React from 'react'
import { useSocket } from '@/contexts/socket'

export const SocketStatus: React.FC = () => {
  const { connected, socketId, connecting, error, socketManager } = useSocket()

  const handleLogStatus = () => {
    if (socketManager) {
      console.log('📊 === MANUAL SOCKET STATUS LOG ===')
      socketManager.logStatus()
    } else {
      console.log('❌ No socket manager available')
    }
  }

  const handleTestPing = () => {
    if (socketManager && connected) {
      console.log('🏓 Testing ping...')
      socketManager.ping('test-ping-from-ui')
    } else {
      console.log('⚠️ Cannot ping - socket not connected')
    }
  }

  return (
    <div></div>
    // <div className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm">
    //   <h3 className="text-sm font-semibold mb-2">🔌 Socket Status</h3>
      
    //   <div className="space-y-2 text-xs">
    //     <div className="flex items-center gap-2">
    //       <span>Status:</span>
    //       <span className={`px-2 py-1 rounded text-xs ${
    //         connected ? 'bg-green-500' : connecting ? 'bg-yellow-500' : 'bg-red-500'
    //       }`}>
    //         {connected ? '✅ Connected' : connecting ? '🔄 Connecting' : '❌ Disconnected'}
    //       </span>
    //     </div>
        
    //     {socketId && (
    //       <div className="flex items-center gap-2">
    //         <span>ID:</span>
    //         <span className="font-mono text-xs bg-gray-700 px-2 py-1 rounded">
    //           {socketId.slice(0, 8)}...
    //         </span>
    //       </div>
    //     )}
        
    //     {error && (
    //       <div className="text-red-400 text-xs">
    //         Error: {error}
    //       </div>
    //     )}
    //   </div>
      
    //   <div className="mt-3 space-y-2">
    //     <button
    //       onClick={handleLogStatus}
    //       className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded"
    //     >
    //       📊 Log Status
    //     </button>
        
    //     <button
    //       onClick={handleTestPing}
    //       disabled={!connected}
    //       className={`w-full text-xs px-3 py-1 rounded ${
    //         connected 
    //           ? 'bg-green-600 hover:bg-green-700 text-white' 
    //           : 'bg-gray-500 text-gray-300 cursor-not-allowed'
    //       }`}
    //     >
    //       🏓 Test Ping
    //     </button>
    //   </div>
      
    //   <div className="mt-2 text-xs text-gray-400">
    //     Check console for detailed logs
    //   </div>
    // </div>
  )
}
