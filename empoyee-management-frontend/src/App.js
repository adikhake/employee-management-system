import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateEmployee from "./pages/CreateEmployee";
import SearchEmployee from "./pages/SearchEmployee";
import Profile from "./pages/Profile";

import MultipleTabs from "./pages/MultipleTabs";
import MenuPage from "./pages/MenuPage";
import Autocomplete from "./pages/AutoComplete";
import ImagesPage from "./pages/ImagesPage";
import Tooltips from "./pages/TooltipsPage";
import SliderPage from "./pages/SliderPage";
import EditEmployee from "./pages/EditEmployee";

import Layout from "./components/Layout";
import ProfileRouter from "./components/ProfileRouter";

function App() {
  const token = !!localStorage.getItem("token");

  return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Layout>
                <Home />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/employee/create"
          element={
            <PrivateRoute>
              <Layout>
                <CreateEmployee />
              </Layout>
            </PrivateRoute>
          }
        />
        
        <Route path="/employee/edit/:id" element={ <PrivateRoute><Layout><EditEmployee /></Layout></PrivateRoute> }/>

        <Route
          path="/employee/search"
          element={
            <PrivateRoute>
              <Layout>
                <SearchEmployee />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="/profile" element={
            <PrivateRoute>
              <Layout>
                <ProfileRouter />
              </Layout>
            </PrivateRoute>} />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/multiple-tabs"
          element={
            <PrivateRoute>
              <Layout>
                <MultipleTabs />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/menu"
          element={
            <PrivateRoute>
              <Layout>
                <MenuPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/autocomplete"
          element={
            <PrivateRoute>
              <Layout>
                <Autocomplete />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/images"
          element={
            <PrivateRoute>
              <Layout>
                <ImagesPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/slider"
          element={
            <PrivateRoute>
              <Layout>
                <SliderPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/tooltips"
          element={
            <PrivateRoute>
              <Layout>
                <Tooltips />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="*"
          element={token ? <Navigate to="/home" /> : <Navigate to="/login" />}
        />
      </Routes>
  );
}

export default App;
