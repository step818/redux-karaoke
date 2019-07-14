// LYRIC INFO
const songList = {
  1: "Don't want to be a fool for you, Just another player in your game for two, You may hate me but it ain't no lie, Baby bye bye bye, Bye bye, I Don't want to make it tough, I just want to tell you that I've had enough, It might sound crazy but it ain't no lie, Baby bye bye bye".split(', '),
  2: "Twenty-five years and my life is still, Trying to get up that great big hill of hope, For a destination, I realized quickly when I knew I should, That the world was made up of this brotherhood of man, For whatever that means, And so I cry sometimes when I'm lying in bed, Just to get it all out what's in my head, And I, I am feeling a little peculiar, And so I wake in the morning and I step outside, And I take a deep breath and I get real high, and I Scream from the top of my lungs, What's going on?, And I say hey yeah yeah hey yeah yeah, I said hey what's going on?, And I say hey yeah yeah hey yeah yeah,I said hey what's going on?".split(', ')
};

// INITIAL REDUX STATE
const initialState = {
  currentSongId: null,
  songsById: {
    1: {
      title: "Bye Bye Bye",
      artist: "N'Sync",
      songId: 1,
      songArray: songList[1],
      arrayPosition: 0,
    },
    2: {
      "What's Goin' On",
      artist: "Four Non-Blondes",
      songId: 2,
      songArray: songList[2],
      arrayPosition: 0,
    }
  }
};

//REDUX REDUCER
const lyricsChangeReducer = (state = initialState.songsById, action) => {
  // Declares several variables used below, without yet defining.
  let newArrayPosition;
  let newSongsByIdEntry;
  let newSongsByIdStateSlice;

  switch (action.type) {
    case 'NEXT_LYRIC':

    // Locates the arrayPosition of the song whose ID was provided
      // in the action's payload, and increments it by one:
      newArrayPosition = state[action.currentSongId].arrayPosition + 1;

    // Creates a copy of that song's entry in the songsById state slice,
    // and adds the updated newArrayPosition value we just calculated as its arrayPosition:
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: newArrayPosition
      })

    // Creates a copy of the entire songsById state slice, and adds the
      // updated newSongsById state entry we just created to this new copy:
      newSongByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongByIdEntry
      });

    // Returns the entire newSongsByIdStateSlice we just constructed, which will
    // update state in our Redux store to match this returned value:
      return newSongsByIdStateSlice;

    case 'RESTART_SONG':

    // Creates a copy of the song entry in songsById state slice whose ID matches
    // the currentSongId included with the action, sets the copy's arrayPosition value
    // to 0:
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: 0
      })

    // Creates a copy of the entire songsById state slice, and adds the
  // updated newSongsByIdEntry we just created to this copy:
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });

    // Returns the entire newSongsByIdStateSlice we just constructed, which will
    // update the songsById state slice in our Redux store to match the new slice returned:
      return newSongsByIdStateSlice;

    // If action is neither 'NEXT_LYRIC' nor 'RESTART_STATE' type, return existing state:
    default:
        return state;
  }
}

const songChangeReducer = (state = initialState.currentSongId, action) => {
  switch (action.type){
    case 'CHANGE_SONG':
      return action.newSelectedSongId;
    default:
      return state;
  }
}

// JEST TESTS + SETUP WILL GO HERE
const { expect } = window;

expect(lyricsChangeReducer(initialState.songsById, { type: null })).toEqual(initialState.songsById);

expect(lyricsChangeReducer(initialState.songsById, {type: 'NEXT_LYRIC', currentSongId: 2 })).toEqual({
  1: {
    title: "Bye Bye Bye",
    artist: "N'Sync",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: "What's Goin' On",
    artist: "Four Non-Blondes",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 1,
  }
});
expect(lyricsChangeReducer(
  initialState.songsById,
  { type: 'RESTART_SONG', currentSongId: 1 })
).toEqual({
  1: {
    title: "Bye Bye Bye",
    artist: "N'Sync",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: "What's Goin' On",
    artist: "Four Non-Blondes",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 0,
  }
});

expect(songChangeReducer(initialState, { type: null })).toEqual(initialState);

expect(songChangeReducer(initialState.currentSongId, { type: 'CHANGE_SONG', nexSelectedSongId: 1 })).toEqual(1);

// REDUX STORE
const { createStore } = Redux;
const store = createStore(lyricsChangeReducer);
console.log(store.getState());

//RENDERING STATE IN DOM
const renderLyrics = () => {
// defines a lyricsDisplay constant referring to the div with a 'lyrics' ID in index.html
  const lyricsDisplay = document.getElementById('lyrics');
// if there are already lyrics in this div, remove them one-by-one until it is empty:
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }
// Locates the song lyric at the current arrayPosition:
  const currentLine = store.getState().songLyricsArray[store.getState().arrayPosition];
// Creates DOM text node containing the song lyric identified in line above:
  const renderedLine = document.createTextNode(currentLine);
// Adds text node created in line above to 'lyrics' div in DOM
  document.getElementById('lyrics').appendChild(renderedLine);
}

// runs renderLyrics() method from above when page is finished loading.
// window.onload is HTML5 version of jQuery's $(document).ready()
window.onload = function() {
  renderLyrics();
}

// CLICK LISTENER
const userClick = () => {
  const currentState = store.getState();
  if (currentState.arrayPosition === currentState.songLyricsArray.length - 1) {
    store.dispatch({ type: 'RESTART_SONG' });
  } else {
  store.dispatch({ type: 'NEXT_LYRIC' });
  }
}

//SUBSCRIBE TO REDUX STORE
store.subscribe(renderLyrics);