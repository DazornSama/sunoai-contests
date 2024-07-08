import { useEffect, useState } from "react";
import CountryFlag from "react-country-flag";
import Markdown from "react-markdown";
import { useLoaderData } from "react-router-dom";
import CountryFlagEmoji from "../components/country-flag-emoji";
import Layout from "../shared/layout";
import { Typography } from "../utils/mui";
import {
  ContestDescription,
  Song,
  SongAuthor,
  SongCountry,
  SongCover,
  SongInfo,
  SongList,
  SongPrompt,
  SongTitle,
} from "./contest.styled";

export default function ContestView() {
  const [contest, setContest] = useState(useLoaderData());
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    if (contest) {
      document.title = contest.name;
    }

    if (songs.length === 0) {
      loadSongs();
    }
  }, [contest]);

  const loadSongs = async () => {
    setSongs(await songsLoader(contest.id));
  };

  const onSongClick = (song) => {
    window.open(`https://suno.com/song/${song.id}`);
  };

  const songsElement = songs.map((s, i) => {
    return (
      <Song key={i} onClick={(e) => onSongClick(s)}>
        <SongCover>
          <img src={s.cover} />
        </SongCover>
        <SongInfo>
          <SongTitle>
            <Typography level="title-lg">{s.title}</Typography>
          </SongTitle>
          <SongAuthor>
            <Typography level="body-md">{s.author}</Typography>
          </SongAuthor>
          <SongPrompt>
            <Typography level="body-sm">{s.prompt}</Typography>
          </SongPrompt>
        </SongInfo>
        <SongCountry>
          <CountryFlagEmoji code={s.country} iso={true} />
        </SongCountry>
      </Song>
    );
  });

  return (
    <Layout>
      <Typography level="h1">{contest.name}</Typography>
      <ContestDescription>
        <Typography level="body-sm">
          <Markdown className="markdown">
            {contest.description
              .replace(/&amp;/g, "&")
              .replace(/&lt;/g, "<")
              .replace(/&gt;/g, ">")
              .replace(/&quot;/g, '"')
              .replace(/&#39;/g, "'")}
          </Markdown>
        </Typography>
      </ContestDescription>
      <SongList>
        {songsElement.length === 0 ? (
          <div>
            <Typography level="body-sm">
              There are no songs in this contest
            </Typography>
          </div>
        ) : (
          songsElement
        )}
      </SongList>
    </Layout>
  );
}

export const contestLoader = async ({ params }) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/contest/${encodeURIComponent(params.id)}`
  );

  if (response.ok) {
    return await response.json();
  }

  return null;
};

const songsLoader = async (contestId) => {
  const response = await fetch(
    `${process.env.REACT_APP_API_URL}/contest/${encodeURIComponent(
      contestId
    )}/songs`
  );

  if (response.ok) {
    return await response.json();
  }

  return [];
};
