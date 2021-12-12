import './App.css';
import React from "react";
import Cookies from "universal-cookie/lib";
import axios from "axios";
let enterCode = 13;

class NewMessage extends React.Component {
    state = {
        token: "",
        otherUsers: [],
        wantedUser: "",
        title: "",
        content: "",
        actionMessage: ""
    }

    componentWillMount() {
        this.getUsers()
        const cookies = new Cookies();
        this.setState({
            token: cookies.get("myWebsiteToken")
        })
    }

    focusNext = (event) => {
        if (event.keyCode === enterCode && event.target.id === "title") {
            document.getElementById("content").focus();
            this.setState({
                content: ""
            });
        }
        if (event.keyCode === enterCode && event.target.id === "content") {
            this.sendMessage()
        }
    }

    getUsers = () => {
        const cookies = new Cookies();
        axios.get("http://localhost:8989/get-users", {
            params: {
                token: cookies.get("myWebsiteToken")
            }
        })
            .then((response) => {
                this.setState({
                    otherUsers: response.data
                })
            })
    }

    change = (event) => {
        this.setState({
            [event.target.id] : event.target.value
        })
    }

    sendMessage = () =>{
      axios.get("http://localhost:8989/send-message",{
          params: {
              senderToken: this.state.token ,
              receiverUsername: this.state.wantedUser,
              title: this.state.title,
              content: this.state.content
          }
      })
          .then((response) => {
              if(response.data){
                  this.setState({
                      actionMessage: "Message was sent successfully",
                      wantedUser: "",
                      title: "",
                      content: ""
                  })
              }
              else {
                  this.setState({
                      actionMessage: "Something went wrong, could not send message",
                      wantedUser: "",
                      title: "",
                      content: ""
                  })
              }
              setTimeout(this.cleanPage, 4000);
          })
    }

    cleanPage = () => {
        this.getUsers();
        this.setState({
            wantedUser: "",
            title: "",
            content: "",
            actionMessage: ""
        })
    }

    render() {
        return (
            <div>
                <div>New Message Page</div><br/>
                <div id={"newMessageContainer"}>
                Who do you want to send the new message to : <br/>
                {
                    this.state.otherUsers.length !== 0 ?
                        <select value={this.state.wantedUser}
                                id={"wantedUser"}
                                onChange={this.change}>
                            <option value={""}>Select</option>
                            {
                                this.state.otherUsers.map((user) => {
                                    return (
                                        <option className={"options"} value={user}>{user}</option>
                                    );
                                })
                            }
                        </select>
                        :
                        <div>There are no users</div>
                }
                <br/>
                <input id={"title"}
                       value={this.state.title}
                       onChange={this.change}
                       onKeyDown={this.focusNext}
                       placeholder={"Title"}/> <br/>
               <textarea id={"content"}
                                   value={this.state.content}
                                   onChange={this.change}
                                   onKeyDown={this.focusNext}
                                   placeholder={"Content"}/> <br/>
                <button disabled={
                    this.state.title === "" ||
                    this.state.content === "" ||
                    this.state.wantedUser === ""}
                        onClick={this.sendMessage} id={"sendButton"}>
                    Send
                </button>
                <div>{this.state.actionMessage}</div>
                </div>
            </div>
        );
    }
}
export default NewMessage;