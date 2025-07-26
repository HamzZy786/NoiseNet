import { globalNoiseData } from '../data/globalNoiseData';

class RealtimeDataManager {
  constructor() {
    this.subscribers = [];
    this.activeUsers = 0;
    this.notifications = [];
    this.isRunning = false;
    this.updateInterval = null;
    this.userCountInterval = null;
    this.notificationThreshold = 85; // dB level that triggers notifications
  }

  // Subscribe to real-time updates
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify all subscribers
  notify(data) {
    this.subscribers.forEach(callback => callback(data));
  }

  // Start real-time simulation
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log('🔴 Real-time simulation started');

    // Update noise levels every 3 seconds
    this.updateInterval = setInterval(() => {
      this.updateNoiseLevels();
    }, 3000);

    // Update user count every 5 seconds
    this.userCountInterval = setInterval(() => {
      this.updateActiveUsers();
    }, 5000);

    // Initial user count
    this.updateActiveUsers();
  }

  // Stop real-time simulation
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    console.log('⏹️ Real-time simulation stopped');

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    if (this.userCountInterval) {
      clearInterval(this.userCountInterval);
      this.userCountInterval = null;
    }
  }

  // Simulate noise level changes
  updateNoiseLevels() {
    const updatedData = globalNoiseData.map(point => {
      // Create realistic noise fluctuations
      const baseLevel = point.noiseLevel;
      const variation = this.getNoiseVariation(point.noiseType, baseLevel);
      const newLevel = Math.max(20, Math.min(140, baseLevel + variation));
      
      // Check for spike notifications
      if (newLevel >= this.notificationThreshold && baseLevel < this.notificationThreshold) {
        this.createNotification(point, newLevel);
      }

      return {
        ...point,
        noiseLevel: Math.round(newLevel * 10) / 10, // Round to 1 decimal
        lastUpdated: new Date().toISOString(),
        trend: variation > 0 ? 'increasing' : variation < 0 ? 'decreasing' : 'stable'
      };
    });

    // Update the original data (simulate mutation)
    globalNoiseData.forEach((point, index) => {
      point.noiseLevel = updatedData[index].noiseLevel;
      point.lastUpdated = updatedData[index].lastUpdated;
      point.trend = updatedData[index].trend;
    });

    this.notify({
      type: 'NOISE_UPDATE',
      data: updatedData,
      timestamp: new Date().toISOString()
    });
  }

  // Get realistic noise variations based on type and time
  getNoiseVariation(noiseType, currentLevel) {
    const hour = new Date().getHours();
    let baseVariation = (Math.random() - 0.5) * 6; // ±3 dB base variation

    // Time-based patterns
    switch (noiseType) {
      case 'traffic':
        // Higher during rush hours (7-9 AM, 5-7 PM)
        if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
          baseVariation += Math.random() * 8; // Up to +8 dB during rush
        } else if (hour >= 22 || hour <= 6) {
          baseVariation -= Math.random() * 5; // Quieter at night
        }
        break;

      case 'aircraft':
        // Random spikes for takeoffs/landings
        if (Math.random() < 0.3) {
          baseVariation += Math.random() * 15; // Sudden aircraft noise
        }
        break;

      case 'construction':
        // Only during work hours (6 AM - 6 PM)
        if (hour >= 6 && hour <= 18) {
          baseVariation += (Math.random() - 0.3) * 10; // Generally increasing during work
        } else {
          baseVariation = -Math.random() * 20; // Much quieter outside work hours
        }
        break;

      case 'social':
        // Higher during evening/night
        if (hour >= 18 || hour <= 2) {
          baseVariation += Math.random() * 6;
        } else {
          baseVariation -= Math.random() * 4;
        }
        break;

      default:
        // Industrial/other - steady with small variations
        baseVariation = (Math.random() - 0.5) * 4;
    }

    return baseVariation;
  }

  // Create notification for noise spike
  createNotification(point, newLevel) {
    const notification = {
      id: Date.now() + Math.random(),
      type: 'NOISE_SPIKE',
      level: 'warning',
      title: 'Noise Spike Alert',
      message: `High noise detected in ${point.location}: ${newLevel.toFixed(1)} dB`,
      location: point.location,
      coordinates: [point.latitude, point.longitude],
      noiseLevel: newLevel,
      noiseType: point.noiseType,
      timestamp: new Date().toISOString(),
      duration: 5000 // Auto-dismiss after 5 seconds
    };

    this.notifications.unshift(notification);
    
    // Keep only last 10 notifications
    if (this.notifications.length > 10) {
      this.notifications = this.notifications.slice(0, 10);
    }

    this.notify({
      type: 'NOTIFICATION',
      notification,
      allNotifications: this.notifications
    });

    console.log('🚨 Noise spike notification:', notification.message);
  }

  // Simulate active user count
  updateActiveUsers() {
    const hour = new Date().getHours();
    let baseUsers = 150;

    // More users during peak hours
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      baseUsers = 300;
    } else if (hour >= 20 || hour <= 6) {
      baseUsers = 80;
    }

    // Add some randomness
    const variation = (Math.random() - 0.5) * 50;
    this.activeUsers = Math.max(10, Math.round(baseUsers + variation));

    this.notify({
      type: 'USER_COUNT_UPDATE',
      activeUsers: this.activeUsers,
      timestamp: new Date().toISOString()
    });
  }

  // Get current notifications
  getNotifications() {
    return this.notifications;
  }

  // Get active user count
  getActiveUsers() {
    return this.activeUsers;
  }

  // Dismiss notification
  dismissNotification(notificationId) {
    this.notifications = this.notifications.filter(n => n.id !== notificationId);
    this.notify({
      type: 'NOTIFICATION_DISMISSED',
      notificationId,
      allNotifications: this.notifications
    });
  }

  // Clear all notifications
  clearNotifications() {
    this.notifications = [];
    this.notify({
      type: 'NOTIFICATIONS_CLEARED',
      allNotifications: []
    });
  }
}

// Create singleton instance
export const realtimeManager = new RealtimeDataManager();
