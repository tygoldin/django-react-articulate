import {TextField, Button} from "@mui/material";
import {useState} from "react";
import Cookies from "js-cookie";

export function LoginPage(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin(){
        fetch(`api/login_user/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': Cookies.get('csrftoken')
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        }).then(response => response.json()).then(data => {
                if (data) {
                    props.setAuth(data);
                }
        })
    }

    return (
        <div className="login-page">
            <div className="login_box">
                <div className="login-title">ARTiculate</div>
                <TextField
                    id="username"
                    label="Username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <TextField
                    id="password"
                    label="Password"
                    value={password}
                    type="password"
                    onChange={(event) => setPassword(event.target.value)}
                />
                <Button variant="contained"
                        onClick={handleLogin}>
                    LOGIN
                </Button>
            </div>

        </div>
    )
}