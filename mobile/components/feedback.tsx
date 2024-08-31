
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as MailComposer from 'expo-mail-composer';
import * as Haptics from 'expo-haptics';

interface FeedbackButtonProps {
  recipientEmail: string;
  subject?: string;
  bodyPrefix?: string;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  recipientEmail,
  subject = 'App Feedback',
  bodyPrefix = 'Please enter your feedback here...',
}) => {
  const handleFeedback = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      const isAvailable = await MailComposer.isAvailableAsync();
      if (!isAvailable) {
        console.log('Mail composer is not available on this device');
        return;
      }

      await MailComposer.composeAsync({
        recipients: [recipientEmail],
        subject: subject,
        body: bodyPrefix,
      });
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleFeedback}>
      <Text style={styles.buttonText}>Send Feedback</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeedbackButton;