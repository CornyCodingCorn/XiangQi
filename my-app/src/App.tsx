import './App.css';
import Piece, { PieceType } from './gameplay/Piece';
import ImagesCollection from './resources/ImagesCollection';
import * as React from 'react';
import Board from './gameplay/Board';

export interface IAppProps {
}

export interface IAppState {
  
}

export default class App extends React.Component<IAppProps> {
  private _isLoaded: boolean = false;
  public get isLoaded(): boolean { return this._isLoaded; }

  public render() {
    ImagesCollection.init(() => {
      this._isLoaded = true;
      this.forceUpdate();
    });

    let component: JSX.Element;
    if (this._isLoaded) {
      component = (
        <div className="App">
          <Board isFlipped={false} padColor={0x0000FFFF} horizontalPadding={50} verticalPadding={50} cellWidth={70} cellHeight={70}/>
        </div>
      );
    }
    else {
      let style: React.CSSProperties = {
        backgroundColor: 'red',
        width: 200,
        height: 200
      }

      component = (
        <div style={style}>
          
        </div>
      )
    }

    return component;
  }
}