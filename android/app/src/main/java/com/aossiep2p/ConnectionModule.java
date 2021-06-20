package com.aossiep2p;

import androidx.annotation.NonNull;
import android.Manifest;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.HashMap;
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

    private static final String[] REQUIRED_PERMISSIONS =
            new String[] {
                    Manifest.permission.BLUETOOTH,
                    Manifest.permission.BLUETOOTH_ADMIN,
                    Manifest.permission.ACCESS_WIFI_STATE,
                    Manifest.permission.CHANGE_WIFI_STATE,
                    Manifest.permission.ACCESS_COARSE_LOCATION,
            };

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
     * Identifier for the device
     **/
    private String mServiceId;

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
                            break;
                        case ConnectionsStatusCodes.STATUS_CONNECTION_REJECTED:
                            // The connection was rejected by one or both sides.
                            break;
                        case ConnectionsStatusCodes.STATUS_ERROR:
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
                    Nearby.getConnectionsClient(reactContext)
                            .requestConnection(mName, endpointId, connectionLifecycleCallback)
                            .addOnSuccessListener(
                                    (Void unused) -> {
                                        // We successfully requested a connection. Now both sides
                                        // must accept before the connection is established.
                                    })
                            .addOnFailureListener(
                                    (Exception e) -> {
                                        // Nearby Connections failed to request the connection.
                                    });
                }

                @Override
                public void onEndpointLost(@NonNull String s) {
                    // The endpoint discovered is lost
                }
            };

    @ReactMethod
    private void startAdvertising(final String name, final String serviceId) {
        /**
         *@name: A human readable name for the endpoint that will appear on the remote device
         *@serviceId: An identifier to advertise your app to other endpoints
         **/
        mIsAdvertising = true;
        mName = name;
        mServiceId = serviceId;
        /*
            Default strategy is P2P_Clusters. We can switch to
            another strategy using `setStrategy(STRATEGY)` method
            before build
         */
        AdvertisingOptions advertisingOptions =
                new AdvertisingOptions.Builder().build();
        Nearby.getConnectionsClient(reactContext)
                .startAdvertising(name, serviceId, connectionLifecycleCallback, advertisingOptions)
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
    private void startDiscovery(final String name, final String serviceId) {
        /**
         *@name: A human readable name for the endpoint that will appear on the remote device
         *@serviceId: An identifier to advertise your app to other endpoints
         **/
        mIsDiscovering = true;
        mName = name;
        mServiceId = serviceId;
        /*
            Default strategy is P2P_Clusters. We can switch to
            another strategy using `setStrategy(STRATEGY)` method
            before build
         */
        DiscoveryOptions discoveryOptions =
                new DiscoveryOptions.Builder().build();
        Nearby.getConnectionsClient(reactContext)
                .startDiscovery(serviceId, endpointDiscoveryCallback, discoveryOptions)
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

    // Returns `true` if advertising
    @ReactMethod
    public boolean isAdvertising() {
        return mIsAdvertising;
    }

    // Returns `true` if discovering
    @ReactMethod
    public boolean isDiscovering() {
        return mIsDiscovering;
    }

    // React-Native module name
    public String getName() {
        return "NearbyConnection";
    }
}