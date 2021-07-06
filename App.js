import React, { useState } from 'react';
import { NativeModules, Button, View, Text, Alert, DeviceEventEmitter, TextInput } from 'react-native';

const { NearbyConnection } = NativeModules;

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Generates a random string twhich serves as an identifer
// for the endpoint
const generateString = (length) => {
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const App = () => {
    const [endpoints, setEndpoints] = useState([]);
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState();

    let name = generateString(5);

    // Start discovery with given `name`
    const discover = () => {
        NearbyConnection.startDiscovery(
            name
        );
    }

    // Start advertising with `given` name
    const advertise = () => {
        NearbyConnection.startAdvertising(
            name
        );
    }

    const endpointList = (event) => {
        setEndpoints(event);
    }

    // Sends a message to the given endpoint
    const sendMessage = (endpointId) => {
        console.log(endpointId)
        NearbyConnection.sendMessage(endpointId, msg);
        setMsg("");
    }

    const receiveMessage = (event) => {
        alert(JSON.stringify(event));
        // setMessages([...messages, event]);
    }

    // Listens for endpoints discovered/lost
    DeviceEventEmitter.addListener('endpoints', endpointList);

    // Listens for incoming messages
    DeviceEventEmitter.addListener('message', receiveMessage);

    return (
        <View style={{ flex: 1 }}>
            <Button
                title="Advertise"
                color='#841584'
                onPress={advertise}
            />
            <Button
                title="Discover"
                color='#841584'
                onPress={discover}
            />
            <TextInput style={{ backgroundColor: 'black', color: 'white' }} value={msg} onChangeText={text => setMsg(text)} />
            {endpoints.map((item, key) => {
                return (
                    <Button key={key} onPress={() => sendMessage(item)} title={item} />
                );
            })}
        </View>
    )
}

export default App;
