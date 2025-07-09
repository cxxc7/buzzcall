
package app.lovable.notifications;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;
import androidx.core.app.NotificationManagerCompat;

/**
 * Handles notification actions (Answer/Decline calls, etc.)
 */
public class NotificationActionReceiver extends BroadcastReceiver {
    
    private static final String TAG = "NotificationAction";
    
    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        String callerName = intent.getStringExtra("callerName");
        
        Log.d(TAG, "Received action: " + action + " for caller: " + callerName);
        
        // Clear the call notification
        NotificationManagerCompat.from(context).cancel(1001);
        
        if ("ANSWER_CALL".equals(action)) {
            // Handle call answer
            Intent answerIntent = new Intent(context, MainActivity.class);
            answerIntent.putExtra("action", "answer_call");
            answerIntent.putExtra("callerName", callerName);
            answerIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(answerIntent);
            
        } else if ("DECLINE_CALL".equals(action)) {
            // Handle call decline
            Log.d(TAG, "Call declined for: " + callerName);
            // You could send this info back to your server
        }
    }
}
