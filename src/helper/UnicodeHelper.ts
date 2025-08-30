export class UnicodeHelper {
  /**
   * Decodes Unicode escape sequences in a string to proper UTF-8 characters
   * @param str - String containing Unicode escape sequences like \u00e0
   * @returns Properly decoded string with Vietnamese characters
   */
  static decodeUnicodeEscapes(str: string): string {
    if (!str || typeof str !== 'string') {
      return str;
    }

    try {
      // Replace Unicode escape sequences with actual characters
      return str.replace(/\\u([0-9a-fA-F]{4})/g, (match, code) => {
        return String.fromCharCode(parseInt(code, 16));
      });
    } catch (error) {
      console.warn('Failed to decode Unicode escapes:', error);
      return str;
    }
  }

  /**
   * Ensures proper UTF-8 encoding for Vietnamese text
   * @param str - Input string
   * @returns Properly encoded string
   */
  static ensureUtf8Encoding(str: string): string {
    if (!str || typeof str !== 'string') {
      return str;
    }

    try {
      // First decode any Unicode escapes
      let decoded = this.decodeUnicodeEscapes(str);
      
      // Ensure proper UTF-8 encoding by encoding and decoding
      const encoder = new TextEncoder();
      const decoder = new TextDecoder('utf-8');
      const bytes = encoder.encode(decoded);
      return decoder.decode(bytes);
    } catch (error) {
      console.warn('Failed to ensure UTF-8 encoding:', error);
      return str;
    }
  }

  /**
   * Processes streaming JSON response to decode Vietnamese characters
   * @param jsonLine - Raw JSON line from streaming response
   * @returns Processed JSON with decoded Vietnamese text
   */
  static processStreamingJsonLine(jsonLine: string): any {
    if (!jsonLine || typeof jsonLine !== 'string') {
      return null;
    }

    try {
      // First decode the entire JSON line to handle escaped Unicode sequences
      const decodedLine = this.decodeUnicodeEscapes(jsonLine);
      const jsonData = JSON.parse(decodedLine);
      
      // Process the response field if it exists
      if (jsonData.response && typeof jsonData.response === 'string') {
        const originalResponse = jsonData.response;
        const decodedResponse = this.ensureUtf8Encoding(jsonData.response);
        
        // Log the backend message transformation
        console.log('📨 Backend Message Processing:', {
          agent: jsonData.agent_name || 'unknown',
          original: originalResponse.substring(0, 80) + (originalResponse.length > 80 ? '...' : ''),
          decoded: decodedResponse.substring(0, 80) + (decodedResponse.length > 80 ? '...' : ''),
          hasUnicodeEscapes: /\\u[0-9a-fA-F]{4}/.test(originalResponse),
          transformationApplied: originalResponse !== decodedResponse,
          isProperlyDecoded: this.isProperlyEncoded(decodedResponse)
        });
        
        jsonData.response = decodedResponse;
      }
      
      // Process the message field if it exists
      if (jsonData.message && typeof jsonData.message === 'string') {
        const originalMessage = jsonData.message;
        const decodedMessage = this.ensureUtf8Encoding(jsonData.message);
        
        // Log the backend message transformation
        console.log('📨 Backend Message Processing:', {
          agent: jsonData.agent_name || 'unknown',
          original: originalMessage.substring(0, 80) + (originalMessage.length > 80 ? '...' : ''),
          decoded: decodedMessage.substring(0, 80) + (decodedMessage.length > 80 ? '...' : ''),
          hasUnicodeEscapes: /\\u[0-9a-fA-F]{4}/.test(originalMessage),
          transformationApplied: originalMessage !== decodedMessage,
          isProperlyDecoded: this.isProperlyEncoded(decodedMessage)
        });
        
        jsonData.message = decodedMessage;
      }
      
      return jsonData;
    } catch (error) {
      console.error('Failed to process streaming JSON line:', error);
      // Fallback: try parsing the original line
      try {
        return JSON.parse(jsonLine);
      } catch (fallbackError) {
        console.error('Fallback parsing also failed:', fallbackError);
        return null;
      }
    }
  }

  /**
   * Creates a custom fetch wrapper that decodes Unicode responses at the network level
   * @param input - Fetch input
   * @param init - Fetch init options
   * @returns Promise with decoded response
   */
  static async fetchWithUnicodeDecoding(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    // Override the global fetch temporarily to intercept and decode responses
    const originalFetch = window.fetch;
    
    try {
      // Create a custom fetch that processes the response
      const response = await originalFetch(input, init);
      
      // Only process streaming JSON responses
      if (!response.body || !response.headers.get('content-type')?.includes('application/json')) {
        return response;
      }

      // Clone the response to avoid consuming the original body
      const clonedResponse = response.clone();
      
      // Read the entire response as text first
      const responseText = await clonedResponse.text();
      
      // Process the text to decode Unicode escapes
      const decodedText = this.decodeUnicodeEscapes(responseText);
      
      // Log the transformation for debugging
      console.log('🔄 UnicodeHelper: Network response transformation', {
        original: responseText.substring(0, 200) + (responseText.length > 200 ? '...' : ''),
        decoded: decodedText.substring(0, 200) + (decodedText.length > 200 ? '...' : ''),
        hasUnicodeEscapes: /\\u[0-9a-fA-F]{4}/.test(responseText),
        transformationApplied: responseText !== decodedText
      });
      
      // Create a new response with the decoded content
      const decodedResponse = new Response(decodedText, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      
      return decodedResponse;
    } catch (error) {
      console.error('❌ UnicodeHelper: Error in fetchWithUnicodeDecoding:', error);
      // Fallback to original fetch
      return originalFetch(input, init);
    }
  }

  /**
   * Monkey patch the global fetch to automatically decode Unicode responses
   * This will make all network requests show properly decoded Vietnamese text in DevTools
   */
  static patchGlobalFetch(): void {
    const fetchWithPatch = window.fetch as any;
    if (fetchWithPatch.__unicodePatched) {
      console.log('🔄 UnicodeHelper: Global fetch already patched');
      return;
    }

    const originalFetch = window.fetch;
    
    const patchedFetch = async function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
      try {
        const response = await originalFetch(input, init);
        
        // Only process streaming JSON responses from our API
        const url = typeof input === 'string' ? input : input.toString();
        const isOurAPI = url.includes('agent.sieutho.vn') || url.includes('teammate.nhansuso.vn');
        const isJsonResponse = response.headers.get('content-type')?.includes('application/json');
        
        if (!isOurAPI || !isJsonResponse || !response.body) {
          return response;
        }

        // Clone the response to avoid consuming the original body
        const clonedResponse = response.clone();
        
        // Read the entire response as text
        const responseText = await clonedResponse.text();
        
        // Check if it contains Unicode escapes
        if (!/\\u[0-9a-fA-F]{4}/.test(responseText)) {
          return response; // No Unicode escapes, return original
        }
        
        // Process the text to decode Unicode escapes
        const decodedText = UnicodeHelper.decodeUnicodeEscapes(responseText);
        
        // Log the transformation for debugging
        console.log('🌐 Global fetch: Unicode transformation applied', {
          url: url.substring(0, 100) + (url.length > 100 ? '...' : ''),
          originalLength: responseText.length,
          decodedLength: decodedText.length,
          hasUnicodeEscapes: true,
          preview: decodedText.substring(0, 200) + (decodedText.length > 200 ? '...' : '')
        });
        
        // Create a new response with the decoded content
        return new Response(decodedText, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } catch (error) {
        console.error('❌ Global fetch patch error:', error);
        // Fallback to original fetch
        return originalFetch(input, init);
      }
    };
    
    // Replace the global fetch
    window.fetch = patchedFetch as typeof fetch;
    
    // Mark as patched
    (window.fetch as any).__unicodePatched = true;
    console.log('✅ UnicodeHelper: Global fetch patched for Unicode decoding');
  }

  /**
   * Remove the global fetch patch
   */
  static unpatchGlobalFetch(): void {
    const fetchWithPatch = window.fetch as any;
    if (fetchWithPatch.__unicodePatched) {
      // This is a simplified approach - in a real app you'd store the original fetch
      location.reload(); // Reload to restore original fetch
    }
  }

  /**
   * Validates if a string contains proper Vietnamese characters
   * @param str - String to validate
   * @returns True if string contains properly encoded Vietnamese characters
   */
  static isProperlyEncoded(str: string): boolean {
    if (!str || typeof str !== 'string') {
      return true;
    }

    // Check if string contains Unicode escape sequences
    const hasEscapeSequences = /\\u[0-9a-fA-F]{4}/.test(str);
    
    // Check if string contains Vietnamese characters
    const hasVietnameseChars = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(str);
    
    // If it has escape sequences but no Vietnamese chars, it's not properly encoded
    if (hasEscapeSequences && !hasVietnameseChars) {
      return false;
    }
    
    return true;
  }
}
