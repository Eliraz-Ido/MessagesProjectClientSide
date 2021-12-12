import React from "react";

function MessageComponent(props){
    return (
        <div className={"message"} id={props.message.id} >
            Title: {props.message.title} <br/>
            Content: {props.message.content} <br/>
            Sender Phone Number: {props.message.senderName} <br/>
            Did I read the message: {props.message.messageWasRead.toString()} <br/>
            Sent date: {props.message.date} <br/>
            <button onClick={() =>{props.delete(props.message.id)}}>Delete</button>
            <button onClick={() =>{props.readMessage(props.message.id)}}
                    disabled={props.message.messageWasRead.toString() === "true"}>Read</button>
        </div>
    );
}
export default MessageComponent;