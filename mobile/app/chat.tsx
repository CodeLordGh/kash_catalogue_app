import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { GiftedChat, IMessage as GiftedChatIMessage, Message } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, onChildAdded } from "firebase/database";
import { database } from "./firebase"; // Adjust the import based on your structure
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { baseUrl } from "@/baseUrl";

// Extend the IMessage interface to include our custom properties
interface IMessage extends GiftedChatIMessage {
  pending?: boolean;
  failed?: boolean;
}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const auth = useSelector((state: any) => state.user.userInfo.userAuth);
  const navigation = useNavigation();

  const chatId = useSelector((state: any) => state.user.chatId) as string;
  const currentUser = useSelector((state: any) => state.user.userInfo);

  useEffect(() => {
    if (!currentUser) return;
    const chatRef = ref(database, `chats/${chatId}/messages`);

    const unsubscribe = onChildAdded(chatRef, (snapshot) => {
      const message = snapshot.val();

      if (message) {
        setMessages((previousMsg) => {
          // Check if the message already exists in the list
          const messageExists = previousMsg.some((msg) => msg._id === message._id);
          if (!messageExists) {
            return [{
              _id: message._id,
              text: message.message,
              createdAt: message.timestamp,
              user: { _id: message.sender },
            }, ...previousMsg];
          }
          return previousMsg;
        });
      }
    });

    // Clean up the listener
    return () => unsubscribe();
  }, [chatId]);

  // Function to send a message to the server
  const sendMessageToServer = async (message: IMessage) => {
    try {
      await axios.post(
        `${baseUrl}/chat`,
        {
          sender: message.user,
          message: message.text,
          chatId: chatId,
          _id: message._id,
          createdAt: message.createdAt,
        },
        {
          headers: {
            Authorization: `Bearer ${auth}`,
          },
        }
      );
      // If successful, update the message state to remove pending and failed flags
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === message._id
            ? { ...msg, pending: false, failed: false }
            : msg
        )
      );
    } catch (error) {
      console.error("Error sending message:", error);
      // If failed, update the message state to mark it as failed
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === message._id
            ? { ...msg, pending: false, failed: true }
            : msg
        )
      );
    }
  };

  // Function to retry sending a failed message
  const retryMessage = useCallback(async (messageId: string) => {
    const messageToRetry = messages.find((msg) => msg._id === messageId);
    if (messageToRetry) {
      // Mark the message as pending again
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId
            ? { ...msg, pending: true, failed: false }
            : msg
        )
      );
      // Try to send the message again
      await sendMessageToServer(messageToRetry);
    }
  }, [messages]);

  const handleSend = useCallback(async (newMessages: IMessage[] = []) => {
    const message = newMessages[0];

    // Check if the message already exists before adding it
    setMessages((prevMessages) => {
      const messageExists = prevMessages.some((msg) => msg._id === message._id);
      if (!messageExists) {
        return GiftedChat.append(prevMessages, [{ ...message, pending: true }]);
      }
      return prevMessages;
    });

    // Send the message to the server
    await sendMessageToServer(message);
  }, [chatId, auth]);

  // Custom render function for messages
  const renderMessage = useCallback((props: any) => {
    const { currentMessage } = props;
    return (
      <View>
        <Message {...props} />
        {currentMessage.pending && (
          <Text style={styles.pendingText}>Sending...</Text>
        )}
        {currentMessage.failed && (
          <TouchableOpacity onPress={() => retryMessage(currentMessage._id)}>
            <Text style={styles.failedText}>
              Failed to send. Tap to retry.
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }, [retryMessage]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ paddingLeft: 20 }}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.messageList}>
        <GiftedChat
          messages={messages}
          onSend={(newMessages: IMessage[]) => handleSend(newMessages)}
          user={{
            _id: currentUser.userId,
          }}
          renderMessage={renderMessage}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#6200EE",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#f5f5f5",
    margin: 20,
    textAlign: "center",
  },
  messageList: {
    flex: 1,
    padding: 10,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
    backgroundColor: "#151515",
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#343434",
    borderRadius: 10,
    marginBottom: 10,
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontWeight: "bold",
    color: "#f5f5f5",
  },
  message: {
    fontSize: 14,
    color: "#f5f5f5",
  },
  time: {
    fontSize: 12,
    color: "#808080",
  },
  pendingText: {
    fontSize: 12,
    color: "#888",
    fontStyle: 'italic',
    marginLeft: 10,
  },
  failedText: {
    fontSize: 12,
    color: 'red',
    marginLeft: 10,
  },
});

export default Chat;
