import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NotificationService, { NotificationData } from '../services/NotificationService';

const HomeScreen = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [badgeCount, setBadgeCount] = useState(0);
  const [customMessage, setCustomMessage] = useState('');
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeScreen = async () => {
      try {
        setIsConnected(true);
        const token = NotificationService.getFCMToken();
        setFcmToken(token);
        
        // Update badge count
        const count = await NotificationService.getBadgeCount();
        setBadgeCount(count);
      } catch (error) {
        console.error('Failed to initialize home screen:', error);
        Alert.alert('Error', 'Failed to initialize BuzzCall features');
      }
    };

    initializeScreen();

    // Update badge count periodically
    const interval = setInterval(async () => {
      const count = await NotificationService.getBadgeCount();
      setBadgeCount(count);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendTestNotification = async (type: 'call' | 'video' | 'message') => {
    try {
      await NotificationService.sendTestNotification(type, customMessage || undefined);
      Alert.alert('Success', `${type} notification sent!`);
      setCustomMessage('');
    } catch (error) {
      Alert.alert('Error', 'Failed to send notification');
    }
  };

  const clearAllNotifications = async () => {
    try {
      await NotificationService.clearAllNotifications();
      setBadgeCount(0);
      Alert.alert('Success', 'All notifications cleared');
    } catch (error) {
      Alert.alert('Error', 'Failed to clear notifications');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>🚀 BuzzCall</Text>
        <Text style={styles.subtitle}>Enterprise Push Notification Engine</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? '#10b981' : '#ef4444' }]} />
          <Text style={styles.statusText}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
          {badgeCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badgeCount}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="notifications" size={24} color="#2563eb" />
          <Text style={styles.statNumber}>{badgeCount}</Text>
          <Text style={styles.statLabel}>Unread</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="security" size={24} color="#10b981" />
          <Text style={styles.statNumber}>✓</Text>
          <Text style={styles.statLabel}>FCM Ready</Text>
        </View>
        <View style={styles.statCard}>
          <Icon name="phone" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>API {Platform.Version}</Text>
          <Text style={styles.statLabel}>Android</Text>
        </View>
      </View>

      {/* Call Simulator */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📞 Call Simulator</Text>
        <Text style={styles.cardDescription}>
          Test full-screen call notifications with answer/decline actions
        </Text>
        
        <TextInput
          style={styles.input}
          placeholder="Custom message (optional)"
          value={customMessage}
          onChangeText={setCustomMessage}
          multiline
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.button, styles.callButton]} 
            onPress={() => sendTestNotification('call')}
          >
            <Icon name="call" size={20} color="white" />
            <Text style={styles.buttonText}>Voice Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.videoButton]} 
            onPress={() => sendTestNotification('video')}
          >
            <Icon name="videocam" size={20} color="white" />
            <Text style={styles.buttonText}>Video Call</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, styles.messageButton]} 
          onPress={() => sendTestNotification('message')}
        >
          <Icon name="message" size={20} color="white" />
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>
      </View>

      {/* Notification Controls */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>🔧 Notification Controls</Text>
        <TouchableOpacity 
          style={[styles.button, styles.clearButton]} 
          onPress={clearAllNotifications}
        >
          <Icon name="clear-all" size={20} color="white" />
          <Text style={styles.buttonText}>Clear All Notifications</Text>
        </TouchableOpacity>
      </View>

      {/* Technical Info */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>⚙️ Technical Specifications</Text>
        <View style={styles.techInfo}>
          <Text style={styles.techLabel}>Platform:</Text>
          <Text style={styles.techValue}>React Native {Platform.OS}</Text>
        </View>
        <View style={styles.techInfo}>
          <Text style={styles.techLabel}>API Level:</Text>
          <Text style={styles.techValue}>{Platform.Version}</Text>
        </View>
        <View style={styles.techInfo}>
          <Text style={styles.techLabel}>FCM Token:</Text>
          <Text style={styles.techValue} numberOfLines={1}>
            {fcmToken ? `${fcmToken.substring(0, 20)}...` : 'Loading...'}
          </Text>
        </View>
        <View style={styles.techInfo}>
          <Text style={styles.techLabel}>Deep Linking:</Text>
          <Text style={styles.techValue}>buzzcall://</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#374151',
  },
  badge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    flex: 1,
  },
  callButton: {
    backgroundColor: '#10b981',
  },
  videoButton: {
    backgroundColor: '#3b82f6',
  },
  messageButton: {
    backgroundColor: '#8b5cf6',
    marginHorizontal: 0,
  },
  clearButton: {
    backgroundColor: '#ef4444',
    marginHorizontal: 0,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  techInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  techLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  techValue: {
    fontSize: 14,
    color: '#1f2937',
    flex: 1,
    textAlign: 'right',
  },
});

export default HomeScreen;