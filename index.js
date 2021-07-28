import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import "./polyfills.js";
import allSettled from 'promise.allsettled';
allSettled.shim();
AppRegistry.registerComponent(appName, () => App);
