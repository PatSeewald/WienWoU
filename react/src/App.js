class App extends React.Component {
    render() {
        return <div id="app">            
            <h1>Hello, ich bin die APP!</h1>
            <Clock />

            Wollen Sie Newsletter <Toggle />
            <Footer name="sehr"/>
            <Footer name="cool"/>
        </div>
        
    }
}

ReactDOM
    .render(
        <App />,
        document.getElementById('react')
    )