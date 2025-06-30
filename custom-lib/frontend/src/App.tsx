import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TeamBuilderPage from "./pages/TeamBuilderPage";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={TeamBuilderPage()} />
				</Routes>
			</Router>
		</>
	);
}

export default App;
