import React, { Component } from 'react';
import { StyleSheet, Text, View, StatusBar, Alert, TouchableOpacity } from 'react-native';
import Constants from './Constants';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import Santa from './Santa.js';
import Physics from './Physics.js';
import Wall from './Wall.js';


export default class App extends Component {
    constructor(props){
      super(props);
      this.GameEngine = null;
      this.entities = this.setupWorld();  
    }
  
    setupWorld = () => {
      let engine = Matter.Engine.create({ enableSleeping: false });
      let world = engine.world;

      let santa = Matter.Bodies.rectangle(Constants.MAX_WIDTH / 4, Constants.MAX_HEIGHT / 2, 50, 50);
      let floor = Matter.Bodies.rectangle( Constants.MAX_WIDTH / 2, Constants.MAX_HEIGHT - 25, Constants.MAX_WIDTH, 50, { isStatic: true });
      let ceiling = Matter.Bodies.rectangle( Constants.MAX_WIDTH / 2, 25, Constants.MAX_WIDTH, 50, { isStatic: true });

      Matter.World.add(world, [santa, floor]);

      return {
        physics: {engine: engine, world: world },
        santa: { body: santa, size: [50, 50], color: 'red', renderer: Santa },
        floor: { body: floor, size: [Constants.MAX_WIDTH, 50], color: 'green', renderer: Wall },
        ceiling: { body: ceiling, size: [Constants.MAX_WIDTH, 50], color: 'green', renderer: Wall }
      }
    }
  
  render() {
  return (
    <View style={styles.container}>
      <GameEngine
          ref={(ref) => { this.GameEngine = ref; }}
          style={styles.gameContainer}
          systems={[Physics]}
          entities={this.entities} />

    </View>
  )
}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    
  }
});
