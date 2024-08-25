import './App.css'

function App() {
  return(
    <BrowserRouter>
      <Navbar>
        <Routes>
          <Route path="/" element={<Home/>}/>
          {/* <Route path="/add" element={<Add/>}/> */}
        </Routes>
      </Navbar>
    </BrowserRouter>
  );
}

export default App
