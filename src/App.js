import './App.css';
import * as React from "react";
import {BrowserRouter} from "react-router-dom";
import {Redirect, Route} from "react-router";
import Cookies from "universal-cookie/lib";

import NavigationBar from "./NavigationBar";
import NewMessage from "./NewMessage";
import ReceivedMessagesPage from "./ReceivedMessagesPage";
import LoginPage from "./LoginPage";

class App extends React.Component {
    state = {
        isLoggedIn: false,
        token : ""
    }

    componentWillMount() {
        const cookies = new Cookies();
        if (cookies.get("myWebsiteToken")) {
            this.setState({
                isLoggedIn: true,
            })
        }
    }

    addToken = (token) => {
        const cookies = new Cookies();
        cookies.set("myWebsiteToken", token);
        if (cookies.get("myWebsiteToken")) {
            this.setState({
                isLoggedIn: true
            })
        }
    }

    removeToken = () => {
        const cookies = new Cookies();
        cookies.remove("myWebsiteToken");
        this.setState({
            isLoggedIn: false
        })
    }

    render() {
        return (
            <div>
                <BrowserRouter>
                    {
                        this.state.isLoggedIn ?
                            <div className={"PageContainer"}>
                                <NavigationBar removeTokenFromApp={this.removeToken}/>
                                <Redirect to={"/receivedMessages"} />
                                <Route path={"/receivedMessages"} component={ReceivedMessagesPage} exact={true}/>
                                <Route path={"/newMessage"} component={NewMessage} exact={true}/>
                            </div>
                            :
                            <div className={"PageContainer"}>
                                <Redirect to={"/"}/>
                                <Route path={"/"} render={() => <LoginPage addTokenToApp={this.addToken}/>} exact={true}/>
                            </div>
                    }
                </BrowserRouter>
            </div>
        );
    }

}

export default App;
