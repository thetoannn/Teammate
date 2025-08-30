import { SocketIOManager } from '@/lib/socket'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface SocketContextType {
  connected: boolean
  socketId?: string
  connecting: boolean
  error?: string
  socketManager: SocketIOManager | null
}

const SocketContext = createContext<SocketContextType>({
  connected: false,
  connecting: false,
  socketManager: null,
})

interface SocketProviderProps {
  children: React.ReactNode
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { t } = useTranslation()
  const [connected, setConnected] = useState(false)
  const [socketId, setSocketId] = useState<string>()
  const [connecting, setConnecting] = useState(true)
  const [error, setError] = useState<string>()

  // Use useRef to maintain socket manager instance across re-renders
  const socketManagerRef = useRef<SocketIOManager | null>(null)

  useEffect(() => {
    let mounted = true

    const initializeSocket = async () => {
      try {
        console.log('🚀 Initializing Socket.IO connection...')
        setConnecting(true)
        setError(undefined)

        // Create socket manager instance if not exists
        if (!socketManagerRef.current) {
          console.log('🔧 Creating new SocketIOManager instance...')
          socketManagerRef.current = new SocketIOManager({
            serverUrl: 'https://image-agent.nhansuso.vn',
            autoConnect: false
          })
        }

        const socketManager = socketManagerRef.current
        console.log('🔌 Attempting to connect to socket server...')
        await socketManager.connect()

        if (mounted) {
          setConnected(true)
          setSocketId(socketManager.getSocketId())
          setConnecting(false)
          console.log('✅ Socket.IO context updated successfully')

          const socket = socketManager.getSocket()
          if (socket) {
            const handleConnect = () => {
              if (mounted) {
                console.log('🔗 Socket connected event received in context')
                setConnected(true)
                setSocketId(socketManager.getSocketId())
                setConnecting(false)
                setError(undefined)
              }
            }

            const handleDisconnect = () => {
              if (mounted) {
                console.log('🔌 Socket disconnected event received in context')
                setConnected(false)
                setSocketId(undefined)
                setConnecting(false)
              }
            }

            const handleConnectError = (error: Error) => {
              if (mounted) {
                console.error('❌ Socket connect error event received in context:', error)
                setError(error.message || '❌ Socket.IO Connection Error')
                setConnected(false)
                setConnecting(false)
              }
            }

            socket.on('connect', handleConnect)
            socket.on('disconnect', handleDisconnect)
            socket.on('connect_error', handleConnectError)

            return () => {
              console.log('🧹 Cleaning up socket event listeners...')
              socket.off('connect', handleConnect)
              socket.off('disconnect', handleDisconnect)
              socket.off('connect_error', handleConnectError)
            }
          }
        }
      } catch (err) {
        if (mounted) {
          console.error('💥 Socket initialization failed:', err)
          setError(err instanceof Error ? err.message : 'Unknown error')
          setConnected(false)
          setConnecting(false)
        }
      }
    }

    initializeSocket()

    return () => {
      console.log('🔄 SocketProvider unmounting, cleaning up...')
      mounted = false
      // Clean up socket connection when component unmounts
      if (socketManagerRef.current) {
        console.log('🔌 Disconnecting socket on unmount...')
        socketManagerRef.current.disconnect()
        socketManagerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    console.log('📢 Notification manager initialized')
  }, [])

  // Log socket status changes
  useEffect(() => {
    console.log('📊 Socket context state changed:', {
      connected,
      socketId,
      connecting,
      hasError: !!error
    })
  }, [connected, socketId, connecting, error])

  const value: SocketContextType = {
    connected,
    socketId,
    connecting,
    error,
    socketManager: socketManagerRef.current,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}

      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-3 py-2 rounded-md shadow-lg">
          {socketManagerRef.current?.isMaxReconnectAttemptsReached()
            ? t('socket.maxRetriesReached')
            : t('socket.connectionError', {
              current: socketManagerRef.current?.getReconnectAttempts() || 0,
              max: 5,
              error
            })}
        </div>
      )}
    </SocketContext.Provider>
  )
}

// Hook để sử dụng socket context
export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}
