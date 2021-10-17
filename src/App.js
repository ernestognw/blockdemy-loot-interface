import Main from "./components/main";

function App() {
  return (
    <div className="container">
      {window.ethereum ? <Main /> : <p>Instala Metamask</p>}
    </div>
  );
}

export default App;
