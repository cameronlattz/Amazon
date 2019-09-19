# Amazon
LIRI is an app that will search different APIs for various types of media/events. You can search for songs, movies, or concerts.

### TODO:
* write readme
* create video

### EXAMPLES:
```
    spotify-this-song You Dont Have a Clue
    concert-this Weekend
    movie-this Brazil
```

### OVERVIEW:

The app is mainly built as a closure. Outside of the closure, it takes in the command line arguments and saves them to a variable. Inside, it imports all of the required node modules, declares all of the functions, and then finally runs the _init function (underscored variables mean that they are only available inside of the closure). The _init function calls the _commandSwitch function, which switches based on the command entered into the command line. The _commandSwitch function then branches off into different methods to make an API call. _commandSwitch and those branching methods will ultimately call _error, _output, and/or _outputEnd. These are helper functions designed to streamline the code. _outputEnd saves messages to log.txt.

### HOW TO RUN:

Run liri.js in node with the following structure:
```
    node .\liri.js <command> [value]
```
Command can be one of the following values:
```
    spotify-this-song
    concert-this
    movie-this
    do-what-it-says
```
Value is an optional parameter, but it must be specified when running concert-this.

* "spotify-this-song" will search Spotify for a song's name, artist, and album, and provide a link to the song on Spotify. If no value is specified, it will default to "Ace of Base - The Sign".
* "concert-this" will return a list of all upcoming concerts an artist is holding. It will return each venue's name, location, and date.
* "movie-this" will search for a movie on OMDB. It will show the movie's title, release year, IMDB rating, RottenTomatoes rating, release country, original language, plot, and a list of main actors. If no value is specified, it will default to "Mr. Nobody".
* "do-what-it-says" will read the "random.txt" file and run whatever command and value is specified there.

### VIDEO:
[![Video](https://img.youtube.com/vi/c_0bdsqtEvk/0.jpg)](https://www.youtube.com/watch?v=c_0bdsqtEvk)

### TECHNOLOGIES USED:
* Node
* FileSystem module
* Axios module
* Spotify module

### TEAM:
* Cameron Lattz, Developer