package com.buzzcall.notification

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationManagerCompat

/**
 * Handles notification actions (Answer, Decline, etc.)
 * Works with BuzzCallNotificationModule to send events to React Native
 */
class NotificationActionReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val action = intent.action ?: return
        
        when (action) {
            BuzzCallNotificationModule.ACTION_ANSWER -> {
                handleAnswerCall(context, intent)
            }
            BuzzCallNotificationModule.ACTION_DECLINE -> {
                handleDeclineCall(context, intent)
            }
            BuzzCallNotificationModule.ACTION_MESSAGE_REPLY -> {
                handleMessageReply(context, intent)
            }
        }
    }

    private fun handleAnswerCall(context: Context, intent: Intent) {
        val callId = intent.getStringExtra("callId") ?: ""
        val callerName = intent.getStringExtra("callerName") ?: ""
        val callType = intent.getStringExtra("callType") ?: "voice"

        // Clear the notification
        NotificationManagerCompat.from(context).cancel(callId.hashCode())

        // Launch the app with call screen
        val launchIntent = Intent(context, com.buzzcall.MainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("action", "answer_call")
            putExtra("callId", callId)
            putExtra("callerName", callerName)
            putExtra("callType", callType)
        }
        context.startActivity(launchIntent)

        // Send event to React Native (if module is available)
        // This will be handled by the main app when it starts
    }

    private fun handleDeclineCall(context: Context, intent: Intent) {
        val callId = intent.getStringExtra("callId") ?: ""
        val callerName = intent.getStringExtra("callerName") ?: ""

        // Clear the notification
        NotificationManagerCompat.from(context).cancel(callId.hashCode())

        // Could send a decline signal to backend here
        // For now, just clear the notification
    }

    private fun handleMessageReply(context: Context, intent: Intent) {
        val messageId = intent.getStringExtra("messageId") ?: ""
        val reply = intent.getStringExtra("reply") ?: ""

        // Handle quick reply
        // This would typically send the reply to a backend service
        
        // Clear the notification
        NotificationManagerCompat.from(context).cancel(messageId.hashCode())
    }
}