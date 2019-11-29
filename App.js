import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Alert, TouchableOpacity, Image } from 'react-native';
import Constants from './Constants';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import Santa from './Santa.js';
import Physics from './Physics.js';
import Pipe from './Pipe.js';
import Floor from './Floor';
import Images from './assets/Images';


export default class App extends Component {
    constructor(props){
      super(props);
      this.GameEngine = null;
      this.entities = this.setupWorld();
      
      this.state = {
          running: true 
      }
    }
  
    setupWorld = () => {
      let engine = Matter.Engine.create({ enableSleeping: false });
      let world = engine.world;
      world.gravity.y = 0.0;

      let santa = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT / 2, Constants.SANTA_WIDTH, Constants.SANTA_HEIGHT);
      let floor1 = Matter.Bodies.rectangle( 
          Constants.MAX_WIDTH / 2, 
          Constants.MAX_HEIGHT - 25, 
          Constants.MAX_WIDTH + 4, 
          50, 
          { isStatic: true }
      );

      let floor2 = Matter.Bodies.rectangle( 
        Constants.MAX_WIDTH + (Constants.MAX_WIDTH / 2), 
        Constants.MAX_HEIGHT - 25, 
        Constants.MAX_WIDTH + 4, 
        50, 
        { isStatic: true }
    );
      

      Matter.World.add(world, [santa, floor1, floor2]);
      Matter.Events.on(engine, "collisionStart", (event) => {
          let pairs = event.pairs; 

          this.GameEngine.dispatch({ type: "game-over"});
      });


      return {
        physics: {engine: engine, world: world },
        santa: { body: santa, renderer: Santa },
        floor1: { body: floor1, renderer: Floor }, 
        floor2: { body: floor2, renderer: Floor },
        
        

      }
    }
  
    onEvent = (e) => {
      if (e.type === "game-over") {
        this.setState({
          running: false
        })
      }
    }

    reset = () => {
      this.GameEngine.swap(this.setupWorld());
      this.setState({
          running: true
      });

    }

  render() {
  return (
    <View style={styles.container}>
      <Image source={Images.background} style={styles.backgroundImage} resizeMode="stretch" />
      <GameEngine
          ref={(ref) => { this.GameEngine = ref; }}
          style={styles.gameContainer}
          systems={[Physics]}
          running={this.state.running}
          onEvent={this.onEvent}
          entities={this.entities} >
          <StatusBar hidden={true} />
      </GameEngine>
      {!this.state.running && <TouchableOpacity onPress={this.reset} style={styles.fullScreenButton}>
          <View style={styles.fullScreen}>
              <Text style={styles.gameOverText}>Game Over</Text>
          </View>
      </TouchableOpacity>}
    </View>
  )
}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
    
  },

  backgroundImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT,
  },

  gameContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },

  fullScreenButton: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flex: 1
  },

  fullScreen: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0, 
    backgroundColor: 'red',
    opacity: 0.8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gameOverText: {
    color: 'white',
    fontSize: 48
  }
});
