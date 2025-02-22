import React, { Component } from 'react';
import './App.scss';
import Participant from './Participant';

const { connect } = require('twilio-video');

class Room extends Component {
    constructor(props) {
        super(props);

        this.state = {
            remoteParticipants: Array.from(this.props.room.participants.values())
        }

        this.leaveRoom = this.leaveRoom.bind(this);
    }


    componentDidMount() {
        // Add event listeners for future remote participants coming or going
        this.props.room.on('participantConnected', participant => this.addParticipant(participant));
        this.props.room.on('participantDisconnected', participant => this.removeParticipant(participant));

        window.addEventListener("beforeunload", this.leaveRoom);
    }

    componentWillUnmount() {
        this.leaveRoom();
    }

    addParticipant(participant) {
        console.log(`${participant.identity} has joined the room.`);

        this.setState({
            remoteParticipants: [...this.state.remoteParticipants, participant]
        });
    }

    removeParticipant(participant) {
        console.log(`${participant.identity} has left the room`);

        this.setState({
            remoteParticipants: this.state.remoteParticipants.filter(p => p.identity !== participant.identity)
        });
    }

    leaveRoom() {
        this.props.room.disconnect();
        this.props.returnToLobby();
    }

    render() {
        return (
            <div className="room">
                <div className="participants">
                    <Participant key={this.props.room.localParticipant.identity} localParticipant="true" participant={this.props.room.localParticipant} />
                    {
                        this.state.remoteParticipants.map(participant =>
                            <Participant key={participant.identity} participant={participant} />
                        )
                    }
                </div>
                <button id="leaveRoom" onClick={this.leaveRoom}>Leave Room</button>
            </div>
        );
    }
}

export default Room;
