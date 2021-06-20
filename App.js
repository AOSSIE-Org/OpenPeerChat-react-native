import React, { useState } from 'react';
import { NativeModules, Button, View } from 'react-native';

const { NearbyConnection } = NativeModules;

const App = () => {
    const [devices, setDevices] = useState([]);

    const discover = () => {
        NearbyConnection.startDiscovery(
            "ritik",
            "12345",
        );
    }
    
    const advertise = () => {
        NearbyConnection.startAdvertising(
            "ritik",
            "12345",
        );
    }

    const func = async () => {
        const d = await NearbyConnection.endpoints();
        console.log(d)
        setDevices(d);
    }

    const sendData = () => {
        if(devices.length>0){
            let id = devices[0].endpointId;
            NearbyConnection.sendMessage(id, "HI there from Mom!");
            console.log("Message sent!");
        }
        else{
            console.log("No device connected");
        }
    }

    const receiveMessage = async () => {
        const msg = await NearbyConnection.getMessage();
        console.log("This is the msg", msg);
    }


    return(
        <View>
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
            <Button
                title="Check"
                color="green"
                onPress={func}
            />
            <Button 
                title="Send Message"
                color="blue"
                onPress={sendData}
           />
           <Button
                title="receive"
                color="black"
                onPress={receiveMessage}
           />
        </View>
    )
}

export default App;
