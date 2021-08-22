# Peer-to-Peer Messaging App - React Native

## Student - Ritik Jain

Links: https://gitlab.com/aossie/p2p-messaging-react-native

# Peer-to-Peer Message tranfer

The project aims to design and develop a Peer-to-Peer Messaging app that does not rely on any central server to intermediate the communication across the peers. The app should be secure and workable independent of the network connectivity.

# How offline peer to peer communication works

The mode of transportation for the payload/messages is Bluetooth/WiFi. We are using [Nearby Connection API](https://developers.google.com/nearby/connections/overview) developed by Google to fascilitate P2P offline communication. In order to increase the bandwidth for the communication range, we have introduced a simple hopping architecture based on GossipSub protocol. So, let's say there are three devices A, B and C, where A and C are not in communication but B is in communication range of both of A and C devices, we will use B device as an intermediate node to relay our message from A to C. In this way, we can increase the bandwidth of the app.

The Google's nearby connection API do not have any wrapper for latest versions of react-native apps. Hence, a module is being developed in this GSoC period in order to port java code to be utilized in react-native. The future goal of this module would be a dedicated npm package for Nearby Connection API that can be later be directly used in the app.

In order to make app secure and end-to-end encrypted, we have used RSA Asymmetric encryption. In this algorithm, we have a pair of public and private keys. A user encrypts the message with the public key of the target peer. This message can only be decrypted with the private key of the target peer. In this way, an interceptor cannot understand/decrypt the message thereby making the app secure.
The public keys have to be shared beforehand among the peers before they start communication.

# Technologies used
    - React-Native
    - Google Nearby Connection API
    - RSA Asymmetric encryption

# Merge Requests

1. [Merge request !1](https://gitlab.com/aossie/p2p-messaging-react-native/-/merge_requests/1) - Project setup and native code for discovery and advertisement to nearby devices
    -   Initialized boilerplate code for react-native
    -   Started writing module for Google Nearby Connection API

2. [Merge request !2](https://gitlab.com/aossie/p2p-messaging-react-native/-/merge_requests/2) - Send and Receive messages from nearby devices
    - Working functionality to auto-connect to Nearby devides and send/receive messages

3. [Merge request !3](https://gitlab.com/aossie/p2p-messaging-react-native/-/merge_requests/3) - Feat: Adhoc network implemenation using GossipSub
    - Developed the architecture for hopping of messages across the nodes

4. [Merge request !4](https://gitlab.com/aossie/p2p-messaging-react-native/-/merge_requests/8) - Sqlite integration
    - Developed sqlite database for storing of incoming and outgoing messages

5. [Merge request !5](https://gitlab.com/aossie/p2p-messaging-react-native/-/merge_requests/9) - Feat: Added Encryption algorithm - Status: _To be merged_
    - Added RSA encryption algorithm to increase the security of the app

# Screenshots

- [Splash](https://ibb.co/xshDM28)
- [Info](https://ibb.co/9ThsNfD)
- [Chat](https://ibb.co/wYHMsPy)
- [Add Chat](https://ibb.co/1MYG6QQ)
- [Home](https://ibb.co/jb3Kcbk)

# Extra Reads
- [Presentation (1st eval)](https://gitlab.com/aossie/p2p-messaging-react-native)
- [Blog](https://medium.com/nerd-for-tech/peer-to-peer-chat-app-using-webrtc-and-react-native-6c15759f92ec)
- [Proposal](https://docs.google.com/document/d/18DDmPKtJRy-dvH7TcNHWJG05-laCygd2_zg6MCnYrgE/edit)

Lastly I am really grateful to my mentors - Bruno, Thuvakaran, Madhav and Aditya from whom I learnt a lot and also a big thanks to my team members, Harjeet and Tanya for helping me throughout my GSoC journey.
