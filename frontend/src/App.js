import './App.css';
import {RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from "./Pages/Root";
import Home from './Pages/Home/Home';
import SpecialCards from './Pages/SpecialCards/SpecialCards';

function App() {

  const router=createBrowserRouter([{
    path:"/",
    element:<Root/>,
    children:[
      {index:true,element:<Home/>},
      {path:"special-cards",element:<SpecialCards/>}
    ]
  }])  

  return (
    <>
      <RouterProvider router={router}/>
    </>
  );
}

export default App;
