import React , {Component} from 'react';
import Logo from './components/Logo/Logo';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';



const apiUrl= process.env.REACT_APP_API_URL;



// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id

const initState={
  input: '',
      imageUrl:'',
      box : {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries : 0 ,
        joined : ''
      }
}


class App extends Component {
  constructor(){
    super();
    this.state = initState
  }
  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries : data.entries ,
      joined : data.joined
    }})
  }

  
  
  

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  
  onSubmit = () => {
    
    this.setState({imageUrl: this.state.input});
    
    fetch(`${apiUrl}/faced`,{
      method: 'post',
      headers : {'Content-Type': 'application/json'},
      body: JSON.stringify({
        input: this.state.input
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result) 
    
      

        const regions = result.outputs[0].data.regions;

        if (result){
          fetch(`${apiUrl}/image`,{
            method: 'put',
            headers : {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response=> response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user,{entries:count}) )

          })
          .catch(console.log)
          
        }
       
         

        regions.forEach(region => {
            // Accessing and rounding the bounding box values
            /*const boundingBox = region.region_info.bounding_box;
            const topRow = boundingBox.top_row.toFixed(3);
            const leftCol = boundingBox.left_col.toFixed(3);
            const bottomRow = boundingBox.bottom_row.toFixed(3);
            const rightCol = boundingBox.right_col.toFixed(3);

            region.data.concepts.forEach(concept => {
                // Accessing and rounding the concept value
                const name = concept.name;
                const value = concept.value.toFixed(4);

                console.log(`${name}: ${value} BBox: ${topRow}, ${leftCol}, ${bottomRow}, ${rightCol}`);
                
            });*/
            const calculateFaceLocation = (data) =>{
              const image = document.getElementById('inputimage');
              const width = Number(image.width);
              const height = Number(image.height);
              const bb = data.region_info.bounding_box;
             
              return{
               topRow : bb.top_row * height ,
               leftCol : bb.left_col * width ,
               bottomRow : height -  (bb.bottom_row * height),
               rightCol : width-(bb.right_col*width),
           
              }
           
             }
             const displayFaceBox  = (box) => {
               this.setState({box : box});
             }
             displayFaceBox(calculateFaceLocation(region));
        });

    })
    .catch(error => console.log('error', error));
  }
 onRouteChange = (route) => {
  if(route==='signout'){
    this.setState(initState)
  }else if(route==='home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route: route})
 }

  render(){
    const {isSignedIn, imageUrl, route , box } = this.state; 
  return (
    <div className="App">
      <ParticlesBg className="particles" color="#FFFFFF" type="cobweb" num={120} bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      { route === 'home' 
        ?  <div>
                <Logo/> 
                <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                <ImageLinkForm 
                onInputChange={this.onInputChange}
                onSubmit={this.onSubmit}/>
                <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
            : (
              route === 'signin' ?
              <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
              :  <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        } 
     
    </div>
  );
}
}

export default App;
