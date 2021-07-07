import React from 'react';
import { NativeModules, Button } from 'react-native';

const { NearbyConnection } = NativeModules;

const Home = () => {
    const onPress = () => {
        console.log("Button is pressed");
    }

    return(
        <Button 
            title="Check"
            color='#841584'
            onPress={onPress}
        />
    )
}

export default Home;