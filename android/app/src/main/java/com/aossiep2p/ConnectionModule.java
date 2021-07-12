package com.aossiep2p;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.HashMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.android.gms.nearby.connection.AdvertisingOptions;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.connection.ConnectionInfo;
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback;
import com.google.android.gms.nearby.connection.ConnectionResolution;
import com.google.android.gms.nearby.connection.ConnectionsStatusCodes;
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo;
import com.google.android.gms.nearby.connection.DiscoveryOptions;
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback;
import com.google.android.gms.nearby.connection.Payload;
import com.google.android.gms.nearby.connection.PayloadCallback;
import com.google.android.gms.nearby.connection.PayloadTransferUpdate;
import android.util.Log;


public class ConnectionModule extends ReactContextBaseJavaModule {
    // reactContext is the interface to global information about an application environment.
    private static ReactApplicationContext reactContext;

    /**
     * Set to true if advertising
     **/
    private boolean mIsAdvertising = false;

    /**
     * True if we are discovering
     */
    private boolean mIsDiscovering = false;

    /**
     * Human readable name of the device
     **/
    private String mName;

    /**
     * Endpoints discovered till now
     */
    private final Map<String, Endpoint> mEndpoints = new HashMap<>();

    /**
     * ServiceId for the app
     */
    private final String SERVICE_ID = "com.package.aossiep2p";

    ConnectionModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    // Payload is the data packet sent between the devices
    PayloadCallback payloadCallback = new PayloadCallback() {
        @Override
        public void onPayloadReceived(String endpointId, Payload payload) {
            // This always gets the full data of the payload. Will be null if it's not a BYTES
            // payload. You can check the payload type with payload.getType().
            byte[] receivedBytes = payload.asBytes();
            String msg = new String(receivedBytes, StandardCharsets.UTF_8);
            emitMessage(msg);
        }

        @Override
        public void onPayloadTransferUpdate(String endpontId, PayloadTransferUpdate payloadTransferUpdate) {
            // Bytes payloads are sent as a single chunk, so you'll receive a SUCCESS update immediately
            // after the call to onPayloadReceived().
        }
    };

    /*
        The ConnectionLifecycleCallback parameter is the callback that will be invoked when
        discoverers request to connect to the advertiser.
     */
    ConnectionLifecycleCallback connectionLifecycleCallback =
            new ConnectionLifecycleCallback() {
                @Override
                public void onConnectionInitiated(String endpointId, ConnectionInfo connectionInfo) {
                    /**
                     * @endpointId: Id of the remote peer trying to establish connection
                     * @connectionInfo: metadata about the connection
                     */
                    // Automatically accept the connection from the remote endpoint
                    Nearby.getConnectionsClient(reactContext).acceptConnection(endpointId, payloadCallback);
                }

                @Override
                public void onConnectionResult(String endpointId, ConnectionResolution result) {
                    switch (result.getStatus().getStatusCode()) {
                        case ConnectionsStatusCodes.STATUS_OK:
                            // We're connected! Can now start sending and receiving data.
                            Log.d("Status", "Ok");
                            break;
                        case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
                            // The connection was rejected by one or both sides.
                            Log.e("Status", "rejected");
                            break;
                        case ConnectionsStatusCodes.STATUS_ERROR:
                            Log.e("Status", "error");
                            // The connection broke before it was able to be accepted.
                            break;
                        default:
                            // Unknown status code
                    }
                }

                @Override
                public void onDisconnected(String endpointId) {
                    // We've been disconnected from this endpoint. No more data can be
                    // sent or received.
                }
            };

    /*
        The EndpointDiscoveryCallback parameter is the callback that will be invoked when nearby
        advertisers are discovered or lost
     */
    private final EndpointDiscoveryCallback endpointDiscoveryCallback =
            new EndpointDiscoveryCallback() {
                @Override
                public void onEndpointFound(String endpointId, DiscoveredEndpointInfo info) {
                    // An endpoint was found. We request a connection to it.
                    Log.d("Endpoint discovered", info.getEndpointName());
                    Endpoint endpoint = new Endpoint(SERVICE_ID, endpointId, info.getEndpointName());
                    mEndpoints.put(endpointId, endpoint);
                    getEndpoints(); // emits endpoint list to the react-native side
                    Nearby.getConnectionsClient(reactContext)
                            .requestConnection(mName, endpointId, connectionLifecycleCallback)
                            .addOnSuccessListener(
                                    (Void unused) -> {
                                        Log.d("connected", endpointId);
                                    })
                            .addOnFailureListener(
                                    (Exception e) -> {
                                        // Nearby Connections failed to request the connection.
                                        Log.e("disconnected", endpointId);
                                    });
                }

                @Override
                public void onEndpointLost(@NonNull String endpointId) {
                    // The endpoint discovered is lost
                    mEndpoints.remove(endpointId);
                    getEndpoints();
                }
            };

    @ReactMethod
    private void startAdvertising(final String name) {
        /**
         *@name: A human readable name for the endpoint that will appear on the remote device
         *@serviceId: An identifier to advertise your app to other endpoints
         **/
        mIsAdvertising = true;
        mName = name;
        /*
            Default strategy is P2P_Clusters. We can switch to
            another strategy using `setStrategy(STRATEGY)` method
            before build
         */
        AdvertisingOptions advertisingOptions =
                new AdvertisingOptions.Builder().build();
        Nearby.getConnectionsClient(reactContext)
                .startAdvertising(name, SERVICE_ID, connectionLifecycleCallback, advertisingOptions)
                .addOnSuccessListener(
                        (Void unused) -> {
                            // We're advertising!
                            Log.d("Advertising", "started");
                        })
                .addOnFailureListener(
                        (Exception e) -> {
                            mIsAdvertising = false;
                            // We were unable to start advertising.
                            Log.d("Advertising", "exception");
                        });
    }

    @ReactMethod
    private void startDiscovery(final String name) {
        /**
         *@name: A human readable name for the endpoint that will appear on the remote device
         *@serviceId: An identifier to advertise your app to other endpoints
         **/
        mIsDiscovering = true;
        mName = name;
        /*
            Default strategy is P2P_Clusters. We can switch to
            another strategy using `setStrategy(STRATEGY)` method
            before build
         */
        DiscoveryOptions discoveryOptions =
                new DiscoveryOptions.Builder().build();
        Nearby.getConnectionsClient(reactContext)
                .startDiscovery(SERVICE_ID, endpointDiscoveryCallback, discoveryOptions)
                .addOnSuccessListener(
                        (Void unused) -> {
                            // We're discovering!
                            Log.d("Success", "Discovery started");
                        })
                .addOnFailureListener(
                        (Exception e) -> {
                            // We're unable to start discovering.
                            Log.d("Exception", "Discovery failed");
                        });
    }

    // Sends the message received over to the react-native side
    private void emitMessage(String message) {
        WritableMap payload = Arguments.createMap();
        payload.putString("message", message);
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("message", payload);
    }

    // Sends message to the remote endpoint
    @ReactMethod
    public void sendMessage(String endpointId, String message) {
        /**
         * @endpointId: remote id of the device to send message
         * @message: Message to be sent
         **/
        byte[] bytes = message.getBytes(StandardCharsets.UTF_8);
        Payload bytesPayload = Payload.fromBytes(bytes);
        Nearby.getConnectionsClient(reactContext).sendPayload(endpointId, bytesPayload);
    }

    // Returns a list of all endpoints (`endpointIds`) discovered
    public void getEndpoints() {
        WritableArray endpointArray = Arguments.createArray();
        for (Map.Entry<String, Endpoint> endpoint: mEndpoints.entrySet()) {
            String key = endpoint.getKey();
            Endpoint epoint = mEndpoints.get(key);
            endpointArray.pushString(key+"_"+epoint.name);
        }
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("endpoints", endpointArray);
    }

    protected static class Endpoint {
        @NonNull private String serviceId;
        @NonNull private String id;
        @NonNull private String name;

        private Endpoint(String serviceId, String id, String name) {
            this.serviceId = serviceId;
            this.id = id;
            this.name = name;
        }

        public WritableMap toWritableMap() {
            WritableMap out = Arguments.createMap();

            out.putString("serviceId", serviceId);
            out.putString("endpointId", id);
            out.putString("endpointName", name);

            return out;
        }
    }

    // Returns `true` if advertising
    public boolean isAdvertising() {
        return mIsAdvertising;
    }

    // Returns `true` if discovering
    public boolean isDiscovering() {
        return mIsDiscovering;
    }

    // React-Native module name
    public String getName() {
        return "NearbyConnection";
    }
}