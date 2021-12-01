# About Peer-to-Peer Messaging

The Peer-to-Peer Messaging in an app that does not rely on a central server to intermediate the messages across the peers. The app is intended to provide privacy, high communication efficiency, censorship resistance, and extra resilience to the users. Also, the app intends to provide users with peer-to-peer communication independent of network connectivity. This can be extremely useful in disaster-prone and remote areas (or even in case of a network outage) where network connectivity might not be a go-to thing. Hence, the app would be reliable and secure at the same time which is the main motivation to develop this application.

# Tech Stack

    - React Native
    - Google Nearby Connection API
    - RSA Encryption

## Install Dependencies

This project is built using React Native.

Follow the guide to install dependencies for :-

- [Windows](doc/dependencies_windows.md)
- [macOs](doc/dependencies_macOS.md)
- [Linux](doc/dependencies_linux.md)

### Setup

1. Install package-dependencies using NPM.

```
npm install
```

2. Install the app using react-native cli

```
react-native run-android
```

3. Start the metro server

```
npm start
```

# Nearby Connection API

A Native module for Google's Nearby Connection API has been developed in this application so that it can be used in react-native. The methods that are exposed are:

`startDiscovery` - Starts discovering nearby devices - Takes `id: string` as an input parameter which is the identifier for the device

`startAdvertising` - Start Advertising to nearby devices - Takes `id: string` as an input parameter which is the identifier for the device

`sendMessage` - Sends message to nearby devices - Takes `id: string` and `payload: string` as the input parameter. The `id` is the identifier of the nearby device

`receiveMessage` - Receives message from nearby devices

`getEndpoints` - Get Nearby devices available

# Screenshots

- [Splash](https://ibb.co/xshDM28)
- [Info](https://ibb.co/9ThsNfD)
- [Chat](https://ibb.co/wYHMsPy)
- [Add Chat](https://ibb.co/1MYG6QQ)
- [Home](https://ibb.co/jb3Kcbk)
