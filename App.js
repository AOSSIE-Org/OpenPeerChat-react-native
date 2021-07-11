import React, { useState } from 'react';
import { NativeModules, Button, View, Text, Alert, DeviceEventEmitter, TextInput } from 'react-native';

const { NearbyConnection } = NativeModules;

const ID_SIZE = 5;

const generateId = (length) => {
    let id = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
}

const App = () => {
    const [endpoints, setEndpoints] = useState([]);
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState();
    const [targetName, setTargetName] = useState("");

    let name = generateId(ID_SIZE);

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

    const msendMessage = (senderName) => {
        endpoints.map(endpoint => {
            let id = endpoint.split('_')[0];
            let endpointName = endpoint.split('_')[1];
            if(endpointName !== senderName){
                let message = msg;
                message = msg + '%' + targetName + '%' + name;
                NearbyConnection.sendMessage(id, message);
            }
        })
    }

    const mreceiveMessage = (event) => {
        let data = event['message']
        // split the message
        data = data.split('%');
        let message = data[0];
        let targetName = data[1];
        let senderName = data[2];
        if(name === targetName){
            alert(`Message: ${message}`);
            return;
        }
        else{
            alert(`Message is hopped for ${targetName}`);
            msendMessage(senderName);
        }
    }

    // Listens for endpoints discovered/lost
    DeviceEventEmitter.addListener('endpoints', endpointList);

    // Listens for incoming messages
    DeviceEventEmitter.addListener('message', mreceiveMessage);

    return (
        <View style={{ flex: 1 }}>
            <Text style={{alignSelf: 'center'}}>Name of device: {name}</Text>
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
            <TextInput style={{ backgroundColor: 'red', color: 'white' }}
                placeholder="Target Name"
                placeholderTextColor="white"
                value={targetName} onChangeText={text => setTargetName(text)} />
            <TextInput style={{ backgroundColor: 'black', color: 'white' }} value={msg} 
                placeholder="Message"
                placeholderTextColor="white"
                onChangeText={text => setMsg(text)} />
            {endpoints.map((item, key) => {
                return (
                    <Button key={key} onPress={() => msendMessage()} title={item} />
                );
            })}
        </View>
    )
}

export default App;
