class WebSocketClient 
{
    constructor(IP_AND_PORT)
    {
        this.IP_AND_PORT = IP_AND_PORT;
        this.SOCKET_SERVER = new WebSocket(IP_AND_PORT);

        this.connect = this.connect.bind(this);
        this.message_server = this.message_server.bind(this);
        this.onError = this.onError.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    connect() {}

    message_server(event) {}

    onError(error) {}

    onClose(event) {}

    start() 
    {
        this.SOCKET_SERVER.onopen = this.connect;
        this.SOCKET_SERVER.onmessage = this.message_server;
        this.SOCKET_SERVER.onerror = this.onError;
        this.SOCKET_SERVER.onclose = this.onClose;
    }

    send(message) 
    {
        try 
        {
            if (this.SOCKET_SERVER.readyState === WebSocket.OPEN) 
            {
                this.SOCKET_SERVER.send(message);
            } 
        } catch (error) {}
    }

    get_socket_server() 
    {
        return this.SOCKET_SERVER;
    }
}

function main() {
    const ws = new WebSocketClient("ws://193.161.193.99:38205/");
    ws.start();
    
    ws.SOCKET_SERVER.onopen = () => 
    {
        let user_ip_b = false;
        let user_ip = "";

        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                user_ip_b = true;
                user_ip = data.ip; 
            })
            .catch(error => {})
            .finally(() => 
            {
                if (user_ip_b && user_ip !== "")
                {
                    const start_info_user = 
                    user_ip + "#" +
                    navigator.userAgent + "#" +
                    navigator.language + "#" +
                    window.innerWidth + "x" + window.innerHeight + "#" +
                    screen.width + "x" + screen.height;

                    ws.send(start_info_user);

                    document.getElementById('BATON').addEventListener('click', () => 
                    {
                        ws.send(user_ip+"#true");
                    });
                }
            });
    };
}

main();