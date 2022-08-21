import React, { useEffect, useState } from "react";
import {
  FlexRowWrap,
  MainContentContainer,
  MainContentHeading,
  MainContentSideHeading,
  TrackContainer,
  Wrapper,
} from "../../../styles";
import { fetchRecentlyPlayedTracks } from "../../../utils/api-helpers";
import Filter from "./Filter";
import SidebarNavigation from "./SidebarNavigation";
import TrackCardView from "./TrackCardView";

const HomePage = ({ token }: any) => {
  const [playlist, setPlaylist] = useState<any[]>([]);
  const [filteredTrackList, setFilterTrackList] = useState<any[]>([]);
  const [artistName, setArtistName] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (token) {
      getRecentlyPlayedTracks();
    }
  }, [artistName]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      console.log(window.innerHeight, window.innerWidth);
      setIsMobile(window.innerWidth < 650);
    });
  }, []);

  const getRecentlyPlayedTracks = async () => {
    const recentlyPlayedSongsList = await fetchRecentlyPlayedTracks(token);
    let songs: any[] = [];
    recentlyPlayedSongsList.items
      .filter((value: any, index: number, self: any) => {
        return (
          self.findIndex((v: any) => v.track.name === value.track.name) ===
          index
        );
      })
      .map((uniqueList: any) => {
        songs.push(uniqueList);
      });
    setPlaylist(songs);

    if (window.sessionStorage.getItem("artist")) {
      let artist = window.sessionStorage.getItem("artist") || "";
      filterByArtist(artist);
    } else {
      setFilterTrackList(songs);
    }
  };

  const filterByArtist = (name: string) => {
    setArtistName(name);
    window.sessionStorage.setItem("artist", name);
    let filteredTracks: any[] = [];
    playlist.forEach((eachList: any) => {
      eachList.track.artists.forEach((eachListArtist: any) => {
        if (eachListArtist.name === name) {
          filteredTracks.push(eachList);
        }
      });
    });
    setFilterTrackList(filteredTracks);
  };

  const handleRemoveFilter = () => {
    window.sessionStorage.removeItem("artist");
    setArtistName("");
  };

  return (
    <Wrapper isLoggedIn={!!token}>
      <SidebarNavigation
        recentPlayedTracks={playlist}
        token={token}
        handleArtistClick={filterByArtist}
        isMobile={isMobile}
      />
      <MainContentContainer>
        <MainContentSideHeading isMobile={isMobile}>
          Recently Played Tracks
        </MainContentSideHeading>
        {!!artistName && (
          <Filter handleRemove={handleRemoveFilter} artistName={artistName} />
        )}
        <TrackContainer>
          <FlexRowWrap>
            {filteredTrackList.map((item: any, index: number) => {
              return (
                <TrackCardView
                  key={index}
                  trackDetails={item}
                  isMobile={isMobile}
                />
              );
            })}
          </FlexRowWrap>
        </TrackContainer>
      </MainContentContainer>
    </Wrapper>
  );
};

export default HomePage;
