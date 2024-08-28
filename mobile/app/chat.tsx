import { Ionicons } from "@expo/vector-icons";
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, onChildAdded } from "firebase/database";
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
  const auth = useSelector((state: any) => state.user.userInfo.userAuth);
  const navigation = useNavigation();
  const baseUrl = useSelector((state:any) => state.user.baseUrl)

  // console.log(auth)

  // Access currentUser from Redux store
  const chatId = useSelector((state: any) => state.user.chatId) as string;
  const currentUser = useSelector((state: any) => state.user.userInfo);

  useLayoutEffect(() => {
    if (!currentUser) return; // Ensure currentUser is available
    const chatRef = ref(database, `chats/${chatId}/messages`);

    const unsubscribe = onChildAdded(chatRef, (snapshot) => {
      const message = snapshot.val();
      // console.log(Array.from(message));
      // message.forEach((msg: any) => {
      //   console.log(msg.message);
      // });
      if (message) {
        // message.forEach((msg: any) => {
        setMessages((previuosMsg: any) => [
          {
            _id: message._id,
            text: message.message,
            createdAt: message.timestamp,
            user: { _id: message.sender },
          },
          ...previuosMsg,
        ]);
        // });
      }
    });
    // Clean up the listener
    return () => unsubscribe();
  }, [chatId]);

  const handleSend = useCallback(async (messages = []) => {
    // setMessages((prv) => GiftedChat.append(prv, messages));
    const { _id, text, user, createdAt } = messages[0];

    try {
      const startTime = Date.now();
      console.log("starting")
      await axios
        .post(
          `https://czc9hkp8-3000.uks1.devtunnels.ms/chat`,
          {
            sender: user,
            message: text,
            chatId: chatId,
            _id,
            createdAt,
          },
          {
            headers: {
              Authorization: `Bearer ${auth}`,
            },
          }
        )
        .then((data) => {
          const endTime = Date.now();
          const duration = endTime - startTime; // Duration in milliseconds
          console.log(`Request took ${duration} ms`);
      console.log("completed")

          // Handle your data here
        })
      // console.log(response.data);
    } catch (error: any) {
      console.log(error.response);
      console.error("Error sending message:", error);
    }
  }, []);

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
          onSend={(messages: any) => handleSend(messages)}
          user={{
            _id: currentUser.userId,
            // name: currentUser.model,
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
