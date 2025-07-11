// ProtoLab Error Monitoring and Performance Tracking
import React from 'react';
import { apiRequest } from './queryClient';

interface ErrorEvent {
  type: 'ai_error' | 'document_error' | 'monetization_error' | 'performance_issue';
  message: string;
  stack?: string;
  context: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

interface PerformanceMetric {
  operation: string;
  duration: number;
  memory?: number;
  success: boolean;
  metadata: Record<string, any>;
  timestamp: number;
}

class ErrorMonitor {
  private sessionId: string;
  private userId: string | null = null;
  private errorQueue: ErrorEvent[] = [];
  private performanceQueue: PerformanceMetric[] = [];
  private initialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initialize();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initialize() {
    if (this.initialized) return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.captureError('performance_issue', event.error || new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError('ai_error', new Error(event.reason), {
        type: 'unhandled_promise_rejection'
      });
    });

    // Performance observer for long tasks
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) { // Track tasks longer than 50ms
              this.trackPerformance('long_task', entry.duration, true, {
                entryType: entry.entryType,
                name: entry.name
              });
            }
          });
        });
        observer.observe({ entryTypes: ['longtask', 'measure'] });
      } catch (e) {
        console.warn('Performance observer not fully supported');
      }
    }

    this.initialized = true;
    console.log('ProtoLab error monitoring initialized');
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  captureError(type: ErrorEvent['type'], error: Error, context: Record<string, any> = {}) {
    const errorEvent: ErrorEvent = {
      type,
      message: error.message,
      stack: error.stack,
      context: {
        ...context,
        userAgent: navigator.userAgent,
        url: window.location.href,
        timestamp: Date.now()
      },
      timestamp: Date.now(),
      userId: this.userId || undefined,
      sessionId: this.sessionId
    };

    this.errorQueue.push(errorEvent);
    this.flushErrors();

    // Log to console in development
    if (import.meta.env.MODE === 'development') {
      console.error(`ProtoLab Error [${type}]:`, error, context);
    }
  }

  trackPerformance(operation: string, duration: number, success: boolean, metadata: Record<string, any> = {}) {
    const metric: PerformanceMetric = {
      operation,
      duration,
      memory: (performance as any).memory?.usedJSHeapSize,
      success,
      metadata: {
        ...metadata,
        sessionId: this.sessionId,
        userId: this.userId
      },
      timestamp: Date.now()
    };

    this.performanceQueue.push(metric);
    this.flushPerformance();

    // Log slow operations
    if (duration > 5000) {
      console.warn(`Slow operation detected: ${operation} took ${duration}ms`);
    }
  }

  private async flushErrors() {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await apiRequest('POST', '/api/monitoring/errors', { errors });
    } catch (e) {
      // Re-queue errors if send failed
      this.errorQueue.unshift(...errors);
      console.warn('Failed to send error reports');
    }
  }

  private async flushPerformance() {
    if (this.performanceQueue.length === 0) return;

    const metrics = [...this.performanceQueue];
    this.performanceQueue = [];

    try {
      await apiRequest('POST', '/api/monitoring/performance', { metrics });
    } catch (e) {
      // Re-queue metrics if send failed
      this.performanceQueue.unshift(...metrics);
      console.warn('Failed to send performance metrics');
    }
  }

  // AI-specific error tracking
  captureAIError(operation: string, error: Error, context: {
    model?: string;
    prompt?: string;
    duration?: number;
  } = {}) {
    this.captureError('ai_error', error, {
      operation,
      ...context,
      prompt: context.prompt?.substring(0, 100) // Limit prompt length
    });
  }

  // Document processing error tracking
  captureDocumentError(operation: string, error: Error, context: {
    fileType?: string;
    fileSize?: number;
    fileName?: string;
  } = {}) {
    this.captureError('document_error', error, {
      operation,
      ...context
    });
  }

  // Monetization error tracking
  captureMonetizationError(action: string, error: Error, context: {
    tier?: string;
    amount?: number;
    paymentMethod?: string;
  } = {}) {
    this.captureError('monetization_error', error, {
      action,
      ...context
    });
  }

  // Track AI operations with automatic error handling
  async trackAIOperation<T>(
    operation: string,
    fn: () => Promise<T>,
    context: Record<string, any> = {}
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      this.trackPerformance(`ai_${operation}`, duration, true, context);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.captureAIError(operation, error as Error, {
        ...context,
        duration
      });
      this.trackPerformance(`ai_${operation}`, duration, false, context);
      throw error;
    }
  }

  // Track document operations
  async trackDocumentOperation<T>(
    operation: string,
    fn: () => Promise<T>,
    context: Record<string, any> = {}
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      this.trackPerformance(`document_${operation}`, duration, true, context);
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      this.captureDocumentError(operation, error as Error, context);
      this.trackPerformance(`document_${operation}`, duration, false, context);
      throw error;
    }
  }

  // Get monitoring statistics
  getStats() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      errorsQueued: this.errorQueue.length,
      metricsQueued: this.performanceQueue.length,
      initialized: this.initialized
    };
  }
}

// Global instance
export const errorMonitor = new ErrorMonitor();

// Convenience functions
export const captureError = (type: ErrorEvent['type'], error: Error, context?: Record<string, any>) => 
  errorMonitor.captureError(type, error, context);

export const trackPerformance = (operation: string, duration: number, success: boolean, metadata?: Record<string, any>) => 
  errorMonitor.trackPerformance(operation, duration, success, metadata);

export const captureAIError = (operation: string, error: Error, context?: Record<string, any>) => 
  errorMonitor.captureAIError(operation, error, context);

export const captureDocumentError = (operation: string, error: Error, context?: Record<string, any>) => 
  errorMonitor.captureDocumentError(operation, error, context);

export const captureMonetizationError = (action: string, error: Error, context?: Record<string, any>) => 
  errorMonitor.captureMonetizationError(action, error, context);

export const trackAIOperation = <T>(operation: string, fn: () => Promise<T>, context?: Record<string, any>) => 
  errorMonitor.trackAIOperation(operation, fn, context);

export const trackDocumentOperation = <T>(operation: string, fn: () => Promise<T>, context?: Record<string, any>) => 
  errorMonitor.trackDocumentOperation(operation, fn, context);

// React error boundary HOC
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorContext?: Record<string, any>
) {
  return class ErrorBoundaryWrapper extends React.Component<P, { hasError: boolean }> {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      errorMonitor.captureError('ai_error', error, {
        ...errorContext,
        componentStack: errorInfo.componentStack,
        errorBoundary: true
      });
    }

    render() {
      if (this.state.hasError) {
        return React.createElement('div', {
          className: 'p-8 text-center bg-red-50 border border-red-200 rounded-lg'
        }, [
          React.createElement('h3', {
            key: 'title',
            className: 'text-lg font-semibold text-red-800 mb-2'
          }, 'Something went wrong'),
          React.createElement('p', {
            key: 'message',
            className: 'text-red-600'
          }, 'We\'ve been notified and are working on a fix.')
        ]);
      }

      return React.createElement(Component, this.props);
    }
  };
}