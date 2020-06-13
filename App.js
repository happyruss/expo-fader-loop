import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AudioTrackComponent from "./AudioTrackComponent";

export default function App() {
  return (
    <View style={styles.container}>
      <AudioTrackComponent
        keyPrefix={"test"}
        source={require('./assets/noise30.mp3') }
        isPlaying={true}
        volume={1}
        clipLengthSeconds={30}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
