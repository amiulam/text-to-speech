import LoginPage from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";

function App() {
  // useEffect(() => {
  //   loadConversions();
  // }, []);

  // const loadConversions = async () => {
  //   try {
  //     const data = await getConversions();
  //     setHistory(data);
  //   } catch (err) {
  //     setError("Failed to load conversion history");
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );

  // return !accessToken ? (
  //   <LoginPage onLoginSuccess={(token) => setAccessToken(token)} />
  // ) : (
  //   <div className="min-h-screen bg-background p-8">
  //     <div className="mx-auto max-w-6xl space-y-8">
  //       <h1 className="text-4xl font-bold text-center mb-8">
  //         Text to Speech Converter
  //       </h1>
  //       {error && (
  //         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
  //           {error}
  //         </div>
  //       )}
  //       <div className="grid gap-8 md:grid-cols-2">
  //         <TextToSpeechForm onSave={handleSave} />
  //         <ConversionHistoryList onReplay={handleReplay} />
  //       </div>
  //     </div>
  //   </div>
  // );
}

export default App;
