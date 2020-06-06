import React from 'react'
import PropTypes from 'prop-types'
import { Audio } from 'expo-av'
import {
  View,
} from 'react-native'

const TEN_SECONDS = 10000
const PROGRESS_UPDATE_INTERVAL = 1000

export default class AudioTrackComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      soundObject0PercentRemaining: 1,
      soundObject1PercentRemaining: 0,
      isFadingIndex: -1,
      isInitialized: false,
    }
    this.soundObject = null
    this.soundObject2 = null
  }

  async componentDidMount() {
    console.log("MOUNTING")
    const { props } = this
    const { source } = props

    this.soundObject = new Audio.Sound()
    await this.soundObject.loadAsync(source, {
      positionMillis: 0,
      shouldPlay: false,
      volume: 1,
      progressUpdateIntervalMillis: PROGRESS_UPDATE_INTERVAL,
      isLooping: false,
    })
    this.soundObject.setOnPlaybackStatusUpdate(this.playbackStatusUpdate0)
    this.soundObject2 = new Audio.Sound()
    await this.soundObject2.loadAsync(source, {
      positionMillis: 0,
      shouldPlay: false,
      volume: 1,
      progressUpdateIntervalMillis: PROGRESS_UPDATE_INTERVAL,
      isLooping: false,
    })
    this.soundObject2.setOnPlaybackStatusUpdate(this.playbackStatusUpdate1)

    await this.soundObject.playAsync()
    this.setState({
      isInitialized: true,
    })
  }

  playbackStatusUpdate0 = (playbackStatus) => {
    console.log("playbackStatusUpdate0")
    const {
      isPlaying,
      didJustFinish,
      positionMillis,
      durationMillis,
    } = playbackStatus
    if (didJustFinish) {
      console.log('sound0 didJustFinish')
      console.log(this.soundObject.setPositionAsync)
      this.soundObject.setPositionAsync(0)
      this.setState({
        soundObject0PercentRemaining: 0,
        soundObject1PercentRemaining: 1,
        isFadingIndex : -1,
      })
      console.log('sound0 END didJustFinish')
      return
    }
    if (!isPlaying) {
      console.log('sound0 is not playing')
      return
    }
    console.log(`sound0duration:${durationMillis} position:${positionMillis} remaining:${durationMillis - positionMillis}`)
    const isNearEnd = (durationMillis - positionMillis) < TEN_SECONDS
    if (isNearEnd) {
      console.log("Sound 0 is near end")
      const percentRemaining = (durationMillis - positionMillis) / TEN_SECONDS
      const adjustedPercentRemaining = percentRemaining < 0.01 ? 0 : percentRemaining
      const isFadingIndex = adjustedPercentRemaining === 0 ? -1 : 0
      const stateToSet = {
        soundObject0PercentRemaining: adjustedPercentRemaining,
        soundObject1PercentRemaining: 1 - adjustedPercentRemaining,
        isFadingIndex,
      }
      this.setState(stateToSet)
    }
  }

  playbackStatusUpdate1 = (playbackStatus) => {
    console.log("playbackStatusUpdate1")
    const {
      positionMillis,
      durationMillis,
      isPlaying,
      didJustFinish,
    } = playbackStatus
    if (didJustFinish) {
      console.log('sound1 didJustFinish')
      console.log(this.soundObject2.setPositionAsync)
      this.soundObject2.setPositionAsync(0)
      this.setState({
        soundObject0PercentRemaining: 1,
        soundObject1PercentRemaining: 0,
        isFadingIndex : -1,
      })
      return
    }
    if (!isPlaying) {
      console.log('sound1 is not playing')
      return
    }
    console.log(`sound1duration:${durationMillis} position:${positionMillis} remaining:${durationMillis - positionMillis}`)
    const isNearEnd = (durationMillis - positionMillis) < TEN_SECONDS
    if (isNearEnd) {
      console.log("isNearEnd")
      const percentRemaining = (durationMillis - positionMillis) / TEN_SECONDS
      const adjustedPercentRemaining = percentRemaining < 0.01 ? 0 : percentRemaining
      const isFadingIndex = adjustedPercentRemaining === 0 ? -1 : 1
      const stateToSet = {
        soundObject1PercentRemaining: adjustedPercentRemaining,
        soundObject0PercentRemaining: 1 - adjustedPercentRemaining,
        isFadingIndex,
      }
      this.setState(stateToSet)
    }
  }

  async setVolume(volume) {
    console.log("SETVOLUME")
    const { state, soundObject, soundObject2 } = this
    const { isFadingIndex } = state
    let { soundObject0PercentRemaining, soundObject1PercentRemaining } = state

    console.log(`settingVolume isFadingIndex:${isFadingIndex}`)

    if (isFadingIndex === 0) {
      console.log("IsfadingIndex = 0 ABOUT TO PLAY OBJECT 2")
      await soundObject2.playAsync()
      soundObject1PercentRemaining = 1 - soundObject0PercentRemaining
    } else if (isFadingIndex === 1) {
      console.log("IsfadingIndex = 1 ABOUT TO PLAY OBJECT 1")
      await soundObject.playAsync()
      soundObject0PercentRemaining = 1 - soundObject1PercentRemaining
    }

    const so0AdjustedVolume = volume * soundObject0PercentRemaining
    const so1AdjustedVolume = volume * soundObject1PercentRemaining

    console.log(`isFadingIndex:${isFadingIndex}, s0:${so0AdjustedVolume}, s1:${so1AdjustedVolume}`)

    soundObject.setVolumeAsync(so0AdjustedVolume)
    soundObject2.setVolumeAsync(so1AdjustedVolume)
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
