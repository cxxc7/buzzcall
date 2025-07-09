
package app.lovable.notifications;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.media.RingtoneManager;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Native Android module for handling WhatsApp-style notifications
 * Supports background notifications, call notifications, and deep linking
 */
@CapacitorPlugin(name = "NotificationHelper")
public class NotificationHelper extends Plugin {
    
    private static final String CHANNEL_ID_CALLS = "calls";
    private static final String CHANNEL_ID_MESSAGES = "messages";
    private static final String CHANNEL_ID_DEFAULT = "default";
    
    @Override
    public void load() {
        createNotificationChannels();
    }
    
    private void createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationManager notificationManager = getContext().getSystemService(NotificationManager.class);
            
            // Call notifications channel (high priority)
            NotificationChannel callChannel = new NotificationChannel(
                CHANNEL_ID_CALLS,
                "Voice & Video Calls",
                NotificationManager.IMPORTANCE_HIGH
            );
            callChannel.setDescription("Incoming voice and video calls");
            callChannel.enableLights(true);
            callChannel.setLightColor(Color.GREEN);
            callChannel.enableVibration(true);
            callChannel.setVibrationPattern(new long[]{0, 1000, 500, 1000});
            callChannel.setSound(RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE), null);
            
            // Message notifications channel
            NotificationChannel messageChannel = new NotificationChannel(
                CHANNEL_ID_MESSAGES,
                "Messages",
                NotificationManager.IMPORTANCE_DEFAULT
            );
            messageChannel.setDescription("New messages and chats");
            messageChannel.enableLights(true);
            messageChannel.setLightColor(Color.BLUE);
            
            // Default channel
            NotificationChannel defaultChannel = new NotificationChannel(
                CHANNEL_ID_DEFAULT,
                "General Notifications",
                NotificationManager.IMPORTANCE_DEFAULT
            );
            
            notificationManager.createNotificationChannel(callChannel);
            notificationManager.createNotificationChannel(messageChannel);
            notificationManager.createNotificationChannel(defaultChannel);
        }
    }
    
    @PluginMethod
    public void showCallNotification(PluginCall call) {
        String title = call.getString("title", "Incoming Call");
        String body = call.getString("body", "Someone is calling you");
        String callerName = call.getString("callerName", "Unknown");
        String callType = call.getString("callType", "voice");
        
        Intent answerIntent = new Intent(getContext(), NotificationActionReceiver.class);
        answerIntent.setAction("ANSWER_CALL");
        answerIntent.putExtra("callerName", callerName);
        answerIntent.putExtra("callType", callType);
        
        Intent declineIntent = new Intent(getContext(), NotificationActionReceiver.class);
        declineIntent.setAction("DECLINE_CALL");
        declineIntent.putExtra("callerName", callerName);
        
        PendingIntent answerPendingIntent = PendingIntent.getBroadcast(
            getContext(), 0, answerIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        PendingIntent declinePendingIntent = PendingIntent.getBroadcast(
            getContext(), 1, declineIntent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        NotificationCompat.Builder builder = new NotificationCompat.Builder(getContext(), CHANNEL_ID_CALLS)
            .setSmallIcon(android.R.drawable.ic_menu_call)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setCategory(NotificationCompat.CATEGORY_CALL)
            .setAutoCancel(false)
            .setOngoing(true)
            .setFullScreenIntent(answerPendingIntent, true)
            .addAction(android.R.drawable.ic_menu_call, "Answer", answerPendingIntent)
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Decline", declinePendingIntent);
        
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getContext());
        notificationManager.notify(1001, builder.build());
        
        call.resolve();
    }
    
    @PluginMethod
    public void showMessageNotification(PluginCall call) {
        String title = call.getString("title", "New Message");
        String body = call.getString("body", "You have a new message");
        String sender = call.getString("sender", "Unknown");
        String deepLink = call.getString("deepLink", "/");
        
        Intent intent = new Intent(getContext(), MainActivity.class);
        intent.putExtra("deepLink", deepLink);
        intent.putExtra("sender", sender);
        
        PendingIntent pendingIntent = PendingIntent.getActivity(
            getContext(), 0, intent, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        
        NotificationCompat.Builder builder = new NotificationCompat.Builder(getContext(), CHANNEL_ID_MESSAGES)
            .setSmallIcon(android.R.drawable.ic_dialog_email)
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_DEFAULT)
            .setContentIntent(pendingIntent)
            .setAutoCancel(true);
        
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getContext());
        notificationManager.notify(1002, builder.build());
        
        call.resolve();
    }
    
    @PluginMethod
    public void setBadgeCount(PluginCall call) {
        int count = call.getInt("count", 0);
        
        // Badge counting implementation would go here
        // This varies by device manufacturer (Samsung, Xiaomi, etc.)
        
        JSObject result = new JSObject();
        result.put("success", true);
        result.put("count", count);
        call.resolve(result);
    }
    
    @PluginMethod
    public void clearAllNotifications(PluginCall call) {
        NotificationManagerCompat notificationManager = NotificationManagerCompat.from(getContext());
        notificationManager.cancelAll();
        
        call.resolve();
    }
}
