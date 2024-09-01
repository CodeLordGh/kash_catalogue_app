import * as admin from "firebase-admin";

export interface NotificationData {
  title: string;
  body: string;
  imageUrl?: string;
  productId?: string;
}

const sendPushNotification = async (
  token: string,
  { title, body, imageUrl, productId }: NotificationData
): Promise<void> => {
  const message: admin.messaging.Message = {
    token,
    notification: {
      title,
      body,
      imageUrl,
    },
    data: {
      productId: productId || '',
    },
    android: {
      notification: {
        imageUrl,
        clickAction: 'FLUTTER_NOTIFICATION_CLICK',
      },
    },
    apns: {
      payload: {
        aps: {
          'mutable-content': 1,
          alert: {
            title,
            body,
          },
        },
      },
      fcmOptions: {
        // You can include other valid properties here
      },
    },
  };

  try {
    await admin.messaging().send(message);
    console.log('Notification sent successfully');
  } catch (error) {
    console.error('Error sending push notification:', error);
  }
};

export { sendPushNotification };