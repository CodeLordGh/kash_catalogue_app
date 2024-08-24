import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { GiftedChat } from 'react-native-gifted-chat';
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, onChildAdded } from 'firebase/database';
import { ChatParamList } from "@/app/types"; // Adjust the import path as necessary
import { database } from "./firebase"; // Adjust the import based on your structure
import { IMessage as GiftedChatIMessage } from "react-native-gifted-chat";
import { retrieveToken } from "./token";
import axios from "axios";

type ChatRouteProp = RouteProp<ChatParamList, 'Chat'>;

// Define the IMessage interface
interface IMessage extends GiftedChatIMessage {}

const Chat = ({ route }: { route: ChatRouteProp }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const navigation = useNavigation();
  const { currentUser, buyerId } = route.params;
  const [auth, setAuth] = useState("")

  const _auth = async () => await retrieveToken();
_auth().then((auth:any) => {
  setAuth(auth);
});

  useEffect(() => {
    const chatId = currentUser.id
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
  }, [currentUser.id]);

  const handleSend = async (newMessages:IMessage[]) => {
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
        console.log(response.data)
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
