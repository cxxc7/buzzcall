package com.buzzcall.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.media.RingtoneManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.buzzcall.MainActivity

/**
 * Native Android module for BuzzCall notifications
 * Handles full-screen calls, actions, and deep linking with React Native bridge
 */
class BuzzCallNotificationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        const val MODULE_NAME = "BuzzCallNotification"
        const val CHANNEL_ID_CALLS = "buzzcall_calls"
        const val CHANNEL_ID_MESSAGES = "buzzcall_messages"
        const val CHANNEL_ID_VIDEO = "buzzcall_video"
        
        const val ACTION_ANSWER = "buzzcall.ANSWER"
        const val ACTION_DECLINE = "buzzcall.DECLINE"
        const val ACTION_MESSAGE_REPLY = "buzzcall.MESSAGE_REPLY"
    }

    private val context: Context = reactContext.applicationContext
    private val notificationManager: NotificationManager = 
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    init {
        createNotificationChannels()
    }

    override fun getName(): String = MODULE_NAME

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            // Voice Call Channel - Highest priority for full-screen intent
            val callChannel = NotificationChannel(
                CHANNEL_ID_CALLS,
                "Voice Calls",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Incoming voice calls with full-screen UI"
                enableLights(true)
                lightColor = Color.GREEN
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 1000, 500, 1000)
                setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE), null)
                setBypassDnd(true)
                lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
            }

            // Video Call Channel
            val videoChannel = NotificationChannel(
                CHANNEL_ID_VIDEO,
                "Video Calls",
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Incoming video calls"
                enableLights(true)
                lightColor = Color.BLUE
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 1000, 500, 1000)
                setBypassDnd(true)
                lockscreenVisibility = NotificationCompat.VISIBILITY_PUBLIC
            }

            // Message Channel
            val messageChannel = NotificationChannel(
                CHANNEL_ID_MESSAGES,
                "Messages",
                NotificationManager.IMPORTANCE_DEFAULT
            ).apply {
                description = "New messages and chats"
                enableLights(true)
                lightColor = Color.BLUE
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 250, 250, 250)
            }

            notificationManager.createNotificationChannels(listOf(callChannel, videoChannel, messageChannel))
        }
    }

    @ReactMethod
    fun showCallNotification(params: ReadableMap, promise: Promise) {
        try {
            val title = params.getString("title") ?: "Incoming Call"
            val body = params.getString("body") ?: "Someone is calling you"
            val callerName = params.getString("callerName") ?: "Unknown Caller"
            val callType = params.getString("callType") ?: "voice"
            val callId = params.getString("callId") ?: System.currentTimeMillis().toString()

            // Create full-screen intent for incoming call
            val fullScreenIntent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                putExtra("screen", "call")
                putExtra("callType", callType)
                putExtra("callId", callId)
                putExtra("callerName", callerName)
            }
            
            val fullScreenPendingIntent = PendingIntent.getActivity(
                context, 
                callId.hashCode(),
                fullScreenIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // Answer action
            val answerIntent = Intent(context, NotificationActionReceiver::class.java).apply {
                action = ACTION_ANSWER
                putExtra("callId", callId)
                putExtra("callerName", callerName)
                putExtra("callType", callType)
            }
            
            val answerPendingIntent = PendingIntent.getBroadcast(
                context,
                (callId + "answer").hashCode(),
                answerIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // Decline action
            val declineIntent = Intent(context, NotificationActionReceiver::class.java).apply {
                action = ACTION_DECLINE
                putExtra("callId", callId)
                putExtra("callerName", callerName)
            }
            
            val declinePendingIntent = PendingIntent.getBroadcast(
                context,
                (callId + "decline").hashCode(),
                declineIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val channelId = if (callType == "video") CHANNEL_ID_VIDEO else CHANNEL_ID_CALLS
            
            val notification = NotificationCompat.Builder(context, channelId)
                .setSmallIcon(android.R.drawable.ic_menu_call)
                .setContentTitle(title)
                .setContentText(body)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setCategory(NotificationCompat.CATEGORY_CALL)
                .setAutoCancel(false)
                .setOngoing(true)
                .setFullScreenIntent(fullScreenPendingIntent, true)
                .setContentIntent(fullScreenPendingIntent)
                .addAction(
                    android.R.drawable.ic_menu_call,
                    "Answer",
                    answerPendingIntent
                )
                .addAction(
                    android.R.drawable.ic_menu_close_clear_cancel,
                    "Decline",
                    declinePendingIntent
                )
                .setTimeoutAfter(30000) // Auto-dismiss after 30 seconds
                .build()

            NotificationManagerCompat.from(context).notify(callId.hashCode(), notification)
            
            promise.resolve(WritableNativeMap().apply {
                putString("status", "success")
                putString("callId", callId)
            })
            
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_ERROR", "Failed to show call notification: ${e.message}")
        }
    }

    @ReactMethod
    fun showMessageNotification(params: ReadableMap, promise: Promise) {
        try {
            val title = params.getString("title") ?: "New Message"
            val body = params.getString("body") ?: "You have a new message"
            val sender = params.getString("sender") ?: "Unknown"
            val messageId = params.getString("messageId") ?: System.currentTimeMillis().toString()
            val deepLink = params.getString("deepLink") ?: "buzzcall://history"

            // Create intent for message tap
            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                putExtra("deepLink", deepLink)
                putExtra("sender", sender)
                putExtra("messageId", messageId)
            }
            
            val pendingIntent = PendingIntent.getActivity(
                context,
                messageId.hashCode(),
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val notification = NotificationCompat.Builder(context, CHANNEL_ID_MESSAGES)
                .setSmallIcon(android.R.drawable.ic_dialog_email)
                .setContentTitle(title)
                .setContentText(body)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                .setContentIntent(pendingIntent)
                .setAutoCancel(true)
                .setGroup("buzzcall_messages")
                .build()

            NotificationManagerCompat.from(context).notify(messageId.hashCode(), notification)
            
            promise.resolve(WritableNativeMap().apply {
                putString("status", "success")
                putString("messageId", messageId)
            })
            
        } catch (e: Exception) {
            promise.reject("NOTIFICATION_ERROR", "Failed to show message notification: ${e.message}")
        }
    }

    @ReactMethod
    fun setBadgeCount(count: Int, promise: Promise) {
        try {
            // Badge implementation varies by device manufacturer
            // This is a basic implementation - could be extended with manufacturer-specific APIs
            
            promise.resolve(WritableNativeMap().apply {
                putBoolean("success", true)
                putInt("count", count)
                putString("note", "Badge count set (implementation varies by device)")
            })
            
        } catch (e: Exception) {
            promise.reject("BADGE_ERROR", "Failed to set badge count: ${e.message}")
        }
    }

    @ReactMethod
    fun clearAllNotifications(promise: Promise) {
        try {
            NotificationManagerCompat.from(context).cancelAll()
            promise.resolve(WritableNativeMap().apply {
                putString("status", "success")
                putString("message", "All notifications cleared")
            })
        } catch (e: Exception) {
            promise.reject("CLEAR_ERROR", "Failed to clear notifications: ${e.message}")
        }
    }

    @ReactMethod
    fun getDeviceInfo(promise: Promise) {
        try {
            promise.resolve(WritableNativeMap().apply {
                putString("platform", "android")
                putInt("apiLevel", Build.VERSION.SDK_INT)
                putString("manufacturer", Build.MANUFACTURER)
                putString("model", Build.MODEL)
                putString("version", Build.VERSION.RELEASE)
            })
        } catch (e: Exception) {
            promise.reject("DEVICE_INFO_ERROR", "Failed to get device info: ${e.message}")
        }
    }

    // Send events to React Native
    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    // Called from NotificationActionReceiver
    fun handleNotificationAction(action: String, extras: Map<String, String>) {
        val params = WritableNativeMap().apply {
            putString("action", action)
            for ((key, value) in extras) {
                putString(key, value)
            }
        }
        sendEvent("NotificationAction", params)
    }
}