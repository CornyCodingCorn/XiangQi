import './App.css';
import Piece, { PieceType } from './gameplay/Piece';
import ImagesCollection from './resources/ImagesCollection';
import * as React from 'react';
import Board from './gameplay/Board';

const BOARD_COLOR = 0xe5bc70;
const PAD_COLOR = 0x93511f;
const LINE_COLOR = 0xe5bc70;

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
        <div>
          <Board isFlipped={false} lineThickness={4} boardColor={BOARD_COLOR} padColor={PAD_COLOR} horizontalPadding={50} verticalPadding={50} cellWidth={70} cellHeight={70}/>
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