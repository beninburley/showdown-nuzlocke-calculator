import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeamBuilderPage from "./pages/TeamBuilder";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/teambuilder" element={TeamBuilderPage()} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
