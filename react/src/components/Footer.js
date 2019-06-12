class Footer extends React.Component {
    render() {
        let test = this.props.name = 'cool' ? <b>{this.props.name}</b> : this.props.name;
        
        return <footer>
            
            Mein Footer ist ...{this.props.name}
        </footer>
    }
}