import './App.scss';
import React, { Component } from 'react';
import Room from './Room';

const { connect } = require('twilio-video');

const accessTokenServerUrl = "https://token-service-7241-dev.twil.io/token"

const dummySessionId = "bc735560-b793-4b84-a1ba-f999614b1c80"

class App extends Component {
    constructor(props) {
        super(props)

        this.state = {
            identity: '',
            room: null
        }

        this.inputRef = React.createRef();

        this.joinRoom = this.joinRoom.bind(this);
        this.returnToLobby = this.returnToLobby.bind(this);
        this.updateIdentity = this.updateIdentity.bind(this);
        this.removePlaceholderText = this.removePlaceholderText.bind(this);

    }

    async joinRoom() {
        try {
            const response = await fetch(`${accessTokenServerUrl}?identity=${this.state.identity}`);
            const data = await response.json();
            const room = await connect(data.accessToken, {
                name: dummySessionId,
                audio: true,
                video: true
            });

            this.setState({ room: room });
        } catch (err) {
            console.log(err);
        }
    }

    returnToLobby() {
        this.setState({ room: null });
    }

    removePlaceholderText() {
        this.inputRef.current.placeholder = '';
    }

    updateIdentity(event) {
        this.setState({
            identity: event.target.value
        });
    }

    render() {

        const disabled = this.state.identity === '' ? true : false;

        return (
            <div className="app">
                {
                    this.state.room === null
                        ? <div className="lobby">
                            <input
                                value={this.state.identity}
                                onChange={this.updateIdentity}
                                ref={this.inputRef}
                                onClick={this.removePlaceholderText}
                                placeholder="What's your name?" />
                            <button disabled={disabled} onClick={this.joinRoom}>Join Room</button>
                        </div>
                        : <Room returnToLobby={this.returnToLobby} room={this.state.room} />
                }
            </div>
        );
    }
}

export default App;
