package com.buzzcall.notification

import android.util.Log
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

/**
 * Firebase Cloud Messaging service for BuzzCall
 * Handles background messages and token refresh
 */
class BuzzCallFirebaseMessagingService : FirebaseMessagingService() {

    companion object {
        private const val TAG = "BuzzCallFCM"
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.d(TAG, "Message received from: ${remoteMessage.from}")

        // Handle notification payload
        remoteMessage.notification?.let { notification ->
            Log.d(TAG, "Message Notification Body: ${notification.body}")
            handleNotificationMessage(remoteMessage)
        }

        // Handle data payload
        if (remoteMessage.data.isNotEmpty()) {
            Log.d(TAG, "Message data payload: ${remoteMessage.data}")
            handleDataMessage(remoteMessage)
        }
    }

    override fun onNewToken(token: String) {
        Log.d(TAG, "Refreshed token: $token")
        
        // Send token to app server
        sendRegistrationToServer(token)
    }

    private fun handleNotificationMessage(remoteMessage: RemoteMessage) {
        val notification = remoteMessage.notification ?: return
        val data = remoteMessage.data
        
        val type = data["type"] ?: "message"
        
        when (type) {
            "call", "video" -> {
                // Handle call notifications with high priority
                // This could trigger a full-screen intent or heads-up notification
                handleCallNotification(remoteMessage)
            }
            "message" -> {
                // Handle regular message notifications
                handleMessageNotification(remoteMessage)
            }
            else -> {
                // Handle generic notifications
                handleGenericNotification(remoteMessage)
            }
        }
    }

    private fun handleDataMessage(remoteMessage: RemoteMessage) {
        val data = remoteMessage.data
        val type = data["type"] ?: "message"
        
        // Handle data-only messages (silent notifications)
        when (type) {
            "call", "video" -> {
                // For call data, we might want to show a call notification immediately
                showCallNotificationFromData(data)
            }
            "sync" -> {
                // Handle background sync operations
                handleBackgroundSync(data)
            }
        }
    }

    private fun handleCallNotification(remoteMessage: RemoteMessage) {
        // Use our custom notification module to show call notifications
        // This would typically be handled by the React Native module
        Log.d(TAG, "Handling call notification: ${remoteMessage.notification?.title}")
    }

    private fun handleMessageNotification(remoteMessage: RemoteMessage) {
        Log.d(TAG, "Handling message notification: ${remoteMessage.notification?.title}")
    }

    private fun handleGenericNotification(remoteMessage: RemoteMessage) {
        Log.d(TAG, "Handling generic notification: ${remoteMessage.notification?.title}")
    }

    private fun showCallNotificationFromData(data: Map<String, String>) {
        Log.d(TAG, "Showing call notification from data: $data")
        // This could use our BuzzCallNotificationModule to show the notification
    }

    private fun handleBackgroundSync(data: Map<String, String>) {
        Log.d(TAG, "Handling background sync: $data")
        // Handle any background synchronization tasks
    }

    private fun sendRegistrationToServer(token: String) {
        Log.d(TAG, "Sending token to server: $token")
        // In a real app, send this token to your backend server
        // For this demo, we'll just log it
    }
}