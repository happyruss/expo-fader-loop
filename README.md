# expo-fader-loop
Unfortunately, finding a true seamless/gapless loop can only be seen in Android using an in-memory buffer. This is illustrated in the Breathwork project for android

In this case, I am using a "crossfader" to fade the loop out and in upon itself. This is not perfect (yet), but the isLooping feature provided by the AVPlayers for Android and Apple is worse because of the gap. 

This is an Illustration of an attempt to seamlessly loop an mp3 using the expo-av library..

Currently, it works "eh... ok" for iOS, and not really at all for Android. Any help appreciated, this could help anyone wanting to do seamless or gapless loops using react-native/expo.

# getting started
```
npm install --global expo-cli
npm install
expo start
```
Connect from a phone on same wifi with the expo app for that platform
