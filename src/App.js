import React, { Component } from 'react';
import Particles from "react-tsparticles";
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';


const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: '' 
    }
  }

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined 
    }})
  } 

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

displayFaceBox = (box) => {
  this.setState({box: box});
}

  onInputChange = (event) => {
    this.setState({input:event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    fetch('https://radiant-brushlands-47884.herokuapp.com/imageurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
      })
      .then(response => response.json())
      .then(response => {
      if (response) {
        fetch('https://radiant-brushlands-47884.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
          id: this.state.user.id
      })
    })
      .then(response => response.json())
      .then(count => {
        this.setState(Object.assign(this.state.user, { entries: count }))
      })
      .catch(console.log)
      }
      this.displayFaceBox(this.calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
  };


onRouteChange = (route) => {
  if (route === 'signout') {
    this.setState(initialState)
  } else if (route === 'home') {
    this.setState({isSignedIn: true})
  }
  this.setState({route: route})
}

  render() {
   const { isSignedIn, imageUrl, route, box } = this.state; 
  return (
    <div className="App">
    <Particles id="tsparticles"
      options={{
        fpsLimit: 60,
        particles: {
          color: {
            value: "#fff",
          },
          links: {
            color: "#fff",
            distance: 150,
            enable: true,
            opacity: 0.7,
            width: 1,
          },
          collisions: {
            enable: true,
          },
          move: {
            direction: "none",
            enable: true,
            outMode: "bounce",
            random: false,
            speed: 0.7,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              value_area: 800,
            },
            value: 150,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "",
          },
        },
      }}
    />
      <Navigation isSignedIn={isSignedIn}onRouteChange={this.onRouteChange}/>
      { route === 'home'
      ? <div> 
          <Logo />
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}
        />
        <FaceRecognition box={box}imageUrl={imageUrl} />
     </div> 
      
      : (route === 'signin') 
      ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
      : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/> 
      }
    </div>
  );
  }
}
export default App;
