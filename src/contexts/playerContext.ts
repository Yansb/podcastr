import {createContext} from 'react';

type Episode ={
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type PlayerContextData ={
  episodeList: Episode[];
  currentEpisodeIndex: number;
  play: (episode: Episode) => void;
}

export const PlayerContext = createContext({} as PlayerContextData);