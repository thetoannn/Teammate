import { SocketIOManager } from '@/lib/socket'

/**
 * Utility để test socket connection và xem các log
 * Sử dụng trong console browser để test
 */
export const socketTest = {
  /**
   * Tạo instance socket mới để test
   */
  createTestSocket(serverUrl?: string): SocketIOManager {
    console.log('🧪 Creating test socket instance...')
    return new SocketIOManager({
      serverUrl: serverUrl || 'http://localhost:3000',
      autoConnect: true
    })
  },

  /**
   * Test ping socket
   */
  testPing(socket: SocketIOManager, data: unknown = 'test-ping'): void {
    console.log('🏓 Testing ping...')
    socket.ping(data)
  },

  /**
   * Test disconnect
   */
  testDisconnect(socket: SocketIOManager): void {
    console.log('🔌 Testing disconnect...')
    socket.disconnect()
  },

  /**
   * Test reconnect
   */
  testReconnect(socket: SocketIOManager): void {
    console.log('🔄 Testing reconnect...')
    socket.connect()
  },

  /**
   * Log trạng thái socket
   */
  logStatus(socket: SocketIOManager): void {
    socket.logStatus()
  },

  /**
   * Test tất cả các method
   */
  runFullTest(serverUrl?: string): void {
    console.log('🧪 === RUNNING FULL SOCKET TEST ===')
    
    const socket = this.createTestSocket(serverUrl)
    
    // Đợi một chút để socket có thể kết nối
    setTimeout(() => {
      console.log('\n📊 === TESTING SOCKET METHODS ===')
      this.logStatus(socket)
      this.testPing(socket)
      
      // Test disconnect và reconnect
      setTimeout(() => {
        console.log('\n🔄 === TESTING DISCONNECT/RECONNECT ===')
        this.testDisconnect(socket)
        
        setTimeout(() => {
          this.testReconnect(socket)
        }, 1000)
      }, 2000)
    }, 1000)
  }
}

// Export để sử dụng trong console browser
if (typeof window !== 'undefined') {
  (window as any).socketTest = socketTest
  console.log('🧪 Socket test utility available at window.socketTest')
  console.log('📖 Usage: socketTest.runFullTest() or socketTest.createTestSocket()')
}
