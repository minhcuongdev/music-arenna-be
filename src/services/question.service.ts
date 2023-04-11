import axios from "axios";
import { env } from "../configs/environments.";
import Question from "../interfaces/questions";
import Song from "../interfaces/song";
import { randomIntFromInterval, randomNumbers } from "../utils/randoms";
import PlayListService from "./playlist.service";

const QuestionService = {
  getQuestions: async () => {
    const client_id = env.CLIENT_ID;
    const client_secret = env.CLIENT_SECRET;
    const grant_type = env.GRANT_TYPE;

    const playlists = await PlayListService.getPlayLists();
    const playlist_id =
      playlists[randomIntFromInterval(0, playlists.length - 1)].id;

    const auth = await axios.post(
      env.TOKEN_URL,
      { grant_type, client_id, client_secret },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = auth.data.access_token;
    const token_type = auth.data.token_type;

    const response = await axios.get(env.PLAYLIST_URL + playlist_id, {
      headers: {
        Authorization: token_type + " " + token,
      },
    });

    const songs: Song[] = response.data.tracks.items;
    let songsIndex = [...Array(songs.length).keys()];

    if (
      songsIndex.length < 4 ||
      songsIndex.every((songIndex) =>
        Boolean(!songs[songIndex].track.preview_url)
      )
    )
      throw Error("Not enough songs");

    const questions: Question[] = [];

    let randomSongsIndex: number[] = [];

    while (
      !(
        songsIndex.length < 4 ||
        songsIndex.every((songIndex) =>
          Boolean(!songs[songIndex].track.preview_url)
        )
      )
    ) {
      do {
        const randomSongsIndexIndex = randomNumbers(
          4,
          0,
          songsIndex.length - 1
        );
        randomSongsIndex = [
          songsIndex[randomSongsIndexIndex[0]],
          songsIndex[randomSongsIndexIndex[1]],
          songsIndex[randomSongsIndexIndex[2]],
          songsIndex[randomSongsIndexIndex[3]],
        ];
      } while (
        !randomSongsIndex.some((randomSongIndex) =>
          Boolean(songs[randomSongIndex].track.preview_url)
        )
      );

      const answers = [
        songs[randomSongsIndex[0]].track.name,
        songs[randomSongsIndex[1]].track.name,
        songs[randomSongsIndex[2]].track.name,
        songs[randomSongsIndex[3]].track.name,
      ];

      let questionIndex = 0;
      do {
        questionIndex = randomSongsIndex[randomIntFromInterval(0, 3)];
      } while (!songs[questionIndex].track.preview_url);

      songsIndex = songsIndex.filter(
        (songIndex) => !randomSongsIndex.includes(songIndex)
      );

      const question: Question = {
        url: songs[questionIndex].track.preview_url || "",
        answers: answers,
        correctAnswer: songs[questionIndex].track.name || "",
      };

      questions.push(question);
    }

    return questions;
  },
};

export default QuestionService;
