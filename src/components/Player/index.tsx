import { useContext, useEffect, useRef, useState } from 'react';
import { PlayerContext, usePlayer } from '../../contexts/playerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import Image from 'next/image';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player(){
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0)

  const {episodeList, currentEpisodeIndex,toggleShuffle, isShuffling, clearPlayerState, isPlaying,toggleLoop, togglePlay, setPlayingState, playNext, playPrevious, hasNext, hasPrevious, isLooping} = usePlayer();

  useEffect(() => {
    if(!audioRef.current){
     return;
    }
    if(isPlaying){
      audioRef.current.play();
    }else{
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressListener(){
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', event => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleEpisodeEnded(){
    if(hasNext){
      playNext();
    }else{
      clearPlayerState();
    }
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora {episode?.title}</strong>
      </header>
      {episode ?(
        <div className={styles.currentEpisode}>
          <Image width={592} height={592} src={episode.thumbnail} objectFit="cover"/>
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>

      ):(
      <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
      )}

      <footer className={episode ? "" : styles.empty}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? <Slider onChange={handleSeek} max={episode.duration} value={progress} trackStyle={{backgroundColor: "#04d361"}} railStyle={{backgroundColor: "#9f75ff"}} handleStyle={{borderColor: "#04d361", borderWidth: 4}} /> 
            :
            <div className={styles.emptySlider} />}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>
        {episode && (
          <audio src={episode.url} ref={audioRef} autoPlay loop={isLooping} onEnded={handleEpisodeEnded} onPlay={() => setPlayingState(true)} onLoadedMetadata={setupProgressListener } onPause={() => setPlayingState(false)}/>

        )}
        <div className={styles.buttons}>
          <button type="button" className={isShuffling ? styles.isActive : ''} onClick={toggleShuffle} disabled={!episode || episodeList.length === 1}>
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>
            <img src={isPlaying ? "/pause.svg" :"/play.svg"} alt="Tocar"/>
          </button>
          <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima"/>
          </button>
          <button type="button" onClick={toggleLoop} className={isLooping ? styles.isActive : ""} disabled={!episode}>
            <img src="/repeat.svg" alt="repetir"/>
          </button>
        </div>
      </footer>
    </div>
  );
}