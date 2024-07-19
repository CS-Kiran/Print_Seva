import { Route, Routes } from "react-router-dom"
import ShopkeeperLogin from "../components/ShopkeeperLogin"
import UserLogin from "../components/UserLogin"

const GetStartedPage = () => {
  return (
    <>
    <Routes>
        <Route path="/shopkeeper" element={<ShopkeeperLogin/>}/>
        <Route path="/user" element={<UserLogin/>}/>
    </Routes>
    </>
  )
}

export default GetStartedPage