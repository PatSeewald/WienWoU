class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNewsletter:true
        }
        this.clicker = this.clickerFunc.bind(this);
    }
    clickerFunc() {
        this.setState(state => ({
            isNewsletter : !state.isNewsletter
        }))
    }
    render() {
        return <button onClick={this.clicker}>
            {this.state.isNewsletter ? 'Ja':'Nein'}
        </button>
    }
}