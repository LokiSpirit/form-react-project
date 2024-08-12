import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Main from './components/Main';
import UncontrolledElementsForm from './components/UncontrolledElementsForm';
import ReactHookForm from './components/ReactHookForm';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Main />}></Route>
      <Route path="form" element={<UncontrolledElementsForm />}></Route>
      <Route path="rform" element={<ReactHookForm />}></Route>
    </Route>,
  ),
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
