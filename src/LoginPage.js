import './App.css';
import React from "react";
import axios from "axios"
let enterCode = 13;
class LoginPage extends React.Component {
    state = {
        isLoginMode: true,
        username: "",
        password: "",
        errorMessage: "",
        usernameIsTaken: false,
        message: "",
        validUsername: true,
        validPassword: true
    }

    componentDidMount() {
        document.getElementById("username").focus();
        document.getElementById("loginButton").style.background = "#00ddff";
        document.getElementById("signupButton").style.background = "transparent";
        document.getElementById("inputAndButtonsContainer").style.borderRadius = "10px 10px 10px 0";
    }
   focusNext = (event) => {
        if(event.keyCode === enterCode && event.target.id === "username"){
            document.getElementById("password").focus()
        }
        if(event.keyCode === enterCode && event.target.id === "password"){
            if(this.state.isLoginMode){
                this.login()
            }
            else {
                this.createAccount()
            }
        }
   }


    change = (e) => {
        this.setState({
            [e.target.id]: e.target.value,
            errorMessage: "",
            message: ""
        })
    }

    changeMode = (event) => {
        if (this.state.isLoginMode) {
            if (event.target.id === "loginButton")
                this.login()
            if (event.target.id === "signupButton") {
                this.setState({
                    isLoginMode: false
                })
                document.getElementById("signupButton").style.background = "#00ddff";
                document.getElementById("loginButton").style.background = "transparent";
                document.getElementById("inputAndButtonsContainer").style.borderRadius = "10px 10px 0 10px";

            }
        } else {
            if (event.target.id === "loginButton") {
                this.setState({
                    isLoginMode: true
                })
                document.getElementById("loginButton").style.background = "#00ddff";
                document.getElementById("signupButton").style.background = "transparent";
                document.getElementById("inputAndButtonsContainer").style.borderRadius = "10px 10px 10px 0";
            }
            if (event.target.id === "signupButton")
                this.createAccount()
        }
    }

    cleanPage = () => {
        if(!this.state.isLoginMode){
            document.getElementById("username").focus();

        }
        this.setState({
            username: "",
            password: "",
            errorMessage: "",
            usernameIsTaken: false,
            message: "",
            validUsername: true,
            validPassword: true
        })
    }


    login = () => {
        axios.get("http://localhost:8989/sign-in", {
            params: {
                username: this.state.username,
                password: this.state.password
            }
        })
            .then((response) => {
                if (response.data) {                                       //Sign In was successful
                    this.props.addTokenToApp(response.data)
                }
                else {
                    axios.get("http://localhost:8989/is-blocked", {      //Could not sigh in
                        params: {
                            username: this.state.username
                        }
                    })
                        .then((response) => {
                            if (response.data) {                        //Could not sigh in because the account is blocked
                                this.setState({
                                    errorMessage: this.state.username + " account is blocked! Please contact manager",
                                })
                            }
                            else {
                                //Account is not blocked
                                axios.get("http://localhost:8989/is-username-taken", {
                                    params: {
                                        username: this.state.username
                                    }
                                })
                                    .then((response) => {
                                        if (response.data) {             //Could not sigh in because of wrong password
                                            this.setState({
                                                errorMessage: "Wrong Password",
                                                password: "",
                                            })
                                        }
                                        else {
                                            this.setState({    //Could not sigh in because user does not exist
                                                username: "",
                                                password: "",
                                                errorMessage: "That Username Does Not Exists! Try Again Or Click The Sign Up Button",
                                            })
                                        }
                                    })
                            }
                        })
                    setTimeout(() => {
                        this.cleanPage()
                    }, 5000)    //When Could not Sigh in clean the page after 5 sec
                }
            })
    }

    createAccount = () => {
        let phoneRegex = new RegExp(/[0][5][023458]\d{7}/);
        const isPhoneValid = phoneRegex.test(this.state.username) && this.state.username.length === 10;
        const isPasswordValid = (/[a-zA-Z]/g.test(this.state.password) &&
            /\d/g.test(this.state.password) && 6 <= this.state.password.length);
        if (isPhoneValid) {
            this.setState({
                validUsername: true
            })
        }else {
            this.setState({
                validUsername: false
            })
        }

        if (isPasswordValid) {
            this.setState({
                validPassword: true
            })
        }else {
            this.setState({
                validPassword: false
            })
        }
        if(isPhoneValid){
            axios.get("http://localhost:8989/is-username-taken", {
                params: {
                    username: this.state.username
                }
            })
                .then((response) => {
                    if (response.data) {
                        this.setState({
                            username: "",
                            password: "",
                            usernameIsTaken: true,
                            validPassword:true,
                            errorMessage: "This user is Taken! Please try another one"
                        })
                    }
                })
        }


        if (isPhoneValid && isPasswordValid) {
            axios.get("http://localhost:8989/create-account", {
                params: {
                    username: this.state.username,
                    password: this.state.password
                }
            })
                .then((response) => {
                    if (response.data) {
                        this.setState({
                            username: "",
                            password: "",
                            usernameIsTaken: false,
                            message: "Created Account successfully:) Now Login!"
                        })
                    }
                })
        }
        setTimeout(this.cleanPage, 4000)
    }

    render() {
        return (
            <div>
                <div id={"inputAndButtonsContainer"}>
                    <input id={"username"}
                           placeholder={"Enter Username"}
                           onChange={this.change}
                           value={this.state.username}
                           onKeyDown={this.focusNext}/><br/>
                    <input id={"password"}
                           type={"password"}
                           placeholder={"Enter Password"}
                           onChange={this.change}
                           value={this.state.password}
                           onKeyDown={this.focusNext}/><br/>
                </div>
                <button
                    className={"Mode"}
                    id={"loginButton"}
                    onClick={this.changeMode}> Login </button>
                <button
                    className={"Mode"}
                    id={"signupButton"}
                    onClick={this.changeMode} > Signup </button>
                <br/><br/>
                <div id={"message"}>{this.state.message}</div>
                {
                    this.state.errorMessage !== "" && <div className={"errorMessage"}>{this.state.errorMessage}</div>
                }
                {
                    !this.state.validUsername &&
                    <div className={"errorMessage"}> The username you entered is invalid.<br/>
                        Make sure it is an Israeli valid phone number</div>
                }
                {
                    !this.state.validPassword &&
                    <div className={"errorMessage"}> The password you entered is invalid. <br/>
                        Make sure it has at least 1 English letter(lower or upper case),<br/>
                        1 number and it has at least 6 letters</div>
                }

            </div>
        );
    }

}

export default LoginPage;