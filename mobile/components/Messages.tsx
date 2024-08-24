import { ChatParamList } from "@/app/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { ref, onValue } from "firebase/database";
import { database } from "@/app/firebase";
import { retrieveStoreId, retrieveToken } from "@/app/token";

type GoToChat = StackNavigationProp<ChatParamList, "Chat">;

interface Message {
  _id: string;
  sender: string;
  receiver: string;
  image: string;
  messages: MessageList[];
  buyerId: string;
  storeId: string;
  time: string;
}

export interface MessageList {
  message: string;
  sender: string;
  timestamp: number;
}

interface MessageItemProps {
  messages: MessageList[];
  time: string;
  image: string;
  id: string;
  receiverId: string;
  storeId: string;
  buyerId: string;
}

const MessageItem = ({
  messages,
  image,
  buyerId,
  storeId,
  id,
}: MessageItemProps) => {
  const navigation = useNavigation<GoToChat>();

  const handlePress = () => {
    navigation.navigate("Chat", {
      currentUser: { id: id, model: "Seller" },
      buyerId: buyerId,
      storeId,
    });
  };

  const date = new Date(messages[0].timestamp);
  const date2 = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  // console.log(date2);
  
  return (
    <TouchableOpacity onPress={handlePress} style={styles.messageItem}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.messageContent}>
        <Text style={styles.name}>{buyerId}</Text>
        <Text style={styles.message}>{messages[0].message}</Text>
        <Text style={styles.time}>{date2}</Text>
      </View>
    </TouchableOpacity>
  );
};

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const store = async () => await retrieveStoreId();
  const [storeId, setStoreId] = useState("");

  store().then((storeId: any) => {
    setStoreId(storeId);
  });
  useEffect(() => {
    const chatRef = ref(database, "chats");

    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const messageList = Object.keys(data).map((key) => ({
          _id: key,
          ...data[key],
        }));
        // Filter messages based on the storeId of the seller
        const filteredMessages = messageList.filter(
          (chat: any) => chat.storeId === storeId
        );
        // console.log(filteredMessages)
        setMessages(filteredMessages);
      }
    });
  }, [storeId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Messages</Text>
      <View style={styles.messageList}>
        <ScrollView>
          {messages.map((msg) => (
            <MessageItem
              key={msg._id}
              id={msg._id}
              buyerId={msg.buyerId}
              messages={msg.messages}
              time={msg.time}
              image={msg.image}
              storeId={msg.storeId}
              receiverId={msg.buyerId}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default Messages;
