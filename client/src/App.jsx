import React from 'react';
import Map from './Map';
import './app.css';
import googleTTS from 'google-tts-api';
// var audio = new Audio();
// audio.src ='https://translate.google.com/translate_tts?ie=UTF-8&q=Hello%20World&tl=en&total=1&idx=0&textlen=11&tk=407099.18136&client=t&prev=input&ttsspeed=1';
// audio.src = "./audio/en.mp3"

// Play the received speech

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isRendered: false,
      audio: "",

    }
  }
  componentWillMount(){
    console.log('hello');
  }

  componentDidMount(){
    // console.log(Flags);

  }



  render(){
    return(
      <div>
        <link rel="shortcut icon" href={require("./images/favicon.ico")} />
        <link href="https://fonts.googleapis.com/css?family=Nanum+Pen+Script|Noto+Sans" rel="stylesheet" />



        <Map />
      </div>
    )
  }
}
