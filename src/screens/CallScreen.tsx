import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

interface RouteParams {
  type: 'call' | 'video';
  id: string;
}

const CallScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type, id } = route.params as RouteParams;
  
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isConnected]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = () => {
    setIsConnected(true);
    Alert.alert('Call Connected', `${type} call is now active!`);
  };

  const handleDecline = () => {
    Alert.alert('Call Declined', 'The call has been declined.');
    navigation.goBack();
  };

  const handleEndCall = () => {
    Alert.alert(
      'End Call',
      'Are you sure you want to end the call?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Call',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const toggleMute = () => {
    Alert.alert('Mute', 'Microphone muted/unmuted');
  };

  const toggleSpeaker = () => {
    Alert.alert('Speaker', 'Speaker toggled');
  };

  const toggleVideo = () => {
    if (type === 'video') {
      Alert.alert('Video', 'Camera toggled');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Background overlay */}
      <View style={styles.overlay} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.callType}>
          {type === 'video' ? '📹 Video Call' : '📞 Voice Call'}
        </Text>
        <Text style={styles.callerName}>John Doe</Text>
        <Text style={styles.callStatus}>
          {isConnected ? formatDuration(callDuration) : 'Incoming call...'}
        </Text>
      </View>

      {/* Avatar/Video area */}
      <View style={styles.avatarContainer}>
        {type === 'video' && isConnected ? (
          <View style={styles.videoContainer}>
            <Text style={styles.videoPlaceholder}>Video Feed</Text>
            <Text style={styles.videoSubtext}>Camera simulation</Text>
          </View>
        ) : (
          <View style={styles.avatar}>
            <Icon name="person" size={80} color="white" />
          </View>
        )}
      </View>

      {/* Control buttons */}
      <View style={styles.controlsContainer}>
        {isConnected ? (
          // Active call controls
          <View style={styles.activeControls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
              <Icon name="mic" size={30} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.controlButton} onPress={toggleSpeaker}>
              <Icon name="volume-up" size={30} color="white" />
            </TouchableOpacity>
            
            {type === 'video' && (
              <TouchableOpacity style={styles.controlButton} onPress={toggleVideo}>
                <Icon name="videocam" size={30} color="white" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[styles.controlButton, styles.endCallButton]} 
              onPress={handleEndCall}
            >
              <Icon name="call-end" size={30} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          // Incoming call controls
          <View style={styles.incomingControls}>
            <TouchableOpacity 
              style={[styles.callActionButton, styles.declineButton]} 
              onPress={handleDecline}
            >
              <Icon name="call-end" size={40} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.callActionButton, styles.answerButton]} 
              onPress={handleAnswer}
            >
              <Icon name="call" size={40} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Additional info */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Call ID: {id}</Text>
        <Text style={styles.infoText}>
          Deep link: buzzcall://call/{type}/{id}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  callType: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  callerName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  callStatus: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  avatarContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  videoContainer: {
    width: width * 0.8,
    height: height * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  videoPlaceholder: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  controlsContainer: {
    marginBottom: 60,
  },
  incomingControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 60,
  },
  activeControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  callActionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  answerButton: {
    backgroundColor: '#10b981',
  },
  declineButton: {
    backgroundColor: '#ef4444',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  endCallButton: {
    backgroundColor: '#ef4444',
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
  },
});

export default CallScreen;