import React, { useState } from 'react';
import { NativeModules, Button, View, Text, Alert, DeviceEventEmitter, TextInput } from 'react-native';

const { NearbyConnection } = NativeModules;

const App = () => {
    const [endpoints, setEndpoints] = useState([]);
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState();
    const [targetName, setTargetName] = useState("");

    let name = "samsung"

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
        // message%target_name
        NearbyConnection.sendMessage(endpointId, msg);
        setMsg("");
    }

    const receiveMessage = (event) => {
        alert(JSON.stringify(event));
        // setMessages([...messages, event]);
    }

    const msendMessage = (senderName) => {
        endpoints.map(endpoint => {
            let id = endpoint.split('_')[0];
            let endpointName = endpoint.split('_')[1];
            console.log(endpointName, senderName)
            if(endpointName !== senderName){
                let message = msg;
                message = msg + '%' + targetName + '%' + name;
                NearbyConnection.sendMessage(id, message);
            }
        })
    }

    const mreceiveMessage = (event) => {
        let data = event['message']
        console.log(event)
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
