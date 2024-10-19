import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { getDatabase, ref, get } from 'firebase/database';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChatParamList } from '@/app/types';
import { app } from '@/app/firebase';

type GoToChat = StackNavigationProp<ChatParamList, 'Chat'>;

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

interface MessageList {
  message: string;
  sender: string;
  timestamp: number;
}

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = useSelector((state: any) => state.user.userInfo.userId);
  const navigation = useNavigation<GoToChat>();

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const database = getDatabase(app);
      const chatRef = ref(database, 'chats');

      console.log('Fetching messages for user:', userId);

      const snapshot = await get(chatRef);
      const data = snapshot.val();

      if (data) {
        console.log('Data received:', data);
        const messageList = Object.entries(data).map(([key, value]) => ({
          _id: key,
          ...(value as any),
        }));
        const filteredMessages = messageList.filter(
          (chat) => chat.storeId === userId
        );
        console.log('Filtered messages:', filteredMessages);
        setMessages(filteredMessages);
      } else {
        console.log('No data received from Firebase');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to fetch messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userId]);

  const renderMessageItem = ({ item }: { item: Message }) => {
    const handlePress = () => {
      navigation.navigate('Chat', {
        currentUser: { id: item._id, model: 'Seller' },
        buyerId: item.buyerId,
        storeId: item.storeId,
      });
    };

    const date = new Date(item.messages[0].timestamp);
    const formattedTime = date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <TouchableOpacity style={styles.messageItem} onPress={handlePress}>
        <Image source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.messageContent}>
          <Text style={styles.buyerId}>{item.buyerId}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.messages[0].message}
          </Text>
        </View>
        <Text style={styles.time}>{formattedTime}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Messages</Text>
      </View>

      <View style={styles.messagesContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6200EE" />
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchMessages}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : messages.length > 0 ? (
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubble-ellipses-outline" size={64} color="#6200EE" />
            <Text style={styles.emptyStateText}>No messages yet</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6200EE',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  messageContent: {
    flex: 1,
  },
  buyerId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  time: {
    fontSize: 12,
    color: '#999',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 16,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Messages;
