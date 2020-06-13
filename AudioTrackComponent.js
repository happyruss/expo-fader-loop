import React from 'react'
import PropTypes from 'prop-types'
import { Audio } from 'expo-av'
import {
  View,
} from 'react-native'

export default class AudioTrackComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isInitialized: false,
    }
    this.soundObject1 = null
    this.soundObject2 = null
  }

  async playSoundObject(soundObjectToPlay, playNext, self) {
    const clipLengthSeconds = self.props.clipLengthSeconds
    const playNextClipMilliseconds = (clipLengthSeconds * 1000) - 6000
    const resetThisClipMilliseconds = playNextClipMilliseconds + 10000
    await soundObjectToPlay.playAsync()
    setTimeout(function() {
        playNext(self)
      }, playNextClipMilliseconds
    )
    setTimeout(function() {
        soundObjectToPlay.stopAsync().then(() => {
          soundObjectToPlay.setPositionAsync(0)
        })
      }, resetThisClipMilliseconds
    )
  }

  async playSoundObject1(self) {
    const { soundObject1 } = self
    const playNext = self.playSoundObject2
    await self.playSoundObject(soundObject1, playNext, self)
  }

  async playSoundObject2(self) {
    const { soundObject2 } = self
    const playNext = self.playSoundObject1
    await self.playSoundObject(soundObject2, playNext, self)
  }

  async componentDidMount() {
    const { props } = this
    const { source } = props

    this.soundObject1 = new Audio.Sound()
    await this.soundObject1.loadAsync(source, {
      positionMillis: 0,
      shouldPlay: false,
      volume: 1,
      isLooping: false,
    })
    this.soundObject2 = new Audio.Sound()
    await this.soundObject2.loadAsync(source, {
      positionMillis: 0,
      shouldPlay: false,
      volume: 1,
      isLooping: false,
    })
    this.playSoundObject1(this)
    this.setState({
      isInitialized: true,
    })
  }

  setVolume(volume) {
    const { soundObject1, soundObject2 } = this
    soundObject1.setVolumeAsync(volume)
    soundObject2.setVolumeAsync(volume)
  }

  render() {
    const { props, state } = this
    const { isPlaying, volume } = props
    const { isInitialized } = state
    if (isInitialized) {
      if (isPlaying) {
        this.setVolume(volume)
      } else {
        this.setVolume(0)
      }
    }
    return (
      <View key={`${props.keyPrefix}_audio_container`} />
    )
  }
}

AudioTrackComponent.propTypes = {
  keyPrefix: PropTypes.string.isRequired,
  source: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  volume: PropTypes.number.isRequired,
}
