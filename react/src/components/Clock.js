class Clock extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            jetzt : new Date()
        },
        setInterval(() => this.tick(), 1000)
    }

    tick() {
        this.setState({
            jetzt:new Date()
        })
    }
    render() {
        return <div id="clock">
            Es ist {this.state.jetzt.toLocaleTimeString()}
        </div>
    }
}