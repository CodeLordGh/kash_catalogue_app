import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, onChildAdded } from 'firebase/database';
import { database } from "./firebase"; // Adjust the import based on your structure
import { IMessage as GiftedChatIMessage } from "react-native-gifted-chat";
import { retrieveToken } from "./token";
import axios from "axios";
import { useSelector } from "react-redux"; // Import useSelector
import { useNavigation } from "@react-navigation/native";

// Define the IMessage interface
interface IMessage extends GiftedChatIMessage {}

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [auth, setAuth] = useState("");
  const navigation = useNavigation()

  // Access currentUser from Redux store
  const currentUser = useSelector((state: any) => state.user.userInfo.userId); // Adjust the state path based on your store structure
  console.log(currentUser)
  const _auth = async () => await retrieveToken();
  _auth().then((auth: any) => {
    setAuth(auth);
  });

  useEffect(() => {
    if (!currentUser) return; // Ensure currentUser is available
    const chatId = currentUser.id;
    const chatRef = ref(database, `chats/${chatId}/messages`);

    const unsubscribe = onChildAdded(chatRef, (snapshot) => {
      const message = snapshot.val();
      console.log(message.message);

      if (message) {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [{
            _id: snapshot.key || Date.now().toString(),
            text: message.message,
            createdAt: new Date(message.timestamp),
            user: {
              _id: 'buyer',
              name: message.senderModel,
            },
          }])
        );
      }
    });

    // Clean up the listener
    return () => unsubscribe();
  }, [currentUser]);

  const handleSend = async (newMessages: IMessage[]) => {
    const { text } = newMessages[0];

    try {
      const response = await axios.post('https://czc9hkp8-3000.uks1.devtunnels.ms/chat', {
        receiver: "buyer",
        message: text,
        chatId: currentUser.id
      }, {
        headers: {
          'Authorization': `Bearer ${auth}`,
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 20 }}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <View style={styles.messageList}>
        <GiftedChat
          messages={messages}
          onSend={handleSend}
          user={{
            _id: currentUser.id,
            name: currentUser.model,
          }}
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
});

export default Chat;
