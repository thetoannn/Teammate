import * as ISocket from '@/types/socket'
import { io, Socket } from 'socket.io-client'
import { eventBus } from './event'

export interface SocketConfig {
  serverUrl?: string
  autoConnect?: boolean
}

export class SocketIOManager {
  private socket: Socket | null = null
  private connected = false
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000

  constructor(private config: SocketConfig = {}) {
    console.log('🚀 SocketIOManager initialized with config:', config)
    if (config.autoConnect !== false) {
      this.connect()
    }
  }

  connect(serverUrl?: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const url = serverUrl || this.config.serverUrl
      console.log('🔌 Attempting to connect to socket server:', url)

      if (this.socket) {
        console.log('🔄 Disconnecting existing socket before reconnecting...')
        this.socket.disconnect()
      }

      this.socket = io(url, {
        transports: ['websocket'],
        upgrade: false,
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: this.reconnectDelay,
      })

      this.socket.on('connect', () => {
        console.log('✅ Socket.IO connected successfully!')
        console.log('📱 Socket ID:', this.socket?.id)
        console.log('🌐 Server URL:', url)
        console.log('🔗 Transport:', this.socket?.io.engine.transport.name)
        this.connected = true
        this.reconnectAttempts = 0
        resolve(true)
      })

      this.socket.on('connect_error', (error) => {
        console.error('❌ Socket.IO connection error:', error)
        console.error('🔍 Error details:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        })
        this.connected = false
        this.reconnectAttempts++

        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          console.error(`💥 Max reconnection attempts (${this.maxReconnectAttempts}) reached. Giving up.`)
          reject(
            new Error(
              `Failed to connect after ${this.maxReconnectAttempts} attempts`
            )
          )
        } else {
          console.log(`🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts} failed. Retrying in ${this.reconnectDelay}ms...`)
        }
      })

      this.socket.on('disconnect', (reason) => {
        console.log('🔌 Socket.IO disconnected:', reason)
        console.log('📊 Disconnect details:', {
          reason,
          wasConnected: this.connected,
          socketId: this.socket?.id
        })
        this.connected = false
      })

      this.socket.on('reconnect', (attemptNumber) => {
        console.log(`🔄 Socket.IO reconnected after ${attemptNumber} attempts!`)
        console.log('📱 New Socket ID:', this.socket?.id)
        this.connected = true
        this.reconnectAttempts = 0
      })

      this.socket.on('reconnect_attempt', (attemptNumber) => {
        console.log(`🔄 Reconnection attempt ${attemptNumber}/${this.maxReconnectAttempts}...`)
      })

      this.socket.on('reconnect_error', (error) => {
        console.error('❌ Socket.IO reconnection error:', error)
        console.error('🔍 Reconnection error details:', {
          message: error.message,
          name: error.name,
          attempt: this.reconnectAttempts
        })
      })

      this.socket.on('reconnect_failed', () => {
        console.error('💥 Socket.IO reconnection failed after all attempts')
        this.connected = false
      })

      this.registerEventHandlers()
    })
  }

  private registerEventHandlers() {
    if (!this.socket) return

    this.socket.on('connected', (data) => {
      console.log('🔗 Socket.IO connection confirmed:', data)
    })

    this.socket.on('init_done', (data) => {
      console.log('🔗 Server initialization done:', data)
    })

    this.socket.on('session_update', (data) => {
      this.handleSessionUpdate(data)
    })

    this.socket.on('pong', (data) => {
      console.log('🔗 Pong received:', data)
    })
  }

  private handleSessionUpdate(data: ISocket.SessionUpdateEvent) {
    const { session_id, type } = data

    if (!session_id) {
      console.warn('⚠️ Session update missing session_id:', data)
      return
    }

    switch (type) {
      case ISocket.SessionEventType.Delta:
        eventBus.emit('Socket::Session::Delta', data)
        break
      case ISocket.SessionEventType.ToolCall:
        eventBus.emit('Socket::Session::ToolCall', data)
        break
      case ISocket.SessionEventType.ToolCallPendingConfirmation:
        eventBus.emit('Socket::Session::ToolCallPendingConfirmation', data)
        break
      case ISocket.SessionEventType.ToolCallConfirmed:
        eventBus.emit('Socket::Session::ToolCallConfirmed', data)
        break
      case ISocket.SessionEventType.ToolCallCancelled:
        eventBus.emit('Socket::Session::ToolCallCancelled', data)
        break
      case ISocket.SessionEventType.ToolCallArguments:
        eventBus.emit('Socket::Session::ToolCallArguments', data)
        break
      case ISocket.SessionEventType.ToolCallProgress:
        eventBus.emit('Socket::Session::ToolCallProgress', data)
        break
      case ISocket.SessionEventType.ImageGenerated:
        eventBus.emit('Socket::Session::ImageGenerated', data)
        break
      case ISocket.SessionEventType.VideoGenerated:
        eventBus.emit('Socket::Session::VideoGenerated', data)
        break
      case ISocket.SessionEventType.AllMessages:
        eventBus.emit('Socket::Session::AllMessages', data)
        break
      case ISocket.SessionEventType.Done:
        eventBus.emit('Socket::Session::Done', data)
        break
      case ISocket.SessionEventType.Error:
        eventBus.emit('Socket::Session::Error', data)
        break
      case ISocket.SessionEventType.Info:
        eventBus.emit('Socket::Session::Info', data)
        break
      case ISocket.SessionEventType.ToolCallResult:
        eventBus.emit('Socket::Session::ToolCallResult', data)
        break
      default:
        console.log('⚠️ Unknown session update type:', type)
    }
  }

  ping(data: unknown) {
    if (this.socket && this.connected) {
      console.log('🏓 Sending ping with data:', data)
      this.socket.emit('ping', data)
    } else {
      console.warn('⚠️ Cannot send ping - socket not connected')
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('🔌 Manually disconnecting socket...')
      this.socket.disconnect()
      this.socket = null
      this.connected = false
      console.log('✅ Socket manually disconnected')
    } else {
      console.log('ℹ️ No socket to disconnect')
    }
  }

  isConnected(): boolean {
    const status = this.connected
    console.log(`📊 Socket connection status: ${status ? '✅ Connected' : '❌ Disconnected'}`)
    return status
  }

  getSocketId(): string | undefined {
    const id = this.socket?.id
    console.log(`📱 Current Socket ID: ${id || 'None'}`)
    return id
  }

  getSocket(): Socket | null {
    return this.socket
  }

  getReconnectAttempts(): number {
    console.log(`🔄 Reconnection attempts: ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
    return this.reconnectAttempts
  }

  isMaxReconnectAttemptsReached(): boolean {
    const reached = this.reconnectAttempts >= this.maxReconnectAttempts
    console.log(`🚫 Max reconnection attempts reached: ${reached}`)
    return reached
  }

  // Thêm method để log trạng thái tổng quan
  logStatus(): void {
    console.log('📊 === SOCKET STATUS ===')
    console.log(`🔗 Connected: ${this.connected ? '✅ Yes' : '❌ No'}`)
    console.log(`📱 Socket ID: ${this.socket?.id || 'None'}`)
    console.log(`🔄 Reconnection attempts: ${this.reconnectAttempts}/${this.maxReconnectAttempts}`)
    console.log(`🌐 Server URL: ${this.config.serverUrl || 'Not set'}`)
    console.log(`🔌 Socket instance: ${this.socket ? 'Available' : 'None'}`)
    console.log('=======================')
  }
}
