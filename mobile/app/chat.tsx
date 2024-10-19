import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal, Animated, Alert, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, IMessage as GiftedChatIMessage, Bubble } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ref, onChildAdded, off } from 'firebase/database';
import { database } from './firebase';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { baseUrl } from '@/baseUrl';
import { Ionicons } from '@expo/vector-icons';

interface IMessage extends GiftedChatIMessage {
  pending?: boolean;
  failed?: boolean;
}

interface ProductInfo {
  id: string;
  name: string;
  price: number;
  description: string;
}


const Chat: React.FC = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isProductModalVisible, setProductModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductInfo | null>(null);
  const [modalAnimation] = useState(new Animated.Value(0));

  const auth = useSelector((state: any) => state.user.userInfo.userAuth);
  const navigation = useNavigation();
  const chatId = useSelector((state: any) => state.user.chatId) as string;
  const currentUser = useSelector((state: any) => state.user.userInfo);
  const isVendor = currentUser.User === 'Seller';

  const chatRef = useRef(ref(database, `chats/${chatId}/messages`));

  useEffect(() => {
    if (!currentUser) return;
    const handleNewMessage = (snapshot: any) => {
      const message = snapshot.val();
      if (message) {
        setMessages((previousMsg) => {
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
    };

    onChildAdded(chatRef.current, handleNewMessage);

    return () => {
      off(chatRef.current, 'child_added', handleNewMessage);
    };
  }, [chatId]);

  const sendMessageToServer = useCallback(async (message: IMessage) => {
    try {
      // const encryptedMessage = encryptMessage(message.text);
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
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === message._id
            ? { ...msg, pending: false, failed: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === message._id
            ? { ...msg, pending: false, failed: true }
            : msg
        )
      );
    }
  }, [chatId, auth]);

  const retryMessage = useCallback(async (messageId: string) => {
    const messageToRetry = messages.find((msg) => msg._id === messageId);
    if (messageToRetry) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId
            ? { ...msg, pending: true, failed: false }
            : msg
        )
      );
      await sendMessageToServer(messageToRetry);
    }
  }, [messages, sendMessageToServer]);

  const handleSend = useCallback(async (newMessages: IMessage[] = []) => {
    const message = newMessages[0];
    setMessages((prevMessages) => {
      const messageExists = prevMessages.some((msg) => msg._id === message._id);
      if (!messageExists) {
        return GiftedChat.append(prevMessages, [{ ...message, pending: true }]);
      }
      return prevMessages;
    });
    await sendMessageToServer(message);
  }, [sendMessageToServer]);

  const renderBubble = useCallback((props: any) => {
    const { currentMessage } = props;
    const productIdRegex = /\b\d{6}\b/;
    const match = currentMessage.text.match(productIdRegex);

    if (isVendor && match) {
      return (
        <TouchableOpacity onPress={() => handleProductPress(match[0])}>
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                backgroundColor: '#6200EE',
              },
              left: {
                backgroundColor: '#f0f0f0',
              },
            }}
          />
        </TouchableOpacity>
      );
    }

    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#6200EE',
          },
          left: {
            backgroundColor: '#f0f0f0',
          },
        }}
      />
    );
  }, [isVendor]);

  const handleProductPress = useCallback(async (productId: string) => {
    try {
      const response = await axios.get(`${baseUrl}/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${auth}`,
        },
      });
      setSelectedProduct(response.data);
      setProductModalVisible(true);
      Animated.timing(modalAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error('Error fetching product info:', error);
      Alert.alert("Error fetching product info")
    }
  }, [auth, modalAnimation]);

  const closeProductModal = useCallback(() => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setProductModalVisible(false);
      setSelectedProduct(null);
    });
  }, [modalAnimation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat</Text>
      </View>
      <KeyboardAvoidingView style={styles.chatContainer} behavior="padding">
        <GiftedChat
          messages={messages}
          onSend={handleSend}
          user={{
            _id: currentUser.userId,
          }}
          renderBubble={renderBubble}
          renderAvatar={null}
          bottomOffset={100}
          renderMessage={(props) => {
            const { currentMessage } = props;
            if ((currentMessage as any).failed) {
              return (
                <View>
                  <TouchableOpacity onPress={() => retryMessage(currentMessage?._id as any)}>
                    <Text style={styles.retryText}>Retry</Text>
                  </TouchableOpacity>
                  {renderBubble(props)}
                </View>
              );
            }
            return renderBubble(props);
          }}
        />
      </KeyboardAvoidingView>
      <Modal
        visible={isProductModalVisible}
        transparent={true}
        animationType="none"
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={closeProductModal}
        >
          <Animated.View 
            style={[
              styles.productInfoCard,
              {
                transform: [
                  {
                    translateY: modalAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [300, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {selectedProduct && (
              <>
                <Text style={styles.productTitle}>{selectedProduct.name}</Text>
                <Text style={styles.productPrice}>Price: ${selectedProduct.price.toFixed(2)}</Text>
                <Text style={styles.productDescription}>{selectedProduct.description}</Text>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
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
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    marginBottom:20
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  productInfoCard: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 200,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 16,
    color: '#6200EE',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 14,
    color: '#333',
  },
  retryText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default React.memo(Chat);
