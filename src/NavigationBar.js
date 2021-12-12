import './App.css';
import React from "react";
import {NavLink} from "react-router-dom";


class NavigationBar extends React.Component {
    state = {
        links: [
            { title: "Received", path: "/receivedMessages" },
            { title: "New Message", path: "/newMessage" }
        ]
    }


    render() {
        return (
            <div id={"NavigationBar"}>
                {
                    this.state.links.map(link => {
                        return (
                            <NavLink to={link.path} className={"link"} activeClassName={"active"}>
                                <div className={"linkText"}>
                                    {link.title}
                                </div>
                            </NavLink>
                        );
                    })
                }
                <div className={"link"}>
                    <div className={"linkText"} onClick={this.props.removeTokenFromApp}> Log Out </div>
                </div>
            </div>
        );
    }
}


export default NavigationBar;
