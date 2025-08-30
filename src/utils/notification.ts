// Simple notification utility for the current project
export const showNotification = {
  success: (message: string, description?: string) => {
    console.log('✅ Success:', message, description);
    // You can replace this with a toast library or custom notification component
    alert(`Success: ${message}${description ? '\n' + description : ''}`);
  },
  
  error: (message: string, description?: string) => {
    console.error('❌ Error:', message, description);
    // You can replace this with a toast library or custom notification component
    alert(`Error: ${message}${description ? '\n' + description : ''}`);
  },
  
  info: (message: string, description?: string) => {
    console.log('ℹ️ Info:', message, description);
    alert(`Info: ${message}${description ? '\n' + description : ''}`);
  }
};
